import type { Component, VNodeChild } from 'vue'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { ExtendedIconName } from '../Icon/types.js'
import type { OptionActionNode } from '../selectors/optionAction.js'

/** 选项前面的图标：语义图标名（同 `<Icon icon>`）、CSS 图标类，或任意组件 / 渲染函数。 */
export type SelectorOptionIcon = ExtendedIconName | Component | (() => VNodeChild)

export interface SelectorOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
  /** 标签前面的图标。语义图标名、CSS 图标类、组件或渲染函数都行。 */
  icon?: SelectorOptionIcon
  /**
   * 这一项旁边的操作。调用方自己画，点它不会改选择。
   * 只要有一项带了操作，弹出层就变成两列网格。
   */
  action?: OptionActionNode | null
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
/** `default` 和 `input` 都是带边框的表单框。`secondary` 对齐次要按钮。 */
export type SelectorVariant = 'input' | 'secondary' | 'ghost' | 'default'
export type SelectorStatusVariant = 'attached' | 'detached' | 'tooltip'
/** 选中标记画在选项行的哪一侧。没有选中时标记不占位。 */
export type SelectorIndicatorPosition = 'start' | 'end'

export interface SelectorProps extends FieldPartStylingProps {
  /** 选中的值 */
  modelValue?: string | number | null
  /** 选项列表，可以按 section 分组 */
  options: readonly SelectorEntry[]
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /**
   * 禁用原因。禁用时鼠标悬停或键盘聚焦会弹出提示，触发器保持可聚焦（aria-disabled），
   * 但打不开列表。不用再在外面套 Tooltip：禁用的控件收不到悬停事件。
   */
  disabledMessage?: string
  /** 禁用原因（旧名，和 disabledMessage 等价） */
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
   * `input`（旧名 `default`）是带边框的输入框。`secondary` 对齐次要按钮。`ghost` 去掉边框，适合放进工具栏。
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
  /** 是否可清除。和 hasClear 等价，两者任一为真即生效。 */
  clearable?: boolean
  /** 是否可清除（原版名字） */
  hasClear?: boolean
  /** 清除按钮标签 */
  clearLabel?: string
  /** 没有任何选项时的空状态。 */
  emptyText?: string
  /** 搜索没有命中时的文案。和没有任何选项不是同一句话。 */
  emptySearchText?: string
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
   * 只读。当前值还在，可以聚焦，也会随表单提交，但打不开列表，也没有清除和展开箭头。
   * 不会变暗。和 disabled 同时设置时按禁用处理。
   */
  isReadOnly?: boolean
  /** 触发器里显示加载指示，面板在加载完成前不声称「没有选项」。 */
  isLoading?: boolean
  /** 在标签旁标成可选。 */
  isOptional?: boolean
  /** 在标签旁标成必填，并设置 aria-required。 */
  isRequired?: boolean
  /**
   * 选中标记在选项行的起始侧或结束侧。
   * 未选中时默认的勾不占位；主题把勾换成单选圆点后，未选中的行也会画出空心圆。
   * @default 'end'
   */
  indicatorPosition?: SelectorIndicatorPosition
}

export interface SelectorEmits {
  'update:modelValue': [value: string | number | null]
  'change': [value: string | number | null]
  'search': [query: string]
  /** 触发器上的点击。先执行，再切换面板；event.preventDefault() 不会阻止面板打开。 */
  'click': [event: MouseEvent]
  /** 触发器获得焦点时触发。 */
  'focus': [event: FocusEvent]
  /** 触发器上的按键。内置键盘模型处理（并取消）的按键不再透出。 */
  'keydown': [event: KeyboardEvent]
}

export interface SelectorSlots {
  /** 选中项内容 */
  selected?: (props: { option: SelectorOption | null }) => any
  /** 选项内容 */
  option?: (props: { option: SelectorOption, isActive: boolean, isSelected: boolean }) => any
  /** 空状态 */
  empty?: () => any
}
