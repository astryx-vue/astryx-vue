import type { HourFormat, NativePicker, TimePresentation } from '../composables/useTimeValue.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'

export type DateTimeInputSize = 'sm' | 'md' | 'lg'

export interface DateTimeInputProps {
  label: string
  modelValue?: string | null
  id?: string
  description?: string
  placeholder?: string
  hourFormat?: HourFormat
  presentation?: TimePresentation
  nativePicker?: NativePicker
  hasClear?: boolean
  clearLabel?: string
  size?: DateTimeInputSize
  min?: string
  max?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface DateTimeInputEmits {
  'update:modelValue': [value: string | null]
  'change': [value: string | null]
}
