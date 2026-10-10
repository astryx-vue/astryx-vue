export type InputGroupSize = 'sm' | 'md' | 'lg'

export interface InputGroupProps {
  /** 尺寸 */
  size?: InputGroupSize
  /** 是否禁用（传递给子组件） */
  disabled?: boolean
}

export interface InputGroupSlots {
  /** 前缀内容（图标或文本） */
  before?: () => any
  /** 主输入框 */
  default?: () => any
  /** 后缀内容（图标或按钮） */
  after?: () => any
}
