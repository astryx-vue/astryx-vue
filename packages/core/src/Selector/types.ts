export interface SelectorOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

export type SelectorSize = 'sm' | 'md' | 'lg'
export type SelectorStatus = 'default' | 'success' | 'warning' | 'error'
export type SelectorPresentation = 'popover' | 'bottom-sheet'

export interface SelectorProps {
  /** 选中的值 */
  modelValue?: string | number | null
  /** 选项列表 */
  options: readonly SelectorOption[]
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用原因（鼠标悬停时显示） */
  disabledReason?: string
  /** 状态 */
  status?: SelectorStatus
  /** 状态消息 */
  statusMessage?: string
  /** 尺寸 */
  size?: SelectorSize
  /**
   * popover 锚在触发器下，bottom-sheet 在底部弹层里展开。
   * @default 'popover'
   */
  presentation?: SelectorPresentation
  /** 是否可搜索 */
  searchable?: boolean
  /** 搜索占位文本 */
  searchPlaceholder?: string
  /** 是否可清除 */
  clearable?: boolean
  /** 清除按钮标签 */
  clearLabel?: string
  /** 空状态文本 */
  emptyText?: string
  /** 标签（用于无障碍） */
  label?: string
  /** 名称（用于表单提交） */
  name?: string
}

export interface SelectorEmits {
  'update:modelValue': [value: string | number | null]
  'change': [value: string | number | null]
  'search': [query: string]
}

export interface SelectorSlots {
  /** 选中项内容 */
  selected?: (props: { option: SelectorOption | null }) => any
  /** 选项内容 */
  option?: (props: { option: SelectorOption, isActive: boolean, isSelected: boolean }) => any
  /** 空状态 */
  empty?: () => any
}
