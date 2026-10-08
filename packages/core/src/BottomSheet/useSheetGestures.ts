import type { ComputedRef, Ref } from 'vue'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  computeDetentOffsets,
  peekOffsetFor,
  resolveSettleOffset,
  scrimOpacityForOffset,
  visibleHeightForOffset,
} from './snapOffsets.js'

/** Border-box portion of the panel reserved below the viewport for the drag lift. */
export const OVERSCROLL_PADDING = 48

/** A throw this fast, over at least `FLICK_MIN_DISTANCE`, dismisses or expands outright. */
const FLICK_VELOCITY = 1.2
const FLICK_MIN_DISTANCE = 48
/** Below the shortest stop, dragging past it by this share of its height dismisses. */
const DISMISS_OVERSHOOT_RATIO = 0.4
/** Within this many px of a stop the live drag eases toward it. */
const MAGNET_RANGE = 40
/** Rubber-band factor and ceiling for dragging above the fully open position. */
const OVERSCROLL_RESISTANCE = 0.35
const OVERSCROLL_MAX = 48
/** How far a finger on the body must pull before it becomes a sheet drag. */
const DRAG_PROMOTION_SLOP = 8
const VELOCITY_WINDOW_MS = 100
const BACKSTOP_BUFFER_MS = 50

function parseTransitionTime(value: string): number | null {
  const normalized = value.trim()
  if (!/^-?(?:\d+|\d*\.\d+)(?:ms|s)$/.test(normalized))
    return null
  const time = Number.parseFloat(normalized)
  return normalized.endsWith('ms') ? time : time * 1000
}

/** Longest transition duration + delay that applies to `property`, in ms. */
function transitionMsFor(element: HTMLElement, property: string): number {
  const style = getComputedStyle(element)
  const properties = (style.transitionProperty || '').split(',').map(value => value.trim())
  const durations = (style.transitionDuration || '').split(',').map(parseTransitionTime)
  const delays = (style.transitionDelay || '').split(',').map(value => parseTransitionTime(value) ?? 0)
  return properties.reduce((longest, name, index) => {
    if (name !== property && name !== 'all')
      return longest
    const duration = durations[index % durations.length]
    if (duration == null)
      return longest
    return Math.max(longest, duration + (delays[index % delays.length] ?? 0))
  }, 0)
}

/**
 * Calls `complete` when `element` finishes transitioning `property`: on the
 * matching `transitionend`/`transitioncancel`, or on a timer backstop so a
 * missed event can never strand the caller. Without a resolved duration — the
 * case in a stylesheet-free test environment — it completes immediately.
 */
export function waitForTransition(element: HTMLElement | null, property: 'transform' | 'opacity', complete: () => void): () => void {
  if (element == null) {
    complete()
    return () => {}
  }

  let done = false
  let timer: ReturnType<typeof setTimeout> | null = null
  let onTransitionEnd: (event: TransitionEvent) => void = () => {}
  const finish = (): void => {
    if (done)
      return
    done = true
    if (timer != null)
      clearTimeout(timer)
    element.removeEventListener('transitionend', onTransitionEnd)
    element.removeEventListener('transitioncancel', onTransitionEnd)
    complete()
  }
  onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target === element && event.propertyName === property)
      finish()
  }

  const duration = transitionMsFor(element, property)
  if (duration <= 0) {
    finish()
    return () => {}
  }

  element.addEventListener('transitionend', onTransitionEnd)
  element.addEventListener('transitioncancel', onTransitionEnd)
  timer = setTimeout(finish, duration + BACKSTOP_BUFFER_MS)
  return () => {
    if (timer != null)
      clearTimeout(timer)
    element.removeEventListener('transitionend', onTransitionEnd)
    element.removeEventListener('transitioncancel', onTransitionEnd)
  }
}

function magnetize(value: number, targets: readonly number[]): number {
  if (targets.length === 0)
    return value
  let nearest = targets[0]
  for (const target of targets) {
    if (Math.abs(target - value) < Math.abs(nearest - value))
      nearest = target
  }
  const distance = Math.abs(value - nearest)
  if (distance >= MAGNET_RANGE)
    return value
  const t = distance / MAGNET_RANGE
  return value + (nearest - value) * (1 - t * t)
}

