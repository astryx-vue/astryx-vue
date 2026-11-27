/**
 * @file tapFocus.ts
 * @input A region's touch events, the shared press slop and the click guard
 * @output claimTapFocus, the tap route that focuses a claimed field itself,
 *   and focusAtPoint, which focuses without Safari's reveal and puts the
 *   caret under the finger
 * @position Keyboard module, internal to core. The keyboard targets deliver
 *   taps through it.
 */

import { PRESS_SLOP_PX } from '../composables/internal/pressGesture'
import { armClickGuard } from '../utils/clickGuard'
import { caretAt } from '../utils/selectionRanges'

/** The caller's rules for claimTapFocus. */
export interface ClaimTapFocusOptions {
  /** The control a touch on `target` would focus, when this caller claims it. */
  claim: (target: EventTarget | null) => HTMLElement | null
  /**
   * Focuses the claimed control for a tap that ended at (x, y) in the
   * viewport. `touch` is the tap's finger: its screen point and identifier.
   */
  deliver: (
    control: HTMLElement,
    x: number,
    y: number,
    touch: { screenX: number, screenY: number, identifier: number },
  ) => void
}

/**
 * The tap route. `deliver` focuses a one-finger tap on `region` that `claim`
 * accepts, such as a field without focus, instead of the browser. The
 * browser's own focus would reveal the field by scrolling the document. The
 * route prevents the tap's default at its end. The shared click guard then
 * takes the mouse events Safari may still send for the tap. The browser keeps a
 * touch that moves past the scroll slop, and a second finger. Returns a
 * cleanup.
 *
 * @example
 * ```
 * const stop = claimTapFocus(region, {
 *   claim: target => editableWithoutFocus(target),
 *   deliver: (field, x, y) => focusAtPoint(field, x, y),
 * });
 * ```
 */
export function claimTapFocus(
  region: HTMLElement,
  { claim, deliver }: ClaimTapFocusOptions,
): () => void {
  // The touch the route follows, and the listeners that follow it: on the
  // region only, and only while that touch is down.
  let start: { x: number, y: number, control: HTMLElement } | null = null
  // On the iOS simulator, a tap held about 250 ms still gets its mousedown and
  // click. They come a few ms after its touchend, though the route cancelled
  // that touchend. They go to whatever is under the finger by then, which can
  // take the focus the tap delivered. The click guard takes them
  // (utils/clickGuard.ts).
  const stopFollowing = (): void => {
    start = null
    region.removeEventListener('touchmove', onMove)
    region.removeEventListener('touchend', onEnd)
    region.removeEventListener('touchcancel', stopFollowing)
  }
  function onMove(event: TouchEvent): void {
    const touch = event.touches[0]
    if (
      start == null
      || event.touches.length !== 1
      || touch == null
      // Past the press slop, the touch is the browser's to scroll, not a tap
      // on a field.
      || Math.hypot(touch.clientX - start.x, touch.clientY - start.y)
      > PRESS_SLOP_PX
    ) {
      stopFollowing()
    }
  }
  function onEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0]
    const tap = start
    stopFollowing()
    // Still the same field, still without focus.
    if (
      tap == null
      || touch == null
      || !event.cancelable
      || claim(tap.control) !== tap.control
    ) {
      return
    }
    event.preventDefault()
    deliver(tap.control, touch.clientX, touch.clientY, touch)
    armClickGuard(region.ownerDocument, { takesLateMouse: true })
  }
  const onStart = (event: TouchEvent): void => {
    if (start != null) {
      // Another finger joined the one the route follows: not a tap.
      stopFollowing()
      return
    }
    const touch = event.touches[0]
    const control
      = event.touches.length === 1 && touch != null ? claim(event.target) : null
    if (control == null || touch == null) {
      return
    }
    start = { x: touch.clientX, y: touch.clientY, control }
    region.addEventListener('touchmove', onMove, { passive: true })
    // Not passive: only the end of the touch can still cancel the browser's
    // focus and its reveal.
    region.addEventListener('touchend', onEnd)
    region.addEventListener('touchcancel', stopFollowing)
  }
  region.addEventListener('touchstart', onStart, { passive: true })
  return () => {
    stopFollowing()
    region.removeEventListener('touchstart', onStart)
  }
}

function isTextControl(
  element: Element,
): element is HTMLTextAreaElement | HTMLInputElement {
  return (
    element instanceof HTMLTextAreaElement
    || element instanceof HTMLInputElement
  )
}

/**
 * A text control's caret for a tap at (x, y). It is where the browser maps
 * the point inside the control. Where the browser maps none, it is after the
 * text, the convention for a focus without a point. A control with no text
 * selection stays as it is.
 */
function placeTextControlCaret(
  control: HTMLTextAreaElement | HTMLInputElement,
  x: number,
  y: number,
): void {
  if (control.selectionStart == null) {
    return
  }
  const caret = caretAt(control.ownerDocument, x, y, [])
  const offset
    = caret != null && caret.node === control
      ? caret.offset
      : control.value.length
  control.setSelectionRange(offset, offset)
}

/**
 * Focuses without Safari's reveal and puts the caret under the finger.
 * Exported for its tests.
 */
export function focusAtPoint(editable: HTMLElement, x: number, y: number): void {
  editable.focus({ preventScroll: true })
  if (isTextControl(editable)) {
    placeTextControlCaret(editable, x, y)
    return
  }
  const doc = editable.ownerDocument
  const caret = caretAt(doc, x, y, [])
  if (
    caret != null
    && editable.isContentEditable
    && editable.contains(caret.node)
  ) {
    const range = doc.createRange()
    range.setStart(caret.node, caret.offset)
    range.collapse(true)
    const selection = doc.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
}
