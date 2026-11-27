/**
 * @file keyboardTarget.ts
 * @input The keyboard module's focus claim and tap route, the reveal, the
 *   ride and the scroll back
 * @output The keyboard targets: followKeyboard for a docked or scrolling
 *   target, and keepFieldAboveKeyboard, a covered field's own path. It
 *   re-exports the registry, the geometry and the tap's delivery its callers
 *   read
 * @position Keyboard module, internal to core. useMobileKeyboard calls it.
 */

import type { KeyboardMove } from './keyboardGeometry'
import type { UnplacedField } from './keyboardReveal'
import { scrollingAncestor } from '../utils/scrollingAncestor'
import { refuseFocusReveal } from './focusReveal'
import {
  FIELD_OFFSET,
  fixedContainerOf,
  focusedFieldIn,
  followsKeyboard,
  hasOwnTranslate,
  isInsideKeyboardTarget,

  nearestFixedAncestor,
  nearestScroller,
  registerKeyboardTarget,
} from './keyboardGeometry'
import {
  findTextEntryControl,
  getKeyboardHeight,
  isTextEntryControl,
  KEYBOARD_EPSILON,
} from './keyboardHeight'
import {
  bandOf,
  deliverTap,
  revealWithKeyboard,

} from './keyboardReveal'
import { rideWithKeyboard } from './keyboardRide'
import {
  claimKeyboardScrollBack,
  stopKeyboardScrollBack,
} from './keyboardScrollBack'
import { claimTapFocus } from './tapFocus'

export {
  coveredBy,
  dockedAncestor,
  drawnOffsetOf,
  FIELD_CLEARANCE_AT_REPORT,
  FIELD_OFFSET,
  type FixedContainer,
  fixedContainerOf,
  followsKeyboard,
  isInsideKeyboardTarget,
  type KeyboardMove,
  nearestScroller,
  registerKeyboardTarget,
} from './keyboardGeometry'
export { deliverTap, watchPans } from './keyboardReveal'

/** How followKeyboard moves its target. */
export interface FollowKeyboardOptions {
  move: KeyboardMove
  /** The gap kept between the focused field and the keyboard, CSS px. */
  offset: number
}

/**
 * Keeps the focused field inside `target` above the keyboard until the
 * returned call. `'ride'` moves `target` with the keyboard, on its slide
 * where the browser reports one. `'reveal'` scrolls the field into place in
 * `target`, a scroller. The target claims focus moves into its fields, so the
 * browser never pans the page to them, and it registers as a keyboard target.
 *
 * @example
 * ```
 * const stop = followKeyboard(dock, {move: 'ride', offset: FIELD_OFFSET});
 * ```
 */
export function followKeyboard(
  target: HTMLElement,
  { move, offset }: FollowKeyboardOptions,
): () => void {
  const doc = target.ownerDocument
  const win = doc.defaultView
  if (!followsKeyboard(win)) {
    return () => {}
  }
  const unregister = registerKeyboardTarget(target)
  const stopScrollBack = claimKeyboardScrollBack(win)
  const stopClaim = refuseFocusReveal(doc, {
    claim: destination =>
      destination instanceof win.HTMLElement
      && destination !== target
      && target.contains(destination)
      && isTextEntryControl(destination)
        ? destination
        : null,
  })
  // A first tap moves focus from nothing, so no blur claims it. The tap
  // route focuses the field itself, without the browser's reveal.
  const stopTaps = claimTapFocus(target, {
    claim: (touched) => {
      const control = findTextEntryControl(touched, target)
      return control != null && control !== doc.activeElement ? control : null
    },
    deliver: deliverTap,
  })
  const stopMoving: (isFinal?: boolean) => void
    = move === 'ride'
      ? rideWithKeyboard(target, offset, win, true)
      : revealWithKeyboard(
          target,
          () => focusedFieldIn(target),
          target,
          offset,
          win,
        )
  return () => {
    stopMoving(true)
    stopTaps()
    stopClaim()
    stopScrollBack()
    unregister()
  }
}

/** How keepFieldAboveKeyboard keeps its field clear. */
export interface KeepFieldAboveKeyboardOptions {
  /** The gap kept between the field and the keyboard, CSS px. */
  offset?: number
}

// Whether `scroller`, in a fixed container the app positions, can bring
// `field` into its band. It must scroll the field up to the scroller's own
// top, since a scroller does not gain the range it lacks at its end yet. With
// the keyboard up, its box must also leave the field room above the keyboard.
function canBringUp(
  field: Element,
  scroller: Element,
  offset: number,
  win: Window,
): boolean {
  const range
    = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop
  const box = field.getBoundingClientRect()
  if (
    range
    < box.top - scroller.getBoundingClientRect().top - KEYBOARD_EPSILON
  ) {
    return false
  }
  const height = getKeyboardHeight(win)
  if (height <= KEYBOARD_EPSILON) {
    return true
  }
  const band = bandOf(scroller, height, offset, win)
  return band.bottom - band.top >= box.height - KEYBOARD_EPSILON
}

