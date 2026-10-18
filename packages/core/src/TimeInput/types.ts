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
  labelTooltip?: string
  /** 正在加载。字段不可改，并显示加载指示。 */
  isLoading?: boolean
  /** 加载指示的读屏文本。 */
  loadingLabel?: string
  /** 为什么禁用。和 `isDisabled` 一起用时，字段仍可聚焦（带 `aria-disabled`），但不能改值。 */
  disabledMessage?: string
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface TimeInputEmits {
  'update:modelValue': [value: string | null]
  'change': [value: string | null]
}
