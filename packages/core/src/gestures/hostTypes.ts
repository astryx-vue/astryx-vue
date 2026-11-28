/**
 * @file hostTypes.ts
 * @input Nothing: types
 * @output The gesture host's per-element registration, its options and an
 *   attach's options
 * @position Shared by the layers of GestureHost.ts; GestureHostOptions and
 *   AttachOptions are re-exported there
 */

import type { GestureArenaOptions, GestureClock } from './GestureArena'
import type { GestureRecognizer } from './GestureRecognizer'
import type {
  TouchConsumer,
} from './types'

export interface Registration {
  readonly recognizers: GestureRecognizer[]
  consumer: TouchConsumer | null
  /**
   * Where fingers come from their pointer events, whether the element
   * carries the host's blocking `touchend` handler, which cancels a claimed
   * finger's lift (`spec:AST-094` FR21).
   */
  hasTouchEndListener: boolean
  /** Whether the element carries the host's shared blocking touchmove handler. */
  hasTouchMoveListener: boolean
  /** Whether the element carries the host's wheel handler. */
  hasWheelListener: boolean
  /** Inline values the host replaced, to restore on detach. */
  readonly savedStyle: Map<string, string>
  /**
   * What the element's own stylesheet gives it, read in a frame for the
   * derived value the host marked then: `null` where the host's rule is in
   * force (the author sets nothing else); the host never allows more than
   * the author does. `null` before the read.
   */
  authorTouchAction: { derived: string, author: string | null } | null
  manageStyle: boolean
  /**
   * The recognizers attached with `manageStyle: false`. The host styles the
   * element for its other recognizers only.
   */
  readonly unstyled: Set<GestureRecognizer>
  /** An action group (`family:action-groups` FR5). */
  actionGroup: boolean
  /** The attachments that asked for the action group; it lasts while one does. */
  actionGroupAsks: number
}

export interface GestureHostOptions {
  /** The arena's clock; tests pass a manual one. */
  clock?: GestureClock
  /**
   * Where fingers come from: Touch Events where the browser has them
   * (`auto`), or Pointer Events only.
   */
  inputMode?: 'auto' | 'pointer-events'
  /** Every recognizer transition, for debugging and tests. */
  onTransition?: GestureArenaOptions['onTransition']
  /**
   * Send a contact to what is drawn while a compositor animation moves an
   * element (motion/presentation.ts): `auto` where the engine hit-tests such
   * an element where its animation started (iOS WebKit); `always` or
   * `never` for tests. @default 'auto'
   */
  presentedHitTesting?: 'auto' | 'always' | 'never'
  /**
   * Whether the primary pointer is coarse (a phone, a tablet). Gestures
   * attach for every pointer (`spec:AST-094` FR43); where it is fine, an
   * element that uses a gesture keeps one passive `pointerdown` listener
   * (beside a claiming recognizer's blocking `touchmove`, FR19) and the
   * page's listeners last only a press (FR24).
   * @default `(pointer: coarse)` on the document's window
   */
  isPrimaryPointerCoarse?: () => boolean
}

export interface AttachOptions {
  /**
   * Let the host set the element's styles: its `touch-action`, and the
   * selection and callout lock a hold that does something keeps while it is
   * held (`spec:AST-094` FR41). With false the caller keeps both for this
   * recognizer, and the host still styles the element for its others.
   * @default true
   */
  manageStyle?: boolean
  /**
   * Accepted and ignored: every attachment reads each event's pointer
   * (`spec:AST-094` FR43). Kept so callers written before FR43 compile.
   * @deprecated
   */
  perEventPointer?: boolean
  /**
   * The element is an action group, sibling actions a held pointer slides
   * across (`family:action-groups` FR5). It is served like every
   * attachment, for every pointer (`spec:AST-094` FR43). @default false
   */
  actionGroup?: boolean
}
