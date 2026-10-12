import type { ISODateRange, WeekStartsOn } from '../composables/useDateRange.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'

export type DateRange = ISODateRange

export interface DateRangePreset {
  label: string
  getRange: () => DateRange
}

export interface DateRangeInputProps {
  label: string
  modelValue?: DateRange | null
  id?: string
  description?: string
  placeholder?: string
  presets?: readonly DateRangePreset[]
  monthCount?: number
  min?: string
  max?: string
  minRangeSpan?: number
  maxRangeSpan?: number
  weekStartsOn?: WeekStartsOn
  hasClear?: boolean
  clearLabel?: string
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface DateRangeInputEmits {
  'update:modelValue': [value: DateRange | null]
  'change': [value: DateRange | null]
}
