import type { VNode } from 'vue'
import type { RadioListProps, RadioValue } from '../Radio/types.js'

export type { RadioListProps }

export interface RadioListItemProps {
  /**
   * 单选圈相对标签的垂直对齐。`first-line` 让它和换行标签的第一行保持水平，`start` 贴顶。
   * @default 'center'
   */
  align?: 'center' | 'start' | 'first-line'
  value: RadioValue
  label: string
  description?: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export interface RadioListItemSlots {
  label?: () => VNode[]
  description?: () => VNode[]
  end?: () => VNode[]
}
