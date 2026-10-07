import type { VNode } from 'vue'

export type CheckboxState = 'unchecked' | 'checked' | 'indeterminate'
export type CheckboxSize = 'sm' | 'md'

export interface CheckboxIndicatorProps {
  state: CheckboxState
  size?: CheckboxSize
  isDisabled?: boolean
}

export interface CheckboxIndicatorSlots {
  default?: () => VNode[]
}
