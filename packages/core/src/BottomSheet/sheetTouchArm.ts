import { TAP_WOBBLE } from '../gestures/tapWobble'
import { VelocityTracker } from '../gestures/VelocityTracker'
import { DRAG_PROMOTION_SLOP, isInsideNestedLayer } from './sheetDragMath.js'
import { chainAtBottom, chainAtTop, chainScrolls, holdAtEnd, scrollChainUnder } from './sheetScrollChain.js'

/**
 * Travel past the point where a scroll ran out of content before the sheet
 * takes the rest of the pull: continuous with the scroll, yet a swipe that
 * merely comes to rest on the last pixel starts no drag on jitter.
 */
const CONTENT_END_HANDOFF_SLOP = 4

/** What the touch path drives: the sheet's one drag. */
export interface SheetTouchDrive {
  /** The sheet's offset right now: the live drag position, or the settled stop. */
  activeOffset: () => number
  /** The contact driving the drag in flight, or null when none runs. */
  dragPointerId: () => number | null
  /** Begins a drag anchored at `startY`, with the contact's samples since it landed. */
  begin: (start: { pointerId: number, pointerType: string, startY: number, tracker: VelocityTracker }, clientY: number, timeStamp: number) => void
  move: (clientY: number, timeStamp: number) => void
  end: (clientY: number, timeStamp: number) => void
  cancel: () => void
  /** A second finger is a pinch: drop every arm and any drag in flight. */
  yieldToPinch: () => void
}

interface TouchArm {
  id: number
  startX: number
  startY: number
  /** The boxes this touch can scroll; their edges decide the hand-off. */
  scrollers: HTMLElement[]
  top: boolean
  bottom: boolean
  /** Where the finger was when the content ran out, or null while it can still scroll. */
  contentEndY: number | null
  /** Whether the drag in flight began at `contentEndY`, never cancelling the native scroll. */
  promotedAtContentEnd: boolean
  releaseContentHold: (() => void) | null
  /** The finger's positions since it landed. */
  tracker: VelocityTracker
}

/** An Apple Pencil raises touch events marked `stylus`; its drag is a pen's. */
function touchPointerType(touch: Touch): string {
  return (touch as Touch & { touchType?: string }).touchType === 'stylus' ? 'pen' : 'touch'
}

function findTouch(event: TouchEvent, id: number | null | undefined): Touch | undefined {
  return id == null ? undefined : Array.from(event.changedTouches).find(touch => touch.identifier === id)
}

export interface SheetTouchArm {
  onTouchStart: (event: TouchEvent) => void
  onTouchMove: (event: TouchEvent) => void
  onTouchEnd: (event: TouchEvent) => void
  /** Drops the touch's arm and its content hold without touching a drag in flight. */
  reset: () => void
}

/**
 * The body's touch path. Non-passive `touchmove` is the reliable scroll-to-drag
 * hand-off on touch: cancelling a move at a scroll edge stops the native
 * scroll and drives the sheet instead. Every touch on the body is tracked,
 * not only one that begins at an edge, because a swipe that starts mid-content
 * and scrolls to the end has to hand off too.
 */
