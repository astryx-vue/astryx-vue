import type { VNode } from 'vue'
import type { CardElevation, CardProps, CardVariant } from '../Card/types.js'

export interface SelectableCardProps extends Pick<CardProps, 'padding' | 'width' | 'height' | 'maxWidth'> {
  /**
   * Accessible name of the card. It labels the visually hidden checkbox.
   */
  label: string
  /**
   * Whether the card is selected. Bind with `v-model:isSelected`.
   */
  isSelected: boolean
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

export interface SelectableCardEmits {
  /** Emitted with the next selected state. `update:isSelected` is emitted with it. */
  change: [isSelected: boolean]
}

export interface SelectableCardSlots {
  /** Card body. Nested buttons and links keep their own activation. */
  default?: () => VNode[]
}