function renderedBlockEndPadding(element: HTMLElement): number {
  const value = Number.parseFloat(getComputedStyle(element).paddingBlockEnd)
  return Number.isFinite(value) ? value : 0
}

/** How much further the body could scroll on its own, ignoring the inset this hook adds. */
function naturalEndGapFor(body: HTMLElement | null): number {
  if (!body)
    return 0
  const inset = renderedBlockEndPadding(body)
  const maxScrollTop = Math.max(0, body.scrollHeight - body.clientHeight - inset)
  return maxScrollTop - body.scrollTop
}

function hapticTick(): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function')
    return
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    return
  navigator.vibrate(8)
}

interface SheetDetents {
  height: number
  offsets: number[]
  peekOffset: number | null
}

interface DragState extends SheetDetents {
  pointerId: number
  startY: number
  startT: number
  lastY: number
  lastT: number
  samples: { y: number, t: number }[]
  baseOffset: number
  baseLayoutOffset: number
  rawOffset: number
  dir: number
  travel: number
}

export interface UseSheetGesturesOptions {
  /** Panel element that carries the surface and its motion. */
  panel: Ref<HTMLElement | null>
  /** Scrolling body element. */
  body: Ref<HTMLElement | null>
  /** Whether the sheet is presented; drag state resets every time it opens. */
  isOpen: Ref<boolean>
  /** Whether a downward swipe may dismiss the sheet. */
  canDismiss: Ref<boolean>
  /** Resolves the snap points to visible heights at gesture time. */
  getSnapHeights: () => number[]
  /** Reports scrim opacity as the sheet is dragged. */
  onScrimOpacity: (opacity: number) => void
  /** Reports the visible height of a settled stop. */
  onSnap: (visibleHeight: number) => void
  /** Called when a gesture asks the sheet to close. */
  onDismiss: () => void
}

export interface SheetGestures {
  isDragging: Ref<boolean>
  isReconciling: Ref<boolean>
  isOverflowing: Ref<boolean>
  panelTransform: ComputedRef<string | undefined>
  panelHeight: ComputedRef<string | undefined>
  scrollPreservationInset: Ref<number>
  scrimOpacity: Ref<number>
  onHandlePointerDown: (event: PointerEvent) => void
  onBodyPointerDown: (event: PointerEvent) => void
  updateOverflow: () => void
}

