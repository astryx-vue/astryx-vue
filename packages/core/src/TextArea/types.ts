import type { Component, VNode } from 'vue'
import type { FieldLabelProps, FieldStatusInput, FieldStatusType, FieldStatusVariant } from '../Field/types.js'

export type TextAreaSize = 'sm' | 'md' | 'lg'
export type TextAreaStatus = FieldStatusInput
export type TextAreaStatusType = FieldStatusType
export type TextAreaChangeEvent = CustomEvent<{ value: string, originalEvent: Event }>
export type TextAreaChangeAction = (value: string, event: TextAreaChangeEvent) => void | Promise<void>
export type TextAreaWrap = 'soft' | 'hard'

export interface TextAreaProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'> {
  modelValue: string
  id?: string
  size?: TextAreaSize
  isReadOnly?: boolean
  disabledMessage?: string
  startIcon?: Component
  status?: TextAreaStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  changeAction?: TextAreaChangeAction
  isLoading?: boolean
  placeholder?: string
  width?: number | string
  rows?: number
  cols?: number
  minlength?: number | string
  maxlength?: number | string
  wrap?: TextAreaWrap
  hasClear?: boolean
  hasAutoFocus?: boolean
  htmlName?: string
  form?: string
  clearLabel?: string
  loadingLabel?: string
}

export interface TextAreaEmits {
  change: [value: string, event: TextAreaChangeEvent]
  clear: [event: MouseEvent]
  enter: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
  actionError: [error: unknown, value: string, event: TextAreaChangeEvent]
}

export interface TextAreaSlots {
  icon?: () => VNode[]
  end?: () => VNode[]
  labelIcon?: () => VNode[]
}
