import type { Component, VNode } from 'vue'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldLabelProps, FieldStatusInput, FieldStatusType, FieldStatusVariant } from '../Field/types.js'

export type TextInputSize = 'sm' | 'md' | 'lg'
export type TextInputType = 'text' | 'password' | 'email'
export type TextInputStatus = FieldStatusInput
export type TextInputStatusType = FieldStatusType
export type TextInputChangeEvent = CustomEvent<{ value: string, originalEvent: Event }>
export type TextInputChangeAction = (value: string, event: TextInputChangeEvent) => void | Promise<void>

export interface TextInputProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'>, FieldPartStylingProps {
  modelValue: string
  id?: string
  type?: TextInputType
  size?: TextInputSize
  isReadOnly?: boolean
  disabledMessage?: string
  startIcon?: Component
  status?: TextInputStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  changeAction?: TextInputChangeAction
  isLoading?: boolean
  placeholder?: string
  width?: number | string
  hasClear?: boolean
  hasAutoFocus?: boolean
  htmlName?: string
  autoComplete?: string
  clearLabel?: string
  loadingLabel?: string
}

export interface TextInputEmits {
  change: [value: string, event: TextInputChangeEvent]
  clear: [event: MouseEvent]
  enter: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
  actionError: [error: unknown, value: string, event: TextInputChangeEvent]
}

export interface TextInputSlots {
  icon?: () => VNode[]
  end?: () => VNode[]
  labelIcon?: () => VNode[]
}