/** Drag, snap, and settle behavior of the sheet panel. */
export function useSheetGestures(options: UseSheetGesturesOptions): SheetGestures {
  const { panel, body, isOpen, canDismiss, getSnapHeights, onScrimOpacity, onSnap, onDismiss } = options

  const isDragging = ref(false)
  const isReconciling = ref(false)
  const isOverflowing = ref(false)
  const dragOffset = ref(0)
  const settledOffset = ref(0)
  const settledLayoutOffset = ref(0)
  const scrollPreservationInset = ref(0)
  const scrimOpacity = ref(1)
  const sheetHeight = ref(0)

  let dragState: DragState | null = null
  let pendingBody: { pointerId: number, startY: number, atTop: boolean, atBottom: boolean } | null = null
  let reconcileToken = 0
  let observer: ResizeObserver | null = null

  const activeOffset = computed(() => (isDragging.value ? dragOffset.value : settledOffset.value))

  function measureNaturalHeight(): number {
    const element = panel.value
    if (!element)
      return 0
    const inlineHeight = element.style.height
    if (inlineHeight === '')
      return element.getBoundingClientRect().height
    element.style.height = ''
    const height = element.getBoundingClientRect().height
    element.style.height = inlineHeight
    return height
  }

  function resolveDetents(): SheetDetents {
    const measured = measureNaturalHeight()
    if (measured > 0)
      sheetHeight.value = measured
    const height = measured > 0 ? measured : sheetHeight.value
    const visible = visibleHeightForOffset(height, 0, OVERSCROLL_PADDING)
    const offsets = computeDetentOffsets(visible, getSnapHeights())
    return { height, offsets, peekOffset: peekOffsetFor(offsets, visible) }
  }

  function dismissOffsetFor(detents: SheetDetents): number {
    const maxOffset = detents.offsets[detents.offsets.length - 1] ?? 0
    const shortestHeight = visibleHeightForOffset(detents.height, maxOffset, OVERSCROLL_PADDING)
    return maxOffset + shortestHeight * DISMISS_OVERSHOOT_RATIO
  }

  async function reconcileLayout(targetLayoutOffset: number): Promise<void> {
    const token = ++reconcileToken
    isReconciling.value = true
    await nextTick()
    if (token !== reconcileToken)
      return
    settledLayoutOffset.value = targetLayoutOffset
    await nextTick()
    if (token !== reconcileToken)
      return
    isReconciling.value = false
    scrollPreservationInset.value = 0
  }

  function settleAt(target: number, fromOffset: number, detents: SheetDetents): void {
    const targetLayoutOffset = target === detents.peekOffset ? 0 : target
    const dismissOffset = dismissOffsetFor(detents)
    settledOffset.value = target
    scrollPreservationInset.value = Math.max(0, fromOffset - targetLayoutOffset - naturalEndGapFor(body.value))
    scrimOpacity.value = scrimOpacityForOffset(target, detents.offsets, dismissOffset, detents.peekOffset)
    onScrimOpacity(scrimOpacity.value)
    onSnap(visibleHeightForOffset(detents.height, target, OVERSCROLL_PADDING))
    if (target !== fromOffset)
      hapticTick()
    if (targetLayoutOffset === settledLayoutOffset.value && !isReconciling.value)
      return
    void reconcileLayout(targetLayoutOffset)
  }

  function dismissOrSettleShortest(fromOffset: number, detents: SheetDetents): void {
    if (canDismiss.value) {
      settledOffset.value = fromOffset
      dragOffset.value = fromOffset
      scrimOpacity.value = 1
      onScrimOpacity(1)
      onDismiss()
      return
    }
    settleAt(detents.offsets[detents.offsets.length - 1] ?? 0, fromOffset, detents)
  }

  function velocityFor(state: DragState): number {
    const withinWindow = state.samples.filter(sample => state.lastT - sample.t <= VELOCITY_WINDOW_MS)
    const first = withinWindow[0] ?? { y: state.startY, t: state.startT }
    const elapsed = state.lastT - first.t
    return elapsed > 0 ? (state.lastY - first.y) / elapsed : 0
  }

  function updateDrag(clientY: number, timeStamp: number): void {
    const state = dragState
    if (!state)
      return
    const delta = clientY - state.startY
    state.lastY = clientY
    state.lastT = timeStamp
    state.samples.push({ y: clientY, t: timeStamp })
    state.travel = Math.max(state.travel, Math.abs(delta))
    state.dir = delta === 0 ? 0 : Math.sign(delta)

    let offset = state.baseOffset + delta
    if (offset < 0)
      offset = -Math.min(-offset * OVERSCROLL_RESISTANCE, OVERSCROLL_MAX)
    state.rawOffset = offset
    dragOffset.value = magnetize(offset, state.offsets)
    scrimOpacity.value = scrimOpacityForOffset(offset, state.offsets, dismissOffsetFor(state), state.peekOffset)
    onScrimOpacity(scrimOpacity.value)
  }

  function beginDrag(pointerId: number, clientY: number, timeStamp: number): void {
    const detents = resolveDetents()
    dragState = {
      ...detents,
      pointerId,
      startY: clientY,
      startT: timeStamp,
      lastY: clientY,
      lastT: timeStamp,
      samples: [{ y: clientY, t: timeStamp }],
      baseOffset: settledOffset.value,
      baseLayoutOffset: settledLayoutOffset.value,
      rawOffset: settledOffset.value,
      dir: 0,
      travel: 0,
    }
    dragOffset.value = settledOffset.value
    isDragging.value = true
  }

  function endDrag(): void {
    const state = dragState
    dragState = null
    detachPointerListeners()
    if (!state)
      return
    isDragging.value = false

    const velocity = velocityFor(state)
    const isFlick = Math.abs(velocity) > FLICK_VELOCITY && state.travel > FLICK_MIN_DISTANCE
    if (state.dir > 0 && isFlick) {
      dismissOrSettleShortest(state.baseOffset, state)
      return
    }
    if (state.dir < 0 && isFlick) {
      settleAt(0, state.baseOffset, state)
      return
    }
    if (state.rawOffset > dismissOffsetFor(state)) {
      dismissOrSettleShortest(state.baseOffset, state)
      return
    }
    settleAt(resolveSettleOffset(state.rawOffset, state.offsets, state.dir, state.baseOffset), state.baseOffset, state)
  }

  function cancelDrag(): void {
    const state = dragState
    pendingBody = null
    dragState = null
    detachPointerListeners()
    if (!state)
      return
    isDragging.value = false
    dragOffset.value = state.baseOffset
    settledOffset.value = state.baseOffset
    scrimOpacity.value = scrimOpacityForOffset(
      state.baseOffset,
      state.offsets,
      dismissOffsetFor(state),
      state.peekOffset,
    )
    onScrimOpacity(scrimOpacity.value)
  }

  function onPointerMove(event: PointerEvent): void {
    if (dragState != null) {
      if (dragState.pointerId !== event.pointerId)
        return
      if (event.cancelable)
        event.preventDefault()
      updateDrag(event.clientY, event.timeStamp)
      return
    }
    const pending = pendingBody
    if (pending == null || pending.pointerId !== event.pointerId)
      return
    const delta = event.clientY - pending.startY
    if (Math.abs(delta) < DRAG_PROMOTION_SLOP)
      return
    const pullingDown = delta > 0 && pending.atTop
    const pullingUp = delta < 0 && pending.atBottom && activeOffset.value > 0
    if (!pullingDown && !pullingUp) {
      pendingBody = null
      detachPointerListeners()
      return
    }
    pendingBody = null
    beginDrag(pending.pointerId, pending.startY, event.timeStamp)
    if (event.cancelable)
      event.preventDefault()
    updateDrag(event.clientY, event.timeStamp)
  }

  function onPointerUp(event: PointerEvent): void {
    if (dragState != null && dragState.pointerId !== event.pointerId)
      return
    pendingBody = null
    if (dragState == null) {
      detachPointerListeners()
      return
    }
    endDrag()
  }

  function onPointerCancel(event: PointerEvent): void {
    if (dragState != null && dragState.pointerId !== event.pointerId)
      return
    cancelDrag()
  }

  function attachPointerListeners(): void {
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
  }

  function detachPointerListeners(): void {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerCancel)
  }

  function onHandlePointerDown(event: PointerEvent): void {
    if (event.button != null && event.button !== 0)
      return
    attachPointerListeners()
    beginDrag(event.pointerId, event.clientY, event.timeStamp)
    if (event.cancelable)
      event.preventDefault()
  }

  function onBodyPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'touch')
      return
    if (event.button != null && event.button !== 0)
      return
    const element = body.value
    if (!element)
      return
    pendingBody = {
      pointerId: event.pointerId,
      startY: event.clientY,
      atTop: element.scrollTop <= 0,
      atBottom: element.scrollTop + element.clientHeight >= element.scrollHeight - 1,
    }
    attachPointerListeners()
  }

  let touchArming: { identifier: number, startY: number, atTop: boolean, atBottom: boolean } | null = null

  function onTouchStart(event: TouchEvent): void {
    const touch = event.changedTouches[0]
    const element = body.value
    if (!touch || !element) {
      touchArming = null
      return
    }
    touchArming = {
      identifier: touch.identifier,
      startY: touch.clientY,
      atTop: element.scrollTop <= 0,
      atBottom: element.scrollTop + element.clientHeight >= element.scrollHeight - 1,
    }
  }

  function onTouchMove(event: TouchEvent): void {
    const element = body.value
    if (dragState != null) {
      const touch = Array.from(event.changedTouches).find(item => item.identifier === dragState?.pointerId)
      if (!touch)
        return
      if (event.cancelable)
        event.preventDefault()
      updateDrag(touch.clientY, event.timeStamp)
      return
    }
    const arming = touchArming
    if (arming == null || !element)
      return
    const touch = Array.from(event.changedTouches).find(item => item.identifier === arming.identifier)
    if (!touch)
      return
    const delta = touch.clientY - arming.startY
    if (Math.abs(delta) < DRAG_PROMOTION_SLOP)
      return
    const pullingDown = delta > 0 && arming.atTop
    const pullingUp = delta < 0 && arming.atBottom && activeOffset.value > 0
    if (!pullingDown && !pullingUp) {
      touchArming = null
      return
    }
    touchArming = null
    if (event.cancelable)
      event.preventDefault()
    beginDrag(arming.identifier, arming.startY, event.timeStamp)
    updateDrag(touch.clientY, event.timeStamp)
  }

  function onTouchEnd(event: TouchEvent): void {
    const arming = touchArming
    if (arming != null && Array.from(event.changedTouches).some(item => item.identifier === arming.identifier))
      touchArming = null
    if (dragState != null && Array.from(event.changedTouches).some(item => item.identifier === dragState?.pointerId))
      endDrag()
  }

  function updateOverflow(): void {
    const element = body.value
    isOverflowing.value = element != null
      && (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1)
  }

  function recordSheetHeight(): void {
    if (isDragging.value || settledLayoutOffset.value > 0 || isReconciling.value)
      return
    const height = panel.value?.getBoundingClientRect().height ?? 0
    if (height > 0)
      sheetHeight.value = height
  }

  watch(panel, (element) => {
    observer?.disconnect()
    observer = null
    if (!element || typeof ResizeObserver === 'undefined')
      return
    observer = new ResizeObserver(() => {
      recordSheetHeight()
      updateOverflow()
    })
    observer.observe(element)
    recordSheetHeight()
  }, { immediate: true })

  watch(body, (element, previous) => {
    if (previous) {
      previous.removeEventListener('touchstart', onTouchStart)
      previous.removeEventListener('touchmove', onTouchMove)
      previous.removeEventListener('touchend', onTouchEnd)
      previous.removeEventListener('touchcancel', onTouchEnd)
    }
    if (!element)
      return
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd)
    element.addEventListener('touchcancel', onTouchEnd)
    updateOverflow()
  }, { immediate: true })

  watch(isOpen, (open) => {
    ++reconcileToken
    cancelDrag()
    isReconciling.value = false
    scrollPreservationInset.value = 0
    if (!open) {
      dragState = null
      pendingBody = null
      touchArming = null
      return
    }
    dragOffset.value = 0
    settledOffset.value = 0
    settledLayoutOffset.value = 0
    scrimOpacity.value = 1
    void nextTick(recordSheetHeight)
  })

  watch(canDismiss, (allowed) => {
    if (!allowed)
      cancelDrag()
  })

  const onWindowBlur = (): void => cancelDrag()
  if (typeof window !== 'undefined')
    window.addEventListener('blur', onWindowBlur)

  onBeforeUnmount(() => {
    detachPointerListeners()
    observer?.disconnect()
    observer = null
    if (typeof window !== 'undefined')
      window.removeEventListener('blur', onWindowBlur)
  })

  const panelTransform = computed(() => {
    const layoutOffset = isDragging.value
      ? (dragOffset.value < settledOffset.value ? 0 : settledLayoutOffset.value)
      : settledLayoutOffset.value
    const translation = activeOffset.value - layoutOffset
    return translation !== 0 ? `translateY(${translation}px)` : undefined
  })

  const panelHeight = computed(() => {
    const layoutOffset = isDragging.value
      ? (dragOffset.value < settledOffset.value ? 0 : settledLayoutOffset.value)
      : settledLayoutOffset.value
    if (layoutOffset <= 0 || sheetHeight.value <= 0)
      return undefined
    return `${Math.max(0, sheetHeight.value - layoutOffset)}px`
  })

  return {
    isDragging,
    isReconciling,
    isOverflowing,
    panelTransform,
    panelHeight,
    scrollPreservationInset,
    scrimOpacity,
    onHandlePointerDown,
    onBodyPointerDown,
    updateOverflow,
  }
}
