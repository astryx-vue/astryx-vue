import type { VNode } from 'vue'
import type { CardElevation, CardProps, CardVariant } from '../Card/types.js'

export interface ClickableCardProps extends Pick<CardProps, 'padding' | 'width' | 'height' | 'maxWidth'> {
  /**
   * Accessible name of the card. It labels the visually hidden control that
   * receives keyboard focus.
   */
  label: string
  /**
   * Address the card navigates to. Leave it unset when the card runs `click`
   * instead of navigating.
   */
  href?: string
  /**
   * Browsing context for `href`. `_blank` opens a new tab.
   */
  target?: string
  /**
   * Whether the card ignores activation.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Background variant, forwarded to `Card`.
   * @default 'default'
   */
  variant?: CardVariant
  /**
   * Resting shadow, forwarded to `Card`.
   * @default 'none'
   */
  elevation?: CardElevation
}

export interface ClickableCardEmits {
  /** Emitted when the card surface is activated. Nested controls do not emit it. */
  click: [event: MouseEvent]
}

export interface ClickableCardSlots {
  /** Card body. Nested buttons and links keep their own activation. */
  default?: () => VNode[]
}
