import type { FieldStatusInput } from '../Field/types.js'

export type InputGroupSize = 'sm' | 'md' | 'lg'

export interface InputGroupProps {
  /**
   * 整组的无障碍名称。写上之后，组会带上标签、说明、可选或必填，以及状态。
   * 组内输入框自己的标签继续说明这一格填什么，通常隐藏起来。
   */
  label?: string
  /** 视觉上隐藏标签，读屏仍能读到。 */
  isLabelHidden?: boolean
  /** 标签和控件之间的说明。 */
  description?: string
  /** 是否禁用整组，并传给组内控件。 */
  disabled?: boolean
  /** 在标签旁标成可选。 */
  isOptional?: boolean
  /** 在标签旁标成必填。 */
  isRequired?: boolean
  /** 尺寸，传给组内控件。 */
  size?: InputGroupSize
  /** 整组边框和控件下方的状态。 */
  status?: FieldStatusInput
  /** 标签末尾的提示。 */
  labelTooltip?: string
}

export interface InputGroupSlots {
  /** 前缀内容（图标或文本） */
  before?: () => any
  /** 主输入框 */
  default?: () => any
  /** 后缀内容（图标或按钮） */
  after?: () => any
}

export interface InputGroupTextProps {
  /** 供测试定位。 */
  id?: string
}

export interface InputGroupTextSlots {
  default?: () => any
}
