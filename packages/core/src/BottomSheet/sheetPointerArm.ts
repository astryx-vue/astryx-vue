import { VelocityTracker } from '../gestures/VelocityTracker'
import { DRAG_PROMOTION_SLOP, isInsideNestedLayer } from './sheetDragMath.js'
import { chainAtTop, scrollChainUnder } from './sheetScrollChain.js'

/** What the pointer path drives: the sheet's one drag. */
export interface SheetPointerDrive {
  body: () => HTMLElement | null
  /** The contact driving the drag in flight, or null when none runs. */
  dragPointerId: () => number | null
  /** Whether the drag in flight belongs to the body's touch listeners. */
  isTouchDrag: () => boolean
  /** Starts and stops the window pointer listeners. */
  attach: () => void
  detach: () => void
  begin: (start: { pointerId: number, pointerType: string, startY: number, tracker: VelocityTracker }, clientY: number, timeStamp: number) => void
  move: (clientY: number, timeStamp: number) => void
  end: (clientY: number, timeStamp: number) => void
  cancel: () => void
}

interface PointerArm {
  pointerId: number
  pointerType: string
  startY: number
  scrollers: HTMLElement[]
  tracker: VelocityTracker
}

export interface SheetPointerArm {
  onPointerMove: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onPointerCancel: (event: PointerEvent) => void
  onHandlePointerDown: (event: PointerEvent) => void
  onBodyPointerDown: (event: PointerEvent) => void
  /** Drops the body's arm without touching a drag in flight. */
  reset: () => void
}

/**
 * The handle's drag for every pointer, and the body's pull down at its top for
 * a mouse or a pen. A finger's pull on the body belongs to the touch listeners
 * alone, so a touch-down never arms here.
 */
export function createSheetPointerArm(drive: SheetPointerDrive): SheetPointerArm {
  let arm: PointerArm | null = null

  function reset(): void {
    arm = null
  }

  /** A second pointer is a pinch. The browser keeps the zoom; the sheet lets go. */
  function yieldToPinch(pointerId: number): boolean {
    const active = drive.dragPointerId()
    if (active == null || active === pointerId)
      return false
    drive.cancel()
    return true
  }

  function onPointerMove(event: PointerEvent): void {
    if (drive.dragPointerId() != null) {
      // The touch listeners already drive a finger's drag.
      if (drive.isTouchDrag() || yieldToPinch(event.pointerId))
        return
      if (event.cancelable)
        event.preventDefault()
      drive.move(event.clientY, event.timeStamp)
      return
    }
    const armed = arm
    if (armed == null || armed.pointerId !== event.pointerId)
      return
    const delta = event.clientY - armed.startY
    armed.tracker.add(0, event.clientY, event.timeStamp)
    if (delta > DRAG_PROMOTION_SLOP && chainAtTop(armed.scrollers)) {
      // A pull down at the top, anchored where the press began so the pull carries over.
      arm = null
      drive.begin({ pointerId: armed.pointerId, pointerType: armed.pointerType, startY: armed.startY, tracker: armed.tracker }, event.clientY, event.timeStamp)
      if (event.cancelable)
        event.preventDefault()
      drive.move(event.clientY, event.timeStamp)
    }
    else if (delta < 0) {
      // A move up is a scroll; the sheet leaves it alone.
      arm = null
      drive.detach()
    }
  }

  function onPointerUp(event: PointerEvent): void {
    const active = drive.dragPointerId()
    if (active != null && (active !== event.pointerId || drive.isTouchDrag()))
      return
    arm = null
    if (active == null) {
      drive.detach()
      return
    }
    drive.end(event.clientY, event.timeStamp)
  }

  function onPointerCancel(event: PointerEvent): void {
    const active = drive.dragPointerId()
    if (active != null && (active !== event.pointerId || drive.isTouchDrag()))
      return
    drive.cancel()
  }

  function onHandlePointerDown(event: PointerEvent): void {
    if (event.button != null && event.button !== 0)
      return
    if (yieldToPinch(event.pointerId))
      return
    drive.attach()
    const tracker = new VelocityTracker()
    drive.begin({ pointerId: event.pointerId, pointerType: event.pointerType, startY: event.clientY, tracker }, event.clientY, event.timeStamp)
    // The handle has no native focus action: a tap must not move focus off a form control.
    if (event.cancelable)
      event.preventDefault()
  }

  function onBodyPointerDown(event: PointerEvent): void {
    if (yieldToPinch(event.pointerId))
      return
    arm = null
    if (event.pointerType === 'touch' || (event.button != null && event.button !== 0))
      return
    const body = drive.body()
    // A gesture inside a layer this sheet hosts belongs to that layer.
    if (!body || isInsideNestedLayer(event.target, body))
      return
    const scrollers = scrollChainUnder(event.target, body)
    if (!chainAtTop(scrollers))
      return
    const tracker = new VelocityTracker()
    tracker.add(0, event.clientY, event.timeStamp)
    arm = { pointerId: event.pointerId, pointerType: event.pointerType, startY: event.clientY, scrollers, tracker }
    drive.attach()
  }

  return { onPointerMove, onPointerUp, onPointerCancel, onHandlePointerDown, onBodyPointerDown, reset }
}
