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
  /** 视觉上隐藏标签。读屏仍然读得到。 */
  isLabelHidden?: boolean
  /** `isLabelHidden` 的旧名。两者任一为真就隐藏。 */
  labelHidden?: boolean
  description?: string
  /** 标签旁边信息图标里的提示文字。 */
  labelTooltip?: string
  placeholder?: string
  disabled?: boolean
  disabledReason?: string
  /** `disabledReason` 的原版名。 */
  disabledMessage?: string
  status?: TokenizerStatus
  statusMessage?: string
  size?: TokenizerSize
  clearable?: boolean
  /** `clearable` 的原版名。 */
  hasClear?: boolean
  debounceMs?: number
  maxMenuItems?: number
  /** 下拉想要的宽度，单位像素。窄不过输入框，再宽会被视口截住。 */
  menuWidth?: number
  /** 少于这么多字符就不搜，下拉也不打开。按可见字符数。 */
  minQueryLength?: number
  showOnFocus?: boolean
  /** `showOnFocus` 的原版名。 */
  hasEntriesOnFocus?: boolean
  /** 挂载后自动聚焦输入框。 */
  hasAutoFocus?: boolean
  emptyText?: string | null
  /** 一条结果都没有时显示的内容。`null` 当作没给。 */
  emptySearchText?: string | null
  /** 最多可选几条。 */
  maxEntries?: number
  /** 回车可以把输入的文字收成一条新标签。 */
  creatable?: boolean
  /** `creatable` 的原版名。 */
  hasCreate?: boolean
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
  /** `search` 的原版名。 */
  'changeQuery': [query: string]
  'openChange': [isOpen: boolean]
  /** 焦点从外面进入整个字段时。 */
  'focus': [event: FocusEvent]
  /** 焦点离开整个字段时。 */
  'blur': [event: FocusEvent]
}

export interface TokenizerSlots<T extends SearchableItem = SearchableItem> {
  icon?: () => unknown
  end?: () => unknown
  token?: (props: { item: T, remove: () => void }) => unknown
  item?: (props: { item: T, isActive: boolean, isSelected: boolean }) => unknown
  empty?: () => unknown
}
