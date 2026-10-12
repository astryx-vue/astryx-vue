import type { VNode } from 'vue'
import type { RadioListProps, RadioValue } from '../Radio/types.js'

export type { RadioListProps }

export interface RadioListItemProps {
  value: RadioValue
  label: string
  description?: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export interface RadioListItemSlots {
  end?: () => VNode[]
}
