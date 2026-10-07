import type { ButtonGroupOrientation } from '../Button/context.js'
import type { ButtonElevation, ButtonSize } from '../Button/types.js'

export interface ButtonGroupProps {
  /** Resting shadow depth for the connected surface. @default 'none' */
  elevation?: ButtonElevation
  /** Disables every Button in the group. @default false */
  isDisabled?: boolean
  /** Accessible group label. */
  label: string
  /** Connected layout direction. @default 'horizontal' */
  orientation?: ButtonGroupOrientation
  /** Default size inherited by child buttons. @default 'md' */
  size?: ButtonSize
}

export interface ButtonGroupSlots {
  default: () => unknown
}

export type { ButtonGroupOrientation }
