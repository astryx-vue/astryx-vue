/**
 * @file touchEvents.ts
 * @input A test window
 * @output exposeTouchEvents(): the window answers `'ontouchstart' in window`
 *   as a browser with Touch Events does, until restored; touch(): one
 *   finger's touch event dispatched on a target
 * @position Test helper of packages/core/src/gestures
 *
 * The gesture host reads a finger from its Touch Events only where the
 * window has `ontouchstart` (a phone's browser); elsewhere a finger comes
 * from its pointer events alone. happy-dom's window has no `ontouchstart`,
 * so a test that dispatches touch events exposes it first.
 */

/** Give `view` an `ontouchstart` handler slot; the returned function takes it away. */
export function exposeTouchEvents(view: Window = window): () => void {
  if ('ontouchstart' in view) {
    return () => {}
  }
  Object.defineProperty(view, 'ontouchstart', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: null,
  })
  return () => {
    Reflect.deleteProperty(view, 'ontouchstart')
  }
}

/** One finger's touch event of `type` on `target`, at `time` on the event clock. */
export function touch(
  type: string,
  target: EventTarget,
  contact: { id: number, x: number, y: number },
  time: number,
  isLift = false,
): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const entry = { identifier: contact.id, clientX: contact.x, clientY: contact.y, target }
  Object.defineProperty(event, 'changedTouches', { value: [entry] })
  Object.defineProperty(event, 'touches', { value: isLift ? [] : [entry] })
  Object.defineProperty(event, 'timeStamp', { value: time })
  target.dispatchEvent(event)
}
