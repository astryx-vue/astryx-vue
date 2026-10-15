import type { Ref } from 'vue'

export type MultiSelectorSize = 'sm' | 'md' | 'lg'
export type MultiSelectorVariant = 'input' | 'ghost'
export type MultiSelectorPresentation = 'popover' | 'bottom-sheet'
export type MultiSelectorStatus = 'default' | 'success' | 'warning' | 'error'
export type MultiSelectorStatusVariant = 'attached' | 'detached' | 'tooltip'
export type MultiSelectorTriggerDisplay = 'count' | 'labels' | 'badges'
export type MultiSelectorCheckboxPosition = 'start' | 'end'

export interface MultiSelectorSelectedItem {
  value: string | number
  label: string
}

/** 只有创建会带这个描述。普通勾选仍然只传新的值数组。 */
export interface MultiSelectorCreateChange {
  type: 'create'
  query: string
}

export interface MultiSelectorHandle {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

/**
 * 模板里的 ref 会被自动解包，`:handle-ref="someRef"` 会拿到 null。
 * 模板里传回调，或者在脚本里把 ref 对象本身传进来。
 */
export type MultiSelectorHandleRef
  = | Ref<MultiSelectorHandle | null>
    | ((handle: MultiSelectorHandle | null) => void)

export interface MultiSelectorOptionData {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

export interface MultiSelectorDivider {
  type: 'divider'
}

export interface MultiSelectorSection {
  type: 'section'
  label: string
  options: readonly (string | MultiSelectorOptionData)[]
}

export type MultiSelectorOption = string | MultiSelectorOptionData | MultiSelectorDivider | MultiSelectorSection

export interface MultiSelectorProps {
  modelValue?: readonly (string | number)[]
  options: readonly MultiSelectorOption[]
  label: string
  labelHidden?: boolean
  description?: string
  placeholder?: string
  disabled?: boolean
  disabledReason?: string
  status?: MultiSelectorStatus
  statusMessage?: string
  /**
   * 状态文案怎么放。工具栏里的 ghost 会把 attached 收成独立说明，避免把行高撑开。
   * tooltip 把说明留在图标上。
   */
  statusVariant?: MultiSelectorStatusVariant
  size?: MultiSelectorSize
  /** input 是带边框的表单控件，ghost 适合放在工具栏里。 */
  variant?: MultiSelectorVariant
  /** popover 锚在触发器下，bottom-sheet 在底部弹层里展开。 */
  presentation?: MultiSelectorPresentation
  clearable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  /** 列表顶部的全选行。 */
  selectAll?: boolean
  selectAllLabel?: string
  /**
   * count 显示「已选 N 项」，labels 用逗号拼接，badges 用标签并在放不下时显示 +N。
   */
  triggerDisplay?: MultiSelectorTriggerDisplay
  /** badges / labels 最多露出几项，更窄时还会按宽度再收。 */
  maxBadges?: number
  checkboxPosition?: MultiSelectorCheckboxPosition
  required?: boolean
  optional?: boolean
  name?: string
  width?: number | string
  /**
   * 只读。已选值还在，可以聚焦，也会随表单提交，但打不开列表，也没有清除和展开箭头。
   * 不会变暗。和 disabled 同时设置时按禁用处理。
   */
  isReadOnly?: boolean
  /** 触发器里显示加载指示。加载时不提供创建行，面板也不声称没有选项。 */
  isLoading?: boolean
  /**
   * 自定义关闭后的文字。只在 count 和 labels 两种展示里使用，badges 忽略。
   * 没有任何选中项时不调用，触发器继续显示占位符。
   */
  formatValue?: (items: MultiSelectorSelectedItem[]) => string
  /**
   * 和 searchable 一起用。输入的文字和任何选项标签都不相同（忽略大小写）时，
   * 列表第一行是「创建」。选中后 change 会多带 `{ type: 'create', query }`，
   * 调用方要在同一次更新里把这个选项加进 options。没有搜索时不会出现创建行。
   */
  hasCreate?: boolean
  /** 从外面打开、关闭或查询面板。只读和禁用时 open 不会打开。 */
  handleRef?: MultiSelectorHandleRef
  /** 面板里没有任何选项时的文案。 */
  emptyText?: string
  /** 搜索没有命中时的文案。 */
  emptySearchText?: string
}

export interface MultiSelectorEmits {
  'update:modelValue': [value: (string | number)[]]
  'change': [value: (string | number)[], change?: MultiSelectorCreateChange]
  'search': [query: string]
  'openChange': [isOpen: boolean]
}

export interface MultiSelectorSlots {
  icon?: () => unknown
  option?: (props: { option: MultiSelectorOptionData, selected: boolean, active: boolean }) => unknown
  empty?: () => unknown
}
