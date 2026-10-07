import type { ButtonEmits, ButtonProps } from '../Button/types.js'

export interface IconButtonProps extends Omit<ButtonProps, 'isIconOnly'> {}

export interface IconButtonSlots {
  default: () => unknown
}

export type IconButtonEmits = ButtonEmits
