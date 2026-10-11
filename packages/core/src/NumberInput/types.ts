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
  /** 名称（用于表单提交） */
  name?: string
}

export interface NumberInputEmits {
  'update:modelValue': [value: number | null]
  'change': [value: number | null]
}
