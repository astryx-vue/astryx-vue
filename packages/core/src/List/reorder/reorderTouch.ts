/**
 * @file reorderTouch.ts
 * @input A reorderable list, the pointer types that hold its handles, and
 *   the controller's handle test and gesture callback
 * @output `attachTouchHold`: a finger's (and a coarse pen's) drag starts
 *   after a still hold on a handle (`reorder.claim`), while a flick from it
 *   scrolls. `touchMotion`: the rows' glides on the shared settle spring
 * @position List reorder internals, read by the controller
 *   (reorderDrag.ts, reorderDrop.ts and reorderController.ts)
 */
import type { PointerKind } from '../../gestures/types.js'
import type { DurationBounce, SpringDescription } from '../../motion/springParameters.js'
import { getGestureHost } from '../../gestures/GestureHost.js'
import { LongPressGestureRecognizer } from '../../gestures/LongPressGestureRecognizer.js'
import { resolveMotion } from '../../motion/resolveMotion.js'
import { durationBounceOf, toSpring } from '../../motion/springParameters.js'
import { reorder } from '../../motion/uikit/reorder.js'
import { registerSpringsTable, springs } from '../../motion/uikit/springs.js'
import { subscribeInput } from '../../utils/inputStream.js'
import { animateRow, animatorFor, motionOf, releaseMotion } from '../../utils/rowMotion.js'
import { lockSelection, locksSelectionFor } from '../../utils/selectionLock.js'

/**
 * Holds `list`'s handles for a drag: a still touch claims it after the
 * scroll view's content-touch delay, and travel before that hands the touch
 * to the scroller. Returns the release.
 */
export function attachTouchHold(
  list: HTMLElement,
  pointerTypes: ReadonlyArray<PointerKind>,
  receives: (target: unknown) => boolean,
  onGesture: (recognizer: LongPressGestureRecognizer) => void,
  isOnHandle: (target: unknown) => boolean,
): () => void {
  const host = getGestureHost(list.ownerDocument)
  const recognizer = new LongPressGestureRecognizer({
    name: 'List.reorder',
    minimumPressDuration: reorder.claim.delayMs,
    allowableMovement: reorder.claim.allowableMovement,
    allowedPointerTypes: pointerTypes,
    shouldReceiveTouch: (_recognizer, touch) => receives(touch.target),
    // A second finger pinches the page: the row stays.
    shouldBegin: () => host.fingersDown() <= 1,
  })
  const unlisten = recognizer.addListener(onGesture)
  const detach = host.attach(list, recognizer, { manageStyle: false })
  const unlock = lockSelectionWhileHeld(list, pointerTypes, isOnHandle)
  return () => {
    detach()
    unlisten()
    unlock()
  }
}

/**
 * A hold on a handle selects no text and shows no callout, from the press:
 * the hold has not claimed the drag yet when the browser would select.
 */
function lockSelectionWhileHeld(
  list: HTMLElement,
  pointerTypes: ReadonlyArray<PointerKind>,
  isOnHandle: (target: unknown) => boolean,
): () => void {
  const view = list.ownerDocument.defaultView
  if (view == null)
    return () => {}
  const held = new Map<number, () => void>()
  const release = (event: PointerEvent): void => {
    held.get(event.pointerId)?.()
    held.delete(event.pointerId)
  }
  const unsubscribe = [
    subscribeInput(view, 'pointerdown', (event) => {
      if (
        locksSelectionFor(event.pointerType)
        && pointerTypes.includes(event.pointerType as PointerKind)
        && isOnHandle(event.target)
      ) {
        release(event)
        held.set(event.pointerId, lockSelection([list], event.target))
      }
    }),
    subscribeInput(view, 'pointerup', release),
    subscribeInput(view, 'pointercancel', release),
  ]
  return () => {
    for (const stop of unsubscribe)
      stop()
    for (const unlockHeld of held.values())
      unlockHeld()
    held.clear()
  }
}

/** Gives the row's translate back to its stylesheet once it arrives. */
function releaseOnArrival(element: HTMLElement, arrived: Promise<boolean>): void {
  void arrived.then((done) => {
    if (done)
      releaseMotion(element, 'translate')
  })
}

/** The rows' motion: every glide plays the shared settle role. */
export const touchMotion = {
  /** The settle spring, as the list's theme and reduced motion resolve it. */
  glideBase(list: HTMLElement): DurationBounce {
    registerSpringsTable()
    return durationBounceOf(toSpring(resolveMotion(list, springs.settle)))
  },
  /** The dropped row: from where it was let go, with the release velocity. */
  glide(element: HTMLElement, shift: number, spring: SpringDescription, at: number, velocity: number): void {
    animatorFor(element).rebase({ y: shift }, { at })
    releaseOnArrival(element, animateRow(element, { y: 0 }, spring, { at, velocity: { y: velocity } }).finished)
  },
  /** A row back to its place. */
  home(element: HTMLElement, spring: SpringDescription, at: number, fromRest: boolean): void {
    releaseOnArrival(
      element,
      animateRow(element, { y: 0 }, spring, { at, velocity: fromRest ? { y: 0 } : undefined }).finished,
    )
  },
  /** A row that makes room: its running spring, if any, continues. */
  follow(element: HTMLElement, shift: number, spring: SpringDescription, at: number): void {
    const running = motionOf(element, 'y')?.spring ?? spring
    animatorFor(element).rebase({ y: shift }, { at })
    releaseOnArrival(element, animateRow(element, { y: 0 }, running, { at }).finished)
  },
}
