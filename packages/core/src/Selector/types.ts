import type { FieldStatusInput } from '../Field/types.js'
import type { IndicatorPosition } from '../Indicator/types.js'

export interface SelectorOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
  /** CSS icon class or a component, drawn before the label. */
  icon?: string
}

/** 字符串会当成 value 和 label 相同的选项，演练场模板一直这样传。 */
export type SelectorOptionInput = SelectorOption | string

/** A titled group of options. */
export interface SelectorSection {
  type: 'section'
  title?: string
  options: readonly SelectorOption[]
}

export type SelectorEntry = SelectorOptionInput | SelectorSection

export type SelectorSize = 'sm' | 'md' | 'lg'
export type SelectorStatus = 'default' | 'success' | 'warning' | 'error'
/** 字符串状态，或演练场里那种 `{ type, message }`。 */
export type SelectorStatusInput = SelectorStatus | FieldStatusInput
export type SelectorPresentation = 'popover' | 'bottom-sheet'
export type SelectorVariant = 'default' | 'ghost'
export type SelectorStatusVariant = 'attached' | 'detached' | 'tooltip'

export interface SelectorProps {
  /** 选中的值 */
  modelValue?: string | number | null
  /** 选项列表，可以按 section 分组 */
  options: readonly SelectorEntry[]
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用原因（鼠标悬停时显示） */
  disabledReason?: string
  /** 状态。可以是 `'error'`，也可以是 `{ type, message }`。 */
  status?: SelectorStatusInput
  /** 状态消息 */
  statusMessage?: string
  /**
   * 状态文案的呈现。tooltip 只留给读屏，不在控件下再画一行。
   * @default 'attached'
   */
  statusVariant?: SelectorStatusVariant
  /** 尺寸 */
  size?: SelectorSize
  /**
   * default 是带边框的输入框，ghost 去掉边框，适合放进工具栏。
   * @default 'default'
   */
  variant?: SelectorVariant
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
  /** 可见标签。不传时用占位文本作为隐藏的无障碍名称。 */
  label?: string
  /** 隐藏可见标签，仍保留给读屏。 */
  isLabelHidden?: boolean
  /** 标签下方的说明 */
  description?: string
  /** 控件宽度。数字按像素，字符串原样使用。 */
  width?: number | string
  /** 名称（用于表单提交） */
  name?: string
  /**
   * 单选标记放在选项的哪一侧。
   * 未选中时默认的勾不占位；主题把勾换成单选圆点后，未选中的行也会画出空心圆。
   * @default 'end'
   */
  indicatorPosition?: IndicatorPosition
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