// The placement of `field` when it gains focus. A docked container rides.
// Page content reveals the field through its nearest scroller. A fixed
// container the app positions reveals it through a scroller in it that can
// bring it up. Null keeps the browser's reveal: inside a keyboard target, on a
// page with nothing to scroll, or with no such scroller.
function placementOf(
  field: HTMLElement,
  offset: number,
  win: Window,
): { ride: HTMLElement } | { reveal: Element, unplaced: UnplacedField } | null {
  if (isInsideKeyboardTarget(field)) {
    return null
  }
  const container = fixedContainerOf(field)
  if (container === 'floating' || container === 'fills-viewport') {
    return revealWithin(field, nearestFixedAncestor(field), offset, win)
  }
  if (container == null) {
    // A page with nothing to scroll keeps the browser's own reveal: a claim
    // there would leave the field under the keyboard in Safari.
    const scroller = nearestScroller(field)
    // In the page, the document reveals a field its scroll area cannot place.
    return scroller.scrollHeight > scroller.clientHeight
      ? { reveal: scroller, unplaced: 'document' }
      : null
  }
  // A bar the app positions with its own `translate` does not ride: the ride
  // would replace that translate.
  const view = field.ownerDocument.defaultView
  return view != null && hasOwnTranslate(container.docked, view)
    ? revealWithin(field, container.docked, offset, win)
    : { ride: container.docked }
}

// A reveal by the scroller between `field` and the fixed `container` the app
// positions, or null when no scroller there can bring the field up.
function revealWithin(
  field: HTMLElement,
  container: HTMLElement | null,
  offset: number,
  win: Window,
): { reveal: Element, unplaced: UnplacedField } | null {
  const scroller
    = container == null ? null : scrollingAncestor(field, container)
  return scroller == null || !canBringUp(field, scroller, offset, win)
    ? null
    : { reveal: scroller, unplaced: 'fixed' }
}

/**
 * Keeps `field` above the on-screen keyboard until the returned call. On focus,
 * `placementOf` decides who moves it. A claimed focus move or tap arrives
 * without the browser's reveal. Where no placement fits, the browser's own
 * reveal stays.
 *
 * @example
 * ```
 * const stop = keepFieldAboveKeyboard(input);
 * ```
 */
export function keepFieldAboveKeyboard(
  field: HTMLElement,
  { offset = FIELD_OFFSET }: KeepFieldAboveKeyboardOptions = {},
): () => void {
  const doc = field.ownerDocument
  const win = doc.defaultView
  if (!followsKeyboard(win)) {
    return () => {}
  }
  const stopScrollBack = claimKeyboardScrollBack(win)
  const stopClaim = refuseFocusReveal(doc, {
    claim: destination =>
      destination === field && placementOf(field, offset, win) != null
        ? field
        : null,
  })
  // A first tap moves focus from nothing, so no blur claims it.
  const stopTaps = claimTapFocus(field, {
    claim: () =>
      doc.activeElement !== field && placementOf(field, offset, win) != null
        ? field
        : null,
    deliver: deliverTap,
  })
  let stopSession: ((isFinal?: boolean) => void) | null = null
  // A ride a blur stopped can still wait for the keyboard to go; a detach
  // ends it at once.
  let stoppedSession: ((isFinal?: boolean) => void) | null = null
  const onFocus = (): void => {
    // A claimed focus move raises a second focus event; the session stands.
    if (stopSession != null) {
      return
    }
    const placement = placementOf(field, offset, win)
    if (placement == null) {
      return
    }
    stopKeyboardScrollBack(win)
    stopSession
      = 'ride' in placement
        ? rideWithKeyboard(placement.ride, offset, win, false)
        : revealWithKeyboard(
            field,
            () => (doc.activeElement === field ? field : null),
            placement.reveal,
            offset,
            win,
            placement.unplaced,
          )
  }
  const onBlur = (): void => {
    stopSession?.()
    stoppedSession = stopSession ?? stoppedSession
    stopSession = null
  }
  field.addEventListener('focus', onFocus)
  field.addEventListener('blur', onBlur)
  // A field that has focus before this path attaches, as with `hasAutoFocus`,
  // gets no later focus event. Its session starts here.
  if (doc.activeElement === field) {
    onFocus()
  }
  return () => {
    field.removeEventListener('focus', onFocus)
    field.removeEventListener('blur', onBlur)
    stopSession?.(true)
    stoppedSession?.(true)
    stopSession = null
    stoppedSession = null
    stopTaps()
    stopClaim()
    stopScrollBack()
  }
}
