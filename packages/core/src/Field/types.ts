import type { Component, VNode } from 'vue'

export type FieldStatusType = 'error' | 'warning' | 'success'
export type FieldStatusVariant = 'attached' | 'detached'

export interface FieldStatusInput {
  type: FieldStatusType
  message?: string
  messageId?: string
}

export interface FieldLabelProps {
  label: string
  inputId: string
  labelId?: string
  isGroupLabel?: boolean
  isLabelHidden?: boolean
  isDisabled?: boolean
  isOptional?: boolean
  isRequired?: boolean
  description?: string
  descriptionId?: string
  labelIcon?: Component
  labelTooltip?: string
  optionalLabel?: string
  requiredLabel?: string
}

export interface FieldProps extends FieldLabelProps {
  status?: FieldStatusInput
  /** Tooltip leaves the message accessible but hides the inline status box. */
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface FieldStatusProps {
  type: FieldStatusType
  message: string
  variant?: FieldStatusVariant
  isVisuallyHidden?: boolean
}

export interface FieldSlotProps {
  inputId: string
  labelId: string
  descriptionId?: string
  statusId?: string
  describedBy?: string
}

export interface FieldLabelSlots {
  labelIcon?: () => VNode[]
}

export interface FieldSlots extends FieldLabelSlots {
  default: (props: FieldSlotProps) => VNode[]
}
