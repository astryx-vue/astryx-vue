import type { CheckboxSize } from '../CheckboxIndicator/types.js'
import type { FieldLabelProps, FieldLabelSlots, FieldStatusInput } from '../Field/types.js'

export type CheckboxValue = boolean | 'indeterminate'
export type CheckboxInputChangeEvent = CustomEvent<{ value: boolean, originalEvent: Event }>
export type CheckboxInputChangeAction = (value: boolean, event: CheckboxInputChangeEvent) => void | Promise<void>

export interface CheckboxInputProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'> {
  modelValue: CheckboxValue
  id?: string
  size?: CheckboxSize
  width?: number | string
  htmlName?: string
  isReadOnly?: boolean
  isLoading?: boolean
  disabledMessage?: string
  status?: FieldStatusInput
  changeAction?: CheckboxInputChangeAction
  hasAutoFocus?: boolean
  loadingLabel?: string
}

export interface CheckboxInputEmits {
  change: [value: boolean, event: CheckboxInputChangeEvent]
  actionError: [error: unknown, value: boolean, event: CheckboxInputChangeEvent]
}

export interface CheckboxInputSlots extends FieldLabelSlots {}
