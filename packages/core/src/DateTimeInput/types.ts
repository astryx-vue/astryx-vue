import type { WeekStartsOn } from '../composables/useDateRange.js'
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
  /** 任一函数返回 false 时，日期那一半禁用这一天。 */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  numberOfMonths?: 1 | 2
  weekStartsOn?: WeekStartsOn
  isDisabled?: boolean
  isLoading?: boolean
  /** 日期和时间都齐了之后再跑。返回 Promise 时，字段保持加载直到它结束。 */
  changeAction?: (value: string | null) => void | Promise<void>
  isReadOnly?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  labelTooltip?: string
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface DateTimeInputEmits {
  'update:modelValue': [value: string | null]
  'change': [value: string | null]
}
