/**
 * 一条可搜索的候选项。字段和 core `Typeahead` 的 `SearchableItem` 一致，
 * 这样 core 的 `SearchSource` 可以直接传进来。
 */
export interface SearchableItem {
  id: string
  label: string
  disabled?: boolean
  description?: string
}

/**
 * 搜索数据源。同步数组和 Promise 都可以，和 core `Typeahead` 的 `SearchSource` 同形。
 * 空查询时优先走 `bootstrap`，没有就用空字符串搜一次。
 */
export interface SearchSource<T extends SearchableItem = SearchableItem> {
  search: (query: string, signal?: AbortSignal) => Promise<T[]> | T[]
  bootstrap?: (signal?: AbortSignal) => Promise<T[]> | T[]
  cancel?: () => void
}

/**
 * 一次选择变化。`add` 加已有条目，`create` 加用户新造的值，
 * `remove` 去掉一条。一次清空全部时 `item` 是原来最后一条。
 */
export type MobileTokenizerChange<T extends SearchableItem = SearchableItem>
  = | { item: T, type: 'add' }
    | { item: T, type: 'create' }
    | { item: T, type: 'remove' }

export interface MobileTokenizerProps<T extends SearchableItem = SearchableItem> {
  /** 字段标签，同时是底部面板的无障碍名。 */
  label: string
  searchSource: SearchSource<T>
  modelValue?: readonly T[]
  /** 一条都没选时触发器里的提示文字。 */
  placeholder?: string
  /** 标签下方的说明。 */
  description?: string
  isOptional?: boolean
  isDisabled?: boolean
  /** 给没匹配上的文字提供 `Create "…"` 的加一项操作。 */
  hasCreate?: boolean
  /** 最多选几条；到上限后没选中的行会禁用。 */
  maxEntries?: number
  /** 搜索结果最多留多少条，超出的靠滚动分批画出来。 */
  maxMenuItems?: number
  /** 少于这么多字符就不搜。 */
  minQueryLength?: number
  /** 输入停顿多久之后才搜，单位毫秒。 */
  debounceMs?: number
  /** 搜索没有结果时显示的标题。 */
  emptySearchResultsText?: string
}

export interface MobileTokenizerEmits<T extends SearchableItem = SearchableItem> {
  'update:modelValue': [value: T[]]
  'change': [value: T[], change: MobileTokenizerChange<T>]
  'update:query': [query: string]
  'changeQuery': [query: string]
  'openChange': [isOpen: boolean]
}
