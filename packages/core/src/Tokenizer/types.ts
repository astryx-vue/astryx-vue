import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'

export type TokenizerSize = 'sm' | 'md' | 'lg'
export type TokenizerStatus = 'default' | 'success' | 'warning' | 'error'

/**
 * none：标签换行。
 * unfocused-inline：失焦时收成一行，末尾 +N，聚焦后在原处展开。
 * unfocused-layer：失焦时同样收成一行，聚焦后浮在字段上展开，不把下面的内容往下推。
 */
export type TokenizerOverflow = 'none' | 'unfocused-inline' | 'unfocused-layer'

export type TokenizerChange<T extends SearchableItem = SearchableItem>
  = | { type: 'add', item: T }
    | { type: 'create', item: T }
    | { type: 'remove', item: T }
    | { type: 'clear' }

export interface TokenizerProps<T extends SearchableItem = SearchableItem> {
  modelValue?: readonly T[]
  searchSource: SearchSource<T>
  label: string
  labelHidden?: boolean
  description?: string
  placeholder?: string
  disabled?: boolean
  disabledReason?: string
  status?: TokenizerStatus
  statusMessage?: string
  size?: TokenizerSize
  clearable?: boolean
  debounceMs?: number
  maxMenuItems?: number
  showOnFocus?: boolean
  emptyText?: string
  /** 最多可选几条。 */
  maxEntries?: number
  /** 回车可以把输入的文字收成一条新标签。 */
  creatable?: boolean
  overflow?: TokenizerOverflow
  required?: boolean
  optional?: boolean
  /** 表单字段名。每个选中项提交一个 id。 */
  name?: string
  width?: number | string
}

export interface TokenizerEmits<T extends SearchableItem = SearchableItem> {
  'update:modelValue': [value: T[]]
  'change': [value: T[], change: TokenizerChange<T>]
  'search': [query: string]
  'openChange': [isOpen: boolean]
}

export interface TokenizerSlots<T extends SearchableItem = SearchableItem> {
  icon?: () => unknown
  end?: () => unknown
  token?: (props: { item: T, remove: () => void }) => unknown
  item?: (props: { item: T, isActive: boolean, isSelected: boolean }) => unknown
  empty?: () => unknown
}
