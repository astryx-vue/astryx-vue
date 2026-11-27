import type { ComputedRef, Ref } from 'vue'
import type { VelocityTracker } from '../gestures/VelocityTracker'
import type { SheetPointerSession } from './sheetPointerSession.js'
import type { SheetDragExit } from './sheetRelease.js'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { dismissTravelFor, hapticTick, naturalEndGapFor, stretchedOffset } from './sheetDragMath.js'
import { createSheetPointerArm } from './sheetPointerArm.js'
import { createSheetPointerSession } from './sheetPointerSession.js'
import { resolveSheetRelease } from './sheetRelease.js'
import { createSheetTouchArm } from './sheetTouchArm.js'
import { computeDetentOffsets, peekOffsetFor, scrimOpacityForOffset, visibleHeightForOffset } from './snapOffsets.js'

interface SheetDetents {
  height: number
  offsets: number[]
  peekOffset: number | null
  reserve: number
}

interface DragState extends SheetDetents {
  pointerId: number
  pointerType: string
  /** Whether the body's touch listeners drive this drag rather than window pointer events. */
  viaTouch: boolean
  startY: number
  /** The contact's positions on the timestamps their events carry. */
  tracker: VelocityTracker
  baseOffset: number
  /** Whether the drag has moved the sheet off its detent. */
  hasTraveled: boolean
}

/** Where a close holds the sheet: the drag's last transform, until the exit takes over. */
interface HeldClose {
  offset: number
  layoutOffset: number
}

export interface SheetDragStart {
  pointerId: number
  pointerType: string
  /** Where the drag is anchored, so travel before the promotion counts. */
  startY: number
  /** The contact's samples since it landed. */
  tracker: VelocityTracker
  viaTouch: boolean
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
  /** How far the sheet's surface reaches below the screen, px. */
  reserve: Ref<number>
  /** Resolves the snap points to visible heights at gesture time. */
  getSnapHeights: () => number[]
  /** Reports scrim opacity as the sheet is dragged. */
  onScrimOpacity: (opacity: number) => void
  /** Reports the visible height of a settled stop. */
  onSnap: (visibleHeight: number) => void
  /** Called when a gesture asks the sheet to close. */
  onDismiss: () => void
  /** Called once a drag first moves the sheet off its detent. */
  onTravelStart?: () => void
}

export interface SheetGestures {
  isDragging: Ref<boolean>
  isReconciling: Ref<boolean>
  isOverflowing: Ref<boolean>
  /** Whether the sheet rests at its full height, its first detent. */
  isAtFullHeight: ComputedRef<boolean>
  panelTransform: ComputedRef<string | undefined>
  panelHeight: ComputedRef<string | undefined>
  scrollPreservationInset: Ref<number>
  scrimOpacity: Ref<number>
  /** The exit a touch drag's release started; null for any other close. */
  dragExit: Ref<SheetDragExit | null>
  /** Whether the current close came from a finger's swipe. */
  isDismissedByTouchDrag: Ref<boolean>
  onHandlePointerDown: (event: PointerEvent) => void
  onBodyPointerDown: (event: PointerEvent) => void
  updateOverflow: () => void
}

