import type { ComputedRef, InjectionKey, Ref, VNode } from 'vue'
import type { FieldLabelProps, FieldStatusInput, FieldStatusType, FieldStatusVariant } from '../Field/types.js'

export type RadioValue = string | number
export type RadioStatus = FieldStatusInput
export type RadioStatusType = FieldStatusType
export type RadioChangeEvent = CustomEvent<{ value: RadioValue, originalEvent: Event }>

export interface RadioOption {
  value: RadioValue
  label: string
  description?: string
  isDisabled?: boolean
}

export interface RadioGroupProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'> {
  modelValue: RadioValue
  id?: string
  name?: string
  options?: RadioOption[]
  status?: RadioStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export interface RadioGroupEmits {
  'update:modelValue': [value: RadioValue]
  'change': [value: RadioValue, event: RadioChangeEvent]
}

export interface RadioListProps extends RadioGroupProps {}

export interface RadioGroupSlots {
  default?: () => VNode[]
  labelIcon?: () => VNode[]
}

export interface RadioProps {
  value: RadioValue
  label: string
  description?: string
  id?: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export interface RadioEmits {
  change: [value: RadioValue, event: CustomEvent]
}

export interface RadioSlots {
  labelIcon?: () => VNode[]
}

export interface RadioContext {
  name: ComputedRef<string>
  selectedValue: Readonly<Ref<RadioValue>>
  select: (value: RadioValue, event: Event) => void
  isGroupDisabled: ComputedRef<boolean>
  isGroupReadOnly: ComputedRef<boolean>
  isRequired: ComputedRef<boolean>
}

export const radioContextKey: InjectionKey<RadioContext> = Symbol('astryx-radio-context')
