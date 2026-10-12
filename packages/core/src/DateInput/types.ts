export interface DateInputProps {
  /** 输入框 id。不传时组件自己生成。 */
  id?: string
  /** 额外的无障碍描述，接在字段说明后面。 */
  describedBy?: string
  /** 当前选中的日期 */
  modelValue?: Date | null
  /** 占位符文本 */
  placeholder?: string
  /** 最小可选日期 */
  min?: Date
  /** 最大可选日期 */
  max?: Date
  /** 禁用的日期判断函数 */
  isDateDisabled?: (date: Date) => boolean
  /** 表单字段名 */
  name?: string
  /** 输入框标签 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用原因 */
  disabledReason?: string
  /** 是否可清除 */
  clearable?: boolean
  /** 清除按钮标签 */
  clearLabel?: string
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 状态 */
  status?: 'default' | 'error' | 'warning' | 'success'
}

export interface DateInputEmits {
  (event: 'update:modelValue', value: Date | null): void
  (event: 'change', value: Date | null): void
}

export interface DateInputSlots {
  /** 自定义前缀图标 */
  prefix?: () => any
  /** 自定义后缀内容 */
  suffix?: () => any
}
