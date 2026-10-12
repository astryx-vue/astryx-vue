import type { HourFormat, NativePicker, TimePresentation } from '../composables/useTimeValue.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'

export type TimeInputSize = 'sm' | 'md' | 'lg'

export interface TimeInputProps {
  label: string
  modelValue?: string | null
  id?: string
  description?: string
  placeholder?: string
  hourFormat?: HourFormat
  hasSeconds?: boolean
  increment?: number
  min?: string
  max?: string
  presentation?: TimePresentation
  nativePicker?: NativePicker
  hasClear?: boolean
  clearLabel?: string
  size?: TimeInputSize
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface TimeInputEmits {
  'update:modelValue': [value: string | null]
  'change': [value: string | null]
}