export function createSheetTouchArm(drive: SheetTouchDrive): SheetTouchArm {
  let arm: TouchArm | null = null

  function releaseContentHold(): void {
    if (arm?.releaseContentHold != null) {
      arm.releaseContentHold()
      arm.releaseContentHold = null
    }
  }

  function reset(): void {
    releaseContentHold()
    arm = null
  }

  function promote(armed: TouchArm, touch: Touch, startY: number, timeStamp: number): void {
    drive.begin({ pointerId: armed.id, pointerType: touchPointerType(touch), startY, tracker: armed.tracker }, touch.clientY, timeStamp)
    drive.move(touch.clientY, timeStamp)
  }

  function onTouchStart(event: TouchEvent): void {
    const body = event.currentTarget as HTMLElement
    if (event.touches.length > 1) {
      reset()
      drive.yieldToPinch()
      return
    }
    reset()
    const touch = event.changedTouches[0]
    if (!touch || isInsideNestedLayer(event.target, body))
      return
    const scrollers = scrollChainUnder(event.target, body)
    // A pull up claimed from its first move blocks the content's scroll for the
    // whole touch, so it is claimed here only below the tallest stop or over
    // content that cannot scroll. At the tallest stop a list at its end keeps
    // its touch; its pull reaches the sheet through the content-end hand-off.
    const bottom = chainAtBottom(scrollers) && (drive.activeOffset() > 0 || !chainScrolls(scrollers))
    const tracker = new VelocityTracker()
    tracker.add(0, touch.clientY, event.timeStamp)
    arm = {
      id: touch.identifier,
      startX: touch.clientX,
      startY: touch.clientY,
      scrollers,
      top: chainAtTop(scrollers),
      bottom,
      contentEndY: null,
      promotedAtContentEnd: false,
      releaseContentHold: null,
      tracker,
    }
  }

  function moveDrag(event: TouchEvent): void {
    const touch = findTouch(event, drive.dragPointerId())
    if (!touch)
      return
    const armed = arm
    if (armed?.promotedAtContentEnd && armed.contentEndY != null) {
      if (touch.clientY >= armed.contentEndY) {
        // Back where the content ran out. This drag never cancelled the native
        // scroll, so the content is about to move again: hand the gesture back.
        armed.contentEndY = null
        armed.promotedAtContentEnd = false
        releaseContentHold()
        drive.cancel()
        return
      }
      // Not cancelled: the content is clamped at its end, and claiming the
      // gesture would strand it for as long as the finger is down.
      drive.move(touch.clientY, event.timeStamp)
      return
    }
    if (event.cancelable)
      event.preventDefault()
    drive.move(touch.clientY, event.timeStamp)
  }

  function onTouchMove(event: TouchEvent): void {
    // `touches` lists every finger on the screen, so a second finger that
    // landed off the body is caught here too.
    if (event.touches.length > 1) {
      reset()
      drive.yieldToPinch()
      return
    }
    if (drive.dragPointerId() != null) {
      moveDrag(event)
      return
    }
    const armed = arm
    const touch = findTouch(event, armed?.id)
    if (armed == null || !touch)
      return
    const delta = touch.clientY - armed.startY
    armed.tracker.add(0, touch.clientY, event.timeStamp)
    const opposesTop = armed.top && delta > 0 && chainAtTop(armed.scrollers)
    const opposesBottom = armed.bottom && delta < 0 && chainAtBottom(armed.scrollers)
    const sideways = Math.abs(touch.clientX - armed.startX)
    const isMostlyVertical = Math.abs(delta) > sideways
    // A pull against the armed edge can never scroll. Its native pan is
    // cancelled once it passes a tap's wobble, before the promotion slop,
    // because Mobile Safari commits a pan that a later cancel cannot stop.
    // A mostly sideways move is a row's scroll, so it is never cancelled.
    if ((opposesTop || opposesBottom) && Math.abs(delta) >= TAP_WOBBLE && isMostlyVertical && event.cancelable)
      event.preventDefault()
    if (isMostlyVertical && ((opposesTop && delta > DRAG_PROMOTION_SLOP) || (opposesBottom && delta < -DRAG_PROMOTION_SLOP))) {
      if (event.cancelable)
        event.preventDefault()
      reset()
      promote(armed, touch, armed.startY, event.timeStamp)
      return
    }
    // The first move past the slop on either axis decides the touch, once. A
    // mostly sideways move is a row's for the rest of the touch; any other
    // move that did not start the drag is the content's scroll.
    if (Math.max(Math.abs(delta), sideways) > DRAG_PROMOTION_SLOP && (armed.top || armed.bottom)) {
      if (!isMostlyVertical) {
        reset()
        return
      }
      armed.top = false
      armed.bottom = false
    }
    // Under the slop, an edge goes back to the native scroll only once a move
    // leaves it by a tap's wobble and the content has room that way. Content
    // that fits keeps both edges armed.
    if (armed.top && delta <= -TAP_WOBBLE && !chainAtBottom(armed.scrollers))
      armed.top = false
    if (armed.bottom && delta >= TAP_WOBBLE && !chainAtTop(armed.scrollers))
      armed.bottom = false
    // The content ran out mid-swipe. The browser has committed the touch to
    // scrolling, so its moves can no longer be cancelled; the hold clamps the
    // content at its end, and the sheet takes the travel past that point.
    if (chainAtBottom(armed.scrollers)) {
      if (armed.contentEndY == null) {
        armed.contentEndY = touch.clientY
        armed.releaseContentHold ??= holdAtEnd(armed.scrollers)
      }
      else if (armed.contentEndY - touch.clientY >= CONTENT_END_HANDOFF_SLOP) {
        armed.promotedAtContentEnd = true
        promote(armed, touch, armed.contentEndY, event.timeStamp)
      }
    }
    else {
      armed.contentEndY = null
      releaseContentHold()
    }
  }

  function onTouchEnd(event: TouchEvent): void {
    reset()
    const pointerId = drive.dragPointerId()
    if (pointerId == null)
      return
    const touch = findTouch(event, pointerId)
    if (touch)
      drive.end(touch.clientY, event.timeStamp)
    else if (event.touches.length === 0)
      drive.cancel()
  }

  return { onTouchStart, onTouchMove, onTouchEnd, reset }
}
