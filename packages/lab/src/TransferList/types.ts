import type { VNodeChild } from 'vue'

/** 一个可搬运的选项。`value` 唯一，`label` 是可见文字，也是操作名的来源。 */
export interface TransferListOption<T extends string = string> {
  value: T
  label: string
  /** 搜索时会一起匹配的补充说明。默认行里不显示。 */
  description?: VNodeChild
  /** 可选面板里的分组标题。 */
  group?: string
  /** 不能在两栏之间搬动。 */
  isTransferDisabled?: boolean
  /** 不能在已选栏里调整顺序，位置固定。 */
  isReorderDisabled?: boolean
  /** 说明为什么搬不动或调不了顺序。 */
  disabledMessage?: string
}

export interface TransferListProps<T extends string = string> {
  /** 整个控件的无障碍名。 */
  label: string
  /** 视觉上隐藏标签，读屏仍然读得到。 */
  isLabelHidden?: boolean
  /** 标签下方的说明。 */
  description?: string
  /** 完整的选项表，`value` 不能重复。 */
  options: readonly TransferListOption<T>[]
  /** 已选项的顺序，同时是唯一的真相来源。 */
  modelValue?: readonly T[]
  /** 已选面板的标题。默认取文案表。 */
  selectedLabel?: string
  /** 可选面板的标题。默认取文案表。 */
  availableLabel?: string
  /** 一个搜索框同时过滤两栏。 */
  hasSearch?: boolean
  /** 搜索框的无障碍名。默认是 `Search {label}`。 */
  searchLabel?: string
  searchPlaceholder?: string
  /** 已选项可以拖动或按键调整顺序。 */
  isReorderable?: boolean
  /** 显示「全部添加」。 */
  hasSelectAll?: boolean
  /** 显示「清空」。搬不动的已选项会留下。 */
  hasClear?: boolean
  selectedEmptyText?: string
  availableEmptyText?: string
  noResultsText?: string
}

export interface TransferListEmits<T extends string = string> {
  'update:modelValue': [value: readonly T[]]
  'change': [value: readonly T[]]
}

export interface TransferListSlots<T extends string = string> {
  /** 自定义一行里的内容。 */
  option?: (props: { option: TransferListOption<T> }) => VNodeChild
}

/** 面板里的一行：选项本身，加上它在这一栏里的位置。 */
export interface PanelRow<T extends string = string> {
  option: TransferListOption<T>
  index: number
}

/** 可选栏按 `group` 分出来的一段。 */
export interface PanelGroup<T extends string = string> {
  group: string
  options: PanelRow<T>[]
}
