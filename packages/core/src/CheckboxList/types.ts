import type { VNode } from 'vue'
import type { CheckboxValue } from '../CheckboxInput/types.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'
import type { ListDensity } from '../List/types.js'

export interface CheckboxListProps {
  label: string
  modelValue?: string[]
  id?: string
  description?: string
  density?: ListDensity
  hasDividers?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface CheckboxListEmits {
  'update:modelValue': [value: string[]]
  'change': [value: string[]]
}

export interface CheckboxListItemProps {
  label: string
  value?: string
  description?: string
  isDisabled?: boolean
  isChecked?: CheckboxValue
}

export interface CheckboxListItemEmits {
  check: [checked: boolean]
}

export interface CheckboxListItemSlots {
  end?: () => VNode[]
}
