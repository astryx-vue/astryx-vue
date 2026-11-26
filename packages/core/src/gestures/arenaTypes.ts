/**
 * @file arenaTypes.ts
 * @input Nothing: types and the browser clock
 * @output The arena's clock, its options, the click disposition, and the
 *   per-touch record the arena layers share
 * @position Shared by the layers of GestureArena.ts
 */

import type { GestureRecognizer } from './GestureRecognizer'
import type {
  GestureEnvironment,
  GestureState,
  GestureTouch,
  TouchBeganInput,
  TouchConsumer,
} from './types'

export interface GestureClock {
  now: () => number
  setTimeout: (callback: () => void, ms: number) => unknown
  clearTimeout: (handle: unknown) => void
}

/** The browser's clock: `performance.now()`, the base of `event.timeStamp`. */
export const browserClock: GestureClock = {
  now: () =>
    typeof performance === 'undefined' ? Date.now() : performance.now(),
  setTimeout: (callback, ms) => setTimeout(callback, ms),
  clearTimeout: handle => clearTimeout(handle as ReturnType<typeof setTimeout>),
}

/**
 * What the browser's click after a touch should do: pass, be swallowed, or
 * be swallowed now and replayed if the recognizers holding it all fail.
 */
export type ClickDisposition = 'allow' | 'suppress' | 'defer'

export interface ArenaBeganInput extends TouchBeganInput {
  /** The recognizers on the touch's hit path, innermost first. */
  readonly recognizers: ReadonlyArray<GestureRecognizer>
  /** The innermost view-level consumer under the touch, if any. */
  readonly consumer?: TouchConsumer | null
}

export interface GestureArenaOptions {
  clock?: GestureClock
  environment?: GestureEnvironment
  /**
   * Touches a recognizer now owns, and the recognizer that claimed them. A
   * claim comes in any state: a recognizer that waits on another's failure
   * claims while `possible`, and a swipe claims as `ended`. Each claim is
   * reported once.
   */
  onClaim?: (
    touchIds: ReadonlyArray<number>,
    claimer: GestureRecognizer,
  ) => void
  /** Claimed touches given back to the browser (releaseClaim). */
  onRelease?: (touchIds: ReadonlyArray<number>) => void
  /** A click deferred at touch end resolved: replay it, or drop it. */
  onDeferredClick?: (touch: GestureTouch, allowed: boolean) => void
  /**
   * The arena dropped its last touch, as after a lifted touch's decision
   * waited on a timer (a tap waiting on a double tap): its host may stop
   * listening now (`spec:AST-094` FR24).
   */
  onIdle?: () => void
  /**
   * Whether the browser keeps a contact for itself while it is down. Then no
   * claiming recognizer recognizes with it before its lift. So a mouse or pen
   * drag that starts on selectable text selects that text. A recognition at
   * the lift, such as a tap's, is unaffected.
   */
  refusesClaim?: (touch: GestureTouch) => boolean
  /** Every recognizer transition, for debugging and tests. */
  onTransition?: (
    recognizer: GestureRecognizer,
    from: GestureState,
    to: GestureState,
  ) => void
}

export type ViewDelivery = 'none' | 'held' | 'delivered' | 'endHeld' | 'done'

export interface TouchRecord {
  readonly touch: GestureTouch
  readonly participants: GestureRecognizer[]
  readonly consumer: TouchConsumer | null
  view: ViewDelivery
  isLifted: boolean
  isClaimed: boolean
  suppressClick: boolean
  deferredClick: boolean
}

export interface Timer {
  deadline: number
  callback: () => void
}
