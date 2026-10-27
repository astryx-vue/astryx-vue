import type { ComputedRef, Ref } from 'vue'
import type { SheetPointerSession } from './sheetPointerSession.js'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  blockScrollEdges,
  dismissTravelFor,
  DRAG_PROMOTION_SLOP,
  dragOffsetFrom,
  FLICK_MIN_DISTANCE,
  FLICK_VELOCITY,
  hapticTick,
  naturalEndGapFor,
  OVERSCROLL_PADDING,
  velocityFor,
} from './sheetDragMath.js'
import { createSheetPointerSession } from './sheetPointerSession.js'
import {
  computeDetentOffsets,
  peekOffsetFor,
  resolveSettleOffset,
  scrimOpacityForOffset,
  visibleHeightForOffset,
} from './snapOffsets.js'

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
  let touchArming: { identifier: number, startY: number, atTop: boolean, atBottom: boolean } | null = null
  let reconcileToken = 0
  let observer: ResizeObserver | null = null
  let session!: SheetPointerSession

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
    const dismissOffset = dismissTravelFor(detents.height, detents.offsets)
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
    const next = dragOffsetFrom(state.baseOffset, delta, state.offsets)
    state.rawOffset = next.raw
    dragOffset.value = next.shown
    scrimOpacity.value = scrimOpacityForOffset(next.raw, state.offsets, dismissTravelFor(state.height, state.offsets), state.peekOffset)
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
    session.detach()
    if (!state)
      return
    isDragging.value = false

    const velocity = velocityFor(state.samples, state.lastY, state.lastT, state.startY, state.startT)
    const isFlick = Math.abs(velocity) > FLICK_VELOCITY && state.travel > FLICK_MIN_DISTANCE
    if (state.dir > 0 && isFlick) {
      dismissOrSettleShortest(state.baseOffset, state)
      return
    }
    if (state.dir < 0 && isFlick) {
      settleAt(0, state.baseOffset, state)
      return
    }
    if (state.rawOffset > dismissTravelFor(state.height, state.offsets)) {
      dismissOrSettleShortest(state.baseOffset, state)
      return
    }
    settleAt(resolveSettleOffset(state.rawOffset, state.offsets, state.dir, state.baseOffset), state.baseOffset, state)
  }

  function cancelDrag(): void {
    const state = dragState
    pendingBody = null
    touchArming = null
    dragState = null
    session.detach()
    if (!state)
      return
    isDragging.value = false
    dragOffset.value = state.baseOffset
    settledOffset.value = state.baseOffset
    scrimOpacity.value = scrimOpacityForOffset(
      state.baseOffset,
      state.offsets,
      dismissTravelFor(state.height, state.offsets),
      state.peekOffset,
    )
    onScrimOpacity(scrimOpacity.value)
  }

  /** A second finger is a pinch. The browser keeps the zoom; the sheet lets go. */
  function yieldToPinch(pointerId: number): boolean {
    if (dragState == null || dragState.pointerId === pointerId)
      return false
    cancelDrag()
    return true
  }

  function onPointerMove(event: PointerEvent): void {
    if (dragState != null) {
      if (yieldToPinch(event.pointerId))
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
      session.detach()
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
      session.detach()
      return
    }
    endDrag()
  }

  function onPointerCancel(event: PointerEvent): void {
    if (dragState != null && dragState.pointerId !== event.pointerId)
      return
    cancelDrag()
  }

  function onHandlePointerDown(event: PointerEvent): void {
    if (event.button != null && event.button !== 0)
      return
    if (yieldToPinch(event.pointerId))
      return
    session.attach()
    beginDrag(event.pointerId, event.clientY, event.timeStamp)
    if (event.cancelable)
      event.preventDefault()
  }

  function onBodyPointerDown(event: PointerEvent): void {
    if (yieldToPinch(event.pointerId))
      return
    if (event.pointerType === 'touch')
      return
    if (event.button != null && event.button !== 0)
      return
    const element = body.value
    if (!element)
      return
    const edges = blockScrollEdges(element, event.target)
    pendingBody = {
      pointerId: event.pointerId,
      startY: event.clientY,
      atTop: edges.atTop,
      atBottom: edges.atBottom,
    }
    session.attach()
  }

  function onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 1) {
      touchArming = null
      cancelDrag()
      return
    }
    const touch = event.changedTouches[0]
    const element = body.value
    if (!touch || !element) {
      touchArming = null
      return
    }
    const edges = blockScrollEdges(element, event.target)
    touchArming = {
      identifier: touch.identifier,
      startY: touch.clientY,
      atTop: edges.atTop,
      atBottom: edges.atBottom,
    }
  }

  function onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 1) {
      touchArming = null
      cancelDrag()
      return
    }
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

  session = createSheetPointerSession({
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onWindowBlur: () => cancelDrag(),
  })

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

  watch(body, (element) => {
    session.setBody(element)
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

  onBeforeUnmount(() => {
    session.destroy()
    observer?.disconnect()
    observer = null
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
