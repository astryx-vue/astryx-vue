import type { VNode } from 'vue'
import type { FieldLabelProps, FieldStatusInput, FieldStatusType, FieldStatusVariant } from '../Field/types.js'

export type SwitchSize = 'sm' | 'md' | 'lg'
export type SwitchStatus = FieldStatusInput
export type SwitchStatusType = FieldStatusType
export type SwitchChangeEvent = CustomEvent<{ value: boolean, originalEvent: Event }>
export type SwitchChangeAction = (value: boolean, event: SwitchChangeEvent) => void | Promise<void>

export interface SwitchProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'> {
  modelValue: boolean
  id?: string
  size?: SwitchSize
  isReadOnly?: boolean
  disabledMessage?: string
  status?: SwitchStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  changeAction?: SwitchChangeAction
  isLoading?: boolean
  description?: string
  width?: number | string
  hasAutoFocus?: boolean
  htmlName?: string
  form?: string
  loadingLabel?: string
}

export interface SwitchEmits {
  change: [value: boolean, event: SwitchChangeEvent]
  actionError: [error: unknown, value: boolean, event: SwitchChangeEvent]
}

export interface SwitchSlots {
  labelIcon?: () => VNode[]
}
