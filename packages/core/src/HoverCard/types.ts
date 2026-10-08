import type { VNode } from 'vue'

export type HoverCardPlacement = 'above' | 'below' | 'start' | 'end'
export type HoverCardAlignment = 'start' | 'center' | 'end'
export type HoverCardFocusTrigger = 'auto' | 'always' | 'never'
export type HoverCardTouchTrigger = 'auto' | 'tap' | 'none'
export type HoverCardHoverIndication = 'auto' | boolean

export interface HoverCardProps {
  /** Plain-text content of the card. The `content` slot takes precedence and accepts rich markup. @default '' */
  content?: string
  /** Side of the trigger the card is placed on. Flips to the opposite side when there is no room. @default 'above' */
  placement?: HoverCardPlacement
  /** Alignment along the placement axis. @default 'center' */
  alignment?: HoverCardAlignment
  /** Milliseconds to wait after a hover before showing the card. @default 300 */
  delay?: number
  /** Milliseconds to wait after the pointer or focus leaves before hiding, so the pointer can travel into the card. @default 200 */
  hideDelay?: number
  /**
   * When focus opens the card:
   * - `auto`: only when the trigger is itself focusable
   * - `always`: attach focus listeners regardless
   * - `never`: never open on focus, for composite widgets
   *
   * @default 'auto'
   */
  focusTrigger?: HoverCardFocusTrigger
  /**
   * What a tap does on a touch pointer, where there is no hover:
   * - `auto`: tap opens the card, unless the trigger performs an action of its own (a button, link, or form control) — that tap belongs to the control
   * - `tap`: tap always opens the card, even on a trigger that acts
   * - `none`: touch never opens the card
   *
   * A tap-opened card is dismissed by a tap outside it.
   *
   * @default 'auto'
   */
  touchTrigger?: HoverCardTouchTrigger
  /** Whether the hover and focus triggers are live. @default true */
  isEnabled?: boolean
  /**
   * Accessible name for the card. When provided the card is exposed to assistive
   * technology as a named `role="dialog"`; when omitted it falls back to
   * `role="group"`, which may validly be unnamed.
   *
   * @default undefined
   */
  label?: string
  /**
   * Dashed underline marking the trigger as hoverable.
   * - `'auto'`: only on a text-only trigger
   * - `true`: always
   * - `false`: never
   *
   * @default 'auto'
   */
  hasHoverIndication?: HoverCardHoverIndication
  /** Controlled open state. Overrides the hover and focus triggers. @default undefined */
  isOpen?: boolean
  /** Whether the card is shown on mount. Still dismissible. @default false */
  isDefaultOpen?: boolean
}

export interface HoverCardEmits {
  /** Fired when the card shows (`true`) or hides (`false`). */
  openChange: [isOpen: boolean]
}

export interface HoverCardSlots {
  /** The trigger element. Its own ref and attributes are preserved. */
  default?: () => VNode[]
  /** Card content. Replaces the `content` prop text. */
  content?: () => VNode[]
}
