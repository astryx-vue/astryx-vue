import type { VNodeChild } from 'vue'

/** 一次列表改动。`update` 里 `columnKey` 是触发改动的列。 */
export type ListInputChange<T>
  = | { type: 'add', item: T, index: number }
    | { type: 'update', item: T, previousItem: T, index: number, columnKey?: string }
    | { type: 'remove', item: T, index: number }
    | { type: 'reorder', item: T, fromIndex: number, toIndex: number }

/** 单元格渲染器拿到的、和位置有关的上下文。 */
export interface ListInputValueContext<T> {
  /** 当前记录。 */
  item: T
  /** 当前可见位置，从 0 开始。 */
  index: number
  /** 单元格的无障碍名，已经带上这是第几条。 */
  label: string
  /** 永远是 `true`：列名由 ListInput 自己画，字段不用再画一遍。 */
  isLabelHidden: boolean
}

export interface ListInputRenderContext<T> extends ListInputValueContext<T> {
  /** 这一格自己的校验状态。 */
  status?: { type: 'error' | 'warning' | 'success', message?: string }
  /** 交给 Astryx 输入控件，让它用自带的提示气泡显示状态。 */
  statusVariant: 'tooltip'
  isDisabled: boolean
  isLoading: boolean
  /** 换掉这一条记录。`columnKey` 不传时用当前列的 key。 */
  updateItem: (nextItem: T, columnKey?: string) => void
}

/** 列宽：按比例分配时给一个最小宽度兜底，也可以直接写死像素。 */
export type ListInputColumnWidth
  = | { type: 'proportional', value?: number, minWidth?: number }
    | { type: 'pixel', value: number }

export interface ListInputColumn<T> {
  /** 列标识，同时传给 `getFieldStatus`。 */
  key: string
  /** 列名。只在第一条上显示；行堆叠时每条都显示。 */
  header: string
  /** 列宽。默认是比例列，最小 140px。 */
  width?: ListInputColumnWidth
  /** 画这一格的输入控件。 */
  renderInput: (context: ListInputRenderContext<T>) => VNodeChild
}

export interface ListInputProps<T> {
  /** 列表的可见标签，也是无障碍名。 */
  label: string
  description?: string
  modelValue?: T[]
  /** 每条记录的唯一键，用来保持焦点和顺序。 */
  getItemKey: (item: T) => string | number
  /** 点「添加」时造一条新记录。 */
  createItem: () => T
  columns: ListInputColumn<T>[]
  /** 操作名和播报里用的单数名词。 */
  itemName?: string
  /** 整个列表的校验状态。 */
  status?: { type: 'error' | 'warning' | 'success', message?: string }
  /** 一条记录整体的校验状态，显示在该行下方。 */
  getItemStatus?: (item: T, index: number) => { type: 'error' | 'warning' | 'success', message?: string } | undefined
  /** 单格的校验状态，交给对应的输入控件。 */
  getFieldStatus?: (item: T, columnKey: string, index: number) => { type: 'error' | 'warning' | 'success', message?: string } | undefined
  /** 显示拖动手柄，可以拖动或用键盘调整顺序。 */
  isReorderable?: boolean
  isDisabled?: boolean
  /** 列表正忙：所有改动都被挡住，但值仍然可读。 */
  isLoading?: boolean
  /** 最多几条。到上限时「添加」禁用，但删除照常可用。 */
  maxItems?: number
  isLabelHidden?: boolean
  isOptional?: boolean
  isRequired?: boolean
}

export interface ListInputEmits<T> {
  'update:modelValue': [value: T[]]
  'change': [value: T[], change: ListInputChange<T>]
}
