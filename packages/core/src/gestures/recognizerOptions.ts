/**
 * @file recognizerOptions.ts
 * @input Nothing: types and the state table
 * @output GestureRecognizer's options, listener types, kinds, the native
 *   touch behaviour a recognizer leaves the browser, and UIKit's allowed
 *   state transitions
 * @position Shared by GestureRecognizer.ts and its layers; re-exported there
 */

import type { GestureRecognizer } from './GestureRecognizer'
import type { GestureState, GestureTouch, PointerKind, ScrollType } from './types'

/**
 * Turns text selection and the touch callout off on `elements` (and on a
 * non-text input `target` inside one) for one held press; returns the undo.
 * utils/selectionLock.ts's `lockSelection` is the one implementation.
 */
export type SelectionLock = (
  elements: Iterable<Element>,
  target: EventTarget | null,
) => () => void

export interface GestureRecognizerOptions<R = GestureRecognizer> {
  /** A name for debugging and test output. */
  name?: string
  /** A disabled recognizer receives no touches; disabling one mid-gesture cancels it. @default true */
  isEnabled?: boolean
  /**
   * When the gesture is recognized, cancel the view's touches: a pressed
   * control un-highlights without acting, and the browser's click for the
   * touch is swallowed. @default true
   */
  cancelsTouchesInView?: boolean
  /** Hold the view's touch-began until this recognizer fails. @default false */
  delaysTouchesBegan?: boolean
  /**
   * For a hold that does something (a slider's thumb, a switch's or a
   * segmented control's drag): the lock that turns text selection and the
   * touch callout off on this recognizer's element for each held press
   * (`spec:AST-094` FR41). Pass `lockSelection` from utils/selectionLock.ts;
   * the host calls it and never imports it, so a component without such a
   * hold does not bundle it. Content under a sheet's or a pager's pan stays
   * selectable, so there is none by default; a mouse keeps desktop selection
   * either way. A long press brings its own when it has a hold (a
   * `minimumPressDuration` above 0); `null` brings none.
   */
  selectionLock?: SelectionLock | null
  /**
   * Hold the view's touch-ended (and the browser's click) while this
   * recognizer may still recognize. @default true
   */
  delaysTouchesEnded?: boolean
  /** Pointer kinds this recognizer listens to (UIKit's `allowedTouchTypes`). @default all */
  allowedPointerTypes?: ReadonlyArray<PointerKind>
  /**
   * Scroll input this recognizer takes, as UIKit's `allowedScrollTypesMask`.
   * A pan follows a trackpad's two-finger scroll (`continuous`), never a
   * mouse wheel's notches. It moves as a contact with the content, along its
   * own axis, after the scrollers under the pointer. Its own element is the
   * pan's on the axis its `touch-action` keeps, as for a finger. A pinch takes
   * a ctrl-wheel of either, as a trackpad pinches.
   * @default none; a pinch takes both, the screen-edge pan none whatever a
   *   caller passes
   */
  allowedScrollTypes?: ReadonlyArray<ScrollType>
  /** Ignore a touch of a different kind than the ones already tracked. @default true */
  requiresExclusiveTouchType?: boolean
  /**
   * Whether this recognizer takes its touches from the browser when it
   * recognizes. `false` makes a watcher (a tab bar that minimizes while the
   * page scrolls): it never claims, so it gets only passive listeners and
   * never delays a scroll; it prevents no other recognizer and none prevents
   * it (`spec:AST-094` FR15); it cancels no press or click under it; and it
   * keeps tracking a touch the browser takes for a scroll,
   * reporting through the native scroll and ending at the lift.
   * @default true
   */
  claimsTouches?: boolean
  /** gestureRecognizerShouldBegin: return false to fail instead of beginning. */
  shouldBegin?: (recognizer: R) => boolean
  /** gestureRecognizer(_:shouldReceive:): return false to never see this touch. */
  shouldReceiveTouch?: (recognizer: R, touch: GestureTouch) => boolean
  /** gestureRecognizer(_:shouldRecognizeSimultaneouslyWith:). */
  shouldRecognizeSimultaneously?: (
    recognizer: R,
    other: GestureRecognizer,
  ) => boolean
  /** gestureRecognizer(_:shouldRequireFailureOf:). */
  shouldRequireFailureOf?: (recognizer: R, other: GestureRecognizer) => boolean
  /** gestureRecognizer(_:shouldBeRequiredToFailBy:). */
  shouldBeRequiredToFailBy?: (
    recognizer: R,
    other: GestureRecognizer,
  ) => boolean
}

export type GestureListener<R> = (recognizer: R) => void

export type GestureTransitionListener<R> = (
  recognizer: R,
  from: GestureState,
  to: GestureState,
) => void

export const ACTION_STATES: ReadonlySet<GestureState> = new Set([
  'began',
  'changed',
  'ended',
  'cancelled',
])

/** Transitions UIKit allows; anything else is a recognizer bug. */
const ALLOWED: Record<GestureState, ReadonlyArray<GestureState>> = {
  possible: ['began', 'ended', 'failed'],
  began: ['changed', 'ended', 'cancelled'],
  changed: ['changed', 'ended', 'cancelled'],
  ended: ['possible'],
  cancelled: ['possible'],
  failed: ['possible'],
}

export function isTransitionAllowed(
  from: GestureState,
  to: GestureState,
): boolean {
  return ALLOWED[from].includes(to)
}

export function isTerminal(state: GestureState): boolean {
  return state === 'ended' || state === 'cancelled' || state === 'failed'
}

export function isActive(state: GestureState): boolean {
  return state === 'began' || state === 'changed'
}

/**
 * The browser behaviors `touch-action` can keep or remove.
 */
export interface NativeTouchBehavior {
  readonly panX: boolean
  readonly panY: boolean
  readonly pinchZoom: boolean
  /** Double-tap to zoom, the reason for the old 300 ms click delay. */
  readonly doubleTapZoom: boolean
}

export const ALL_NATIVE_TOUCH: NativeTouchBehavior = {
  panX: true,
  panY: true,
  pinchZoom: true,
  doubleTapZoom: true,
}

/** A tap-like recognizer only needs double-tap zoom gone (no click delay). */
export const MANIPULATION: NativeTouchBehavior = {
  panX: true,
  panY: true,
  pinchZoom: true,
  doubleTapZoom: false,
}

/**
 * What a recognizer is. The gesture code tells the family apart by it, never
 * by `instanceof` (`architecture:react-component-runtime` INV13); a
 * screen-edge pan is its own kind, though it is built on the pan.
 */
export type RecognizerKind
  = 'tap' | 'longPress' | 'pan' | 'screenEdgePan' | 'swipe' | 'pinch'
