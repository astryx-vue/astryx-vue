import type { Reorderable } from '@astryx-vue/core'
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
  /** 不能在已选栏里调整顺序，位置固定，也没有重排手柄。用 `reorderable` 时也可以让它的 `isReorderable(value)` 返回 false。 */
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
  /** 禁用所有搬运、排序、清空、全部添加和搜索。行上的按钮与搜索框仍可聚焦。 */
  isDisabled?: boolean
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
  /**
   * 已选项按 core List 的方式重排：行尾有重排手柄，手指按住一下再拖，鼠标直接拖，
   * 点一下或按空格、回车进入重排模式后用方向键挪。传 `createReorderable` 或 `useReorderable` 做的对象，
   * 它的 `isReorderable(value)` 决定哪些值能挪，每次挪动交给它的 `onReorder({ key, to })`，
   * `to` 是挪动之后这个值在 `modelValue` 里的下标。传了它，`isReorderable` 就不起作用。
   * 搜索过滤着面板时暂停重排。
   */
  reorderable?: Reorderable<T>
  /**
   * 没传 `reorderable` 时，用内置的重排：挪完直接通过 `v-model` 和 `change` 交回新顺序。
   * 设为 false 关掉重排。
   * @default true
   */
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
