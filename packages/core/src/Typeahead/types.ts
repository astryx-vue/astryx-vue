import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'

export type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'

export type TypeaheadSize = 'sm' | 'md' | 'lg'
export type TypeaheadStatus = 'default' | 'success' | 'warning' | 'error'

export interface TypeaheadProps<T extends SearchableItem = SearchableItem> {
  /** 当前选中的条目。空表示还没选。 */
  modelValue?: T | null
  /** 静态或异步搜索源。 */
  searchSource: SearchSource<T>
  /** 字段标签。屏幕阅读器始终读得到。 */
  label: string
  /** 视觉上隐藏标签。 */
  labelHidden?: boolean
  /** 标签下方的说明。 */
  description?: string
  placeholder?: string
  disabled?: boolean
  /** 禁用原因。有值时控件仍可聚焦，方便读到原因。 */
  disabledReason?: string
  status?: TypeaheadStatus
  statusMessage?: string
  size?: TypeaheadSize
  /** 显示清除按钮。 */
  clearable?: boolean
  /** 输入停顿后再搜索，单位毫秒。本地数据可设为 0。 */
  debounceMs?: number
  /** 下拉最多显示多少条。 */
  maxMenuItems?: number
  /** 聚焦时还没输入就展示结果。 */
  showOnFocus?: boolean
  emptyText?: string
  required?: boolean
  optional?: boolean
  /** 表单字段名。选中后提交条目的 id。 */
  name?: string
  width?: number | string
}

export interface TypeaheadEmits<T extends SearchableItem = SearchableItem> {
  'update:modelValue': [value: T | null]
  'change': [value: T | null]
  'search': [query: string]
  'openChange': [isOpen: boolean]
}

export interface TypeaheadSlots<T extends SearchableItem = SearchableItem> {
  /** 输入框开头的图标。 */
  icon?: () => unknown
  /** 自定义下拉条目。 */
  item?: (props: { item: T, isActive: boolean, isSelected: boolean }) => unknown
  /** 自定义空状态。 */
  empty?: () => unknown
}
