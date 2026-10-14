import type { FieldStatusInput, FieldStatusType } from '../Field/types.js'

/** 带说明的校验状态。仍接受单独的状态字符串。 */
export type NumberInputStatus = FieldStatusInput | 'default' | FieldStatusType

export interface NumberInputProps {
  /** 当前值 */
  modelValue?: number | null
  /** 占位文本 */
  placeholder?: string
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步进值 */
  step?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用原因 */
  disabledReason?: string
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 标签 */
  label?: string
  /** 标签下方的说明 */
  description?: string
  /** 只把标签留给读屏 */
  isLabelHidden?: boolean
  /** 单位，显示在步进按钮前面，例如 % */
  units?: string
  /** 有值时显示清除按钮 */
  clearable?: boolean
  /** 校验状态。对象形式会在字段下方显示说明。 */
  status?: NumberInputStatus
  /** 名称（用于表单提交） */
  name?: string
}

export interface NumberInputEmits {
  'update:modelValue': [value: number | null]
  'change': [value: number | null]
}