/** Drag, snap, and settle behavior of the sheet panel. */
export function useSheetGestures(options: UseSheetGesturesOptions): SheetGestures {
  const { panel, body, isOpen, canDismiss, reserve, getSnapHeights, onScrimOpacity, onSnap, onDismiss, onTravelStart } = options

  const isDragging = ref(false)
  const isReconciling = ref(false)
  const isOverflowing = ref(false)
  const dragOffset = ref(0)
  const settledOffset = ref(0)
  const settledLayoutOffset = ref(0)
  const scrollPreservationInset = ref(0)
  const scrimOpacity = ref(1)
  const sheetHeight = ref(0)
  const heldClose = ref<HeldClose | null>(null)
  const dragExit = ref<SheetDragExit | null>(null)
  const isDismissedByTouchDrag = ref(false)

  let dragState: DragState | null = null
  /** The scrim of the stop a drag's close left, until the host answers the close. */
  let pendingDismissal: { restingScrim: number } | null = null
  let reconcileToken = 0
  let observer: ResizeObserver | null = null
  let session!: SheetPointerSession

  const activeOffset = computed(() => (isDragging.value ? dragOffset.value : settledOffset.value))
  /** Dragging above the base stop restores the full layout height below the viewport. */
  const layoutOffset = computed(() => {
    if (heldClose.value != null)
      return heldClose.value.layoutOffset
    if (isDragging.value)
      return dragOffset.value < settledOffset.value ? 0 : settledLayoutOffset.value
    return settledLayoutOffset.value
  })

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
    const inset = reserve.value
    const visible = visibleHeightForOffset(height, 0, inset)
    const offsets = computeDetentOffsets(visible, getSnapHeights())
    return { height, offsets, peekOffset: peekOffsetFor(offsets, visible), reserve: inset }
  }

  function scrimFor(offset: number, detents: SheetDetents): number {
    return scrimOpacityForOffset(offset, detents.offsets, dismissTravelFor(detents.height, detents.offsets, detents.reserve), detents.peekOffset)
  }

  function reportScrim(opacity: number): void {
    scrimOpacity.value = opacity
    onScrimOpacity(opacity)
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
    // A peek keeps the full layout height and slides below the viewport; every
    // taller stop resizes the scrolling area to what it shows.
    const targetLayoutOffset = target === detents.peekOffset ? 0 : target
    settledOffset.value = target
    scrollPreservationInset.value = Math.max(0, fromOffset - targetLayoutOffset - naturalEndGapFor(body.value))
    reportScrim(scrimFor(target, detents))
    onSnap(visibleHeightForOffset(detents.height, target, detents.reserve))
    if (target !== fromOffset)
      hapticTick()
    if (targetLayoutOffset === settledLayoutOffset.value && !isReconciling.value)
      return
    void reconcileLayout(targetLayoutOffset)
  }

  function clearDragClose(): void {
    pendingDismissal = null
    heldClose.value = null
    dragExit.value = null
    isDismissedByTouchDrag.value = false
  }

  /**
   * Asks the host to close. The sheet holds where the finger left it, so the
   * exit starts from there. The host answers in its next render: a host that
   * keeps the sheet open sends it back to its stop, the scrim with it.
   */
  function closeSheet(exit: SheetDragExit | null, state: DragState): void {
    if (!canDismiss.value) {
      settleAt(state.offsets[state.offsets.length - 1] ?? 0, state.baseOffset, state)
      return
    }
    heldClose.value = { offset: dragOffset.value, layoutOffset: layoutOffset.value }
    isDismissedByTouchDrag.value = state.pointerType === 'touch'
    dragExit.value = exit
    const request = { restingScrim: scrimFor(state.baseOffset, state) }
    pendingDismissal = request
    onDismiss()
    void nextTick(() => {
      if (pendingDismissal !== request)
        return
      pendingDismissal = null
      if (!isOpen.value)
        return
      clearDragClose()
      reportScrim(request.restingScrim)
    })
  }

  function beginDrag(start: SheetDragStart, clientY: number, timeStamp: number): void {
    clearDragClose()
    start.tracker.add(0, clientY, timeStamp)
    dragState = {
      ...resolveDetents(),
      ...start,
      baseOffset: settledOffset.value,
      hasTraveled: false,
    }
    // Seeded at the resting stop, so flipping isDragging never jumps the sheet.
    dragOffset.value = settledOffset.value
    isDragging.value = true
  }

  function moveDrag(clientY: number, timeStamp: number): void {
    const state = dragState
    if (!state)
      return
    // One sample per event, on the event's own timestamp: when the finger was
    // there, however late a busy main thread handles the event.
    state.tracker.add(0, clientY, timeStamp)
    const raw = state.baseOffset + clientY - state.startY
    const shown = stretchedOffset(raw, state.offsets, state)
    dragOffset.value = shown
    if (!state.hasTraveled && shown !== state.baseOffset) {
      state.hasTraveled = true
      onTravelStart?.()
    }
    reportScrim(scrimFor(shown, state))
  }

  function endDrag(clientY: number, timeStamp: number): void {
    const state = dragState
    dragState = null
    session.detach()
    if (!state)
      return
    const delta = clientY - state.startY
    // A lift at a new position is the last sample. A finger that held still
    // before the lift releases nothing in motion.
    if (state.tracker.lastSample?.y !== clientY)
      state.tracker.add(0, clientY, timeStamp)
    const release = resolveSheetRelease({
      offset: Math.max(0, state.baseOffset + delta),
      velocity: state.tracker.velocity(timeStamp).y / 1000,
      height: state.height || 1,
      dir: Math.sign(delta),
      travel: Math.abs(delta),
      baseOffset: state.baseOffset,
      offsets: state.offsets,
      reserve: state.reserve,
      isTouch: state.pointerType === 'touch',
    })
    if (release.kind === 'close')
      closeSheet(release.exit, state)
    isDragging.value = false
    if (release.kind === 'settle')
      settleAt(release.target, state.baseOffset, state)
  }

  /** The drag in flight returns to its stop; the arms keep tracking their contacts. */
  function dropDrag(): void {
    const state = dragState
    dragState = null
    session.detach()
    if (!state)
      return
    isDragging.value = false
    dragOffset.value = state.baseOffset
    settledOffset.value = state.baseOffset
    reportScrim(scrimFor(state.baseOffset, state))
  }

  const dragPointerId = (): number | null => dragState?.pointerId ?? null

  const touchArm = createSheetTouchArm({
    activeOffset: () => activeOffset.value,
    dragPointerId: () => (dragState?.viaTouch ? dragState.pointerId : null),
    begin: (start, clientY, timeStamp) => beginDrag({ ...start, viaTouch: true }, clientY, timeStamp),
    move: moveDrag,
    end: endDrag,
    cancel: dropDrag,
    yieldToPinch: cancelDrag,
  })

  const pointerArm = createSheetPointerArm({
    body: () => body.value,
    dragPointerId,
    isTouchDrag: () => dragState?.viaTouch ?? false,
    attach: () => session.attach(),
    detach: () => session.detach(),
    begin: (start, clientY, timeStamp) => beginDrag({ ...start, viaTouch: false }, clientY, timeStamp),
    move: moveDrag,
    end: endDrag,
    cancel: cancelDrag,
  })

  /** Every arm and any drag in flight let go: the sheet returns to its stop. */
  function cancelDrag(): void {
    pointerArm.reset()
    touchArm.reset()
    dropDrag()
  }

  function updateOverflow(): void {
    const element = body.value
    isOverflowing.value = element != null
      && (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1)
  }

  function recordSheetHeight(height: number): void {
    if (isDragging.value || settledLayoutOffset.value > 0 || isReconciling.value)
      return
    if (height > 0)
      sheetHeight.value = height
  }

  session = createSheetPointerSession({
    onPointerMove: pointerArm.onPointerMove,
    onPointerUp: pointerArm.onPointerUp,
    onPointerCancel: pointerArm.onPointerCancel,
    onTouchStart: touchArm.onTouchStart,
    onTouchMove: touchArm.onTouchMove,
    onTouchEnd: touchArm.onTouchEnd,
    onInterrupt: () => cancelDrag(),
  })

  // The open height comes from the ResizeObserver, which reports the border
  // box after the browser's own layout; only without one is it measured here.
  watch(panel, (element) => {
    observer?.disconnect()
    observer = null
    if (!element)
      return
    if (typeof ResizeObserver === 'undefined') {
      recordSheetHeight(element.getBoundingClientRect().height)
      return
    }
    observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1]
      recordSheetHeight(entry?.borderBoxSize?.[0]?.blockSize ?? element.getBoundingClientRect().height)
      updateOverflow()
    })
    observer.observe(element)
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
      // The host took the close: the held position and the exit stand until the sheet opens again.
      pendingDismissal = null
      return
    }
    clearDragClose()
    dragOffset.value = 0
    settledOffset.value = 0
    settledLayoutOffset.value = 0
    scrimOpacity.value = 1
    if (typeof ResizeObserver === 'undefined')
      void nextTick(() => recordSheetHeight(panel.value?.getBoundingClientRect().height ?? 0))
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
    const offset = heldClose.value?.offset ?? activeOffset.value
    const translation = offset - layoutOffset.value
    return translation !== 0 ? `translateY(${translation}px)` : undefined
  })

  const panelHeight = computed(() => {
    if (layoutOffset.value <= 0 || sheetHeight.value <= 0)
      return undefined
    return `${Math.max(0, sheetHeight.value - layoutOffset.value)}px`
  })

  return {
    isDragging,
    isReconciling,
    isOverflowing,
    isAtFullHeight: computed(() => settledOffset.value === 0),
    panelTransform,
    panelHeight,
    scrollPreservationInset,
    scrimOpacity,
    dragExit,
    isDismissedByTouchDrag,
    onHandlePointerDown: pointerArm.onHandlePointerDown,
    onBodyPointerDown: pointerArm.onBodyPointerDown,
    updateOverflow,
  }
}
