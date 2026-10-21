import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'

export type TypeaheadSize = 'sm' | 'md' | 'lg'
export type TypeaheadStatus = 'default' | 'success' | 'warning' | 'error'

export interface BaseTypeaheadProps<T extends SearchableItem = SearchableItem> {
  /** 当前选中的条目。空表示还没选。 */
  modelValue?: T | null
  /** 静态或异步搜索源。 */
  searchSource: SearchSource<T>
  /**
   * 输入框的无障碍名。外面已经有 `<label for>` 时不用传，避免读两遍。
   */
  label?: string
  /** 外面指定的输入框 id，好让标签的 `for` 对上。 */
  inputId?: string
  /** 外面已经算好的说明和状态 id。 */
  describedBy?: string
  /** `aria-describedby` 的专用别名。给了就盖过原生属性。 */
  ariaDescribedBy?: string
  /** `aria-labelledby` 的专用别名。给了就盖过原生属性。 */
  ariaLabelledBy?: string
  /** 下拉挂靠的元素。不传就用输入框所在的外框。 */
  anchorRef?: HTMLElement | null
  placeholder?: string
  disabled?: boolean
  /** 禁用原因。有值时控件仍可聚焦，方便读到原因。 */
  disabledReason?: string
  /** 强制让禁用的控件还能聚焦，读屏能读到外部说明。 */
  isFocusableDisabled?: boolean
  /** 输入框边框的校验色。说明文字由外面的字段负责。 */
  status?: TypeaheadStatus
  size?: TypeaheadSize
  /** 显示清除按钮。 */
  clearable?: boolean
  /** 输入停顿后再搜索，单位毫秒。本地数据可设为 0。 */
  debounceMs?: number
  /** 下拉最多显示多少条。 */
  maxMenuItems?: number
  /** 下拉想要的宽度，单位像素。太宽时会被视口截住。 */
  menuWidth?: number
  /** 少于这么多字符就不搜，下拉也不打开。按可见字符数。 */
  minQueryLength?: number
  /** 聚焦时还没输入就展示结果。 */
  showOnFocus?: boolean
  /** `showOnFocus` 的原版名。 */
  hasEntriesOnFocus?: boolean
  /** 挂载后自动聚焦输入框。 */
  hasAutoFocus?: boolean
  emptyText?: string | null
  /** 一条结果都没有时显示的内容。`null` 当作没给。 */
  emptySearchText?: string | null
  required?: boolean
  /** 表单字段名。选中后提交条目的 id。 */
  name?: string
  /** 输入框在 Tab 序里的位置。 */
  inputTabIndex?: number
}

export interface TypeaheadProps<T extends SearchableItem = SearchableItem> {
  /** 当前选中的条目。空表示还没选。 */
  modelValue?: T | null
  /** 静态或异步搜索源。 */
  searchSource: SearchSource<T>
  /** 字段标签。屏幕阅读器始终读得到。 */
  label: string
  /** 视觉上隐藏标签。读屏仍然读得到。 */
  isLabelHidden?: boolean
  /** `isLabelHidden` 的旧名。两者任一为真就隐藏。 */
  labelHidden?: boolean
  /** 标签下方的说明。 */
  description?: string
  /** 标签旁边信息图标里的提示文字。 */
  labelTooltip?: string
  placeholder?: string
  disabled?: boolean
  /** 禁用原因。有值时控件仍可聚焦，方便读到原因。 */
  disabledReason?: string
  /** `disabledReason` 的原版名。 */
  disabledMessage?: string
  status?: TypeaheadStatus
  statusMessage?: string
  size?: TypeaheadSize
  /** 显示清除按钮。 */
  clearable?: boolean
  /** `clearable` 的原版名。 */
  hasClear?: boolean
  /** 输入停顿后再搜索，单位毫秒。本地数据可设为 0。 */
  debounceMs?: number
  /** 下拉最多显示多少条。 */
  maxMenuItems?: number
  /** 少于这么多字符就不搜，下拉也不打开。按可见字符数。 */
  minQueryLength?: number
  /** 聚焦时还没输入就展示结果。 */
  showOnFocus?: boolean
  /** `showOnFocus` 的原版名。 */
  hasEntriesOnFocus?: boolean
  /** 挂载后自动聚焦输入框。 */
  hasAutoFocus?: boolean
  emptyText?: string | null
  /** 一条结果都没有时显示的内容。`null` 当作没给。 */
  emptySearchText?: string | null
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
  /** `search` 的原版名。 */
  'changeQuery': [query: string]
  'openChange': [isOpen: boolean]
}

export interface TypeaheadItemProps {
  /** 这一行对应的搜索结果。 */
  item: SearchableItem
  /** 盖过条目自己的说明。 */
  description?: string
  /**
   * 分组标题。默认行不画标题，分组由下拉按 `item.auxiliaryData.group` 自己排，
   * 这个属性只为和外部同名属性对得上而接受。
   */
  group?: string
  /** 这一行看起来不可选。 */
  isDisabled?: boolean
}

export interface TypeaheadSlots<T extends SearchableItem = SearchableItem> {
  /** 输入框开头的图标。 */
  icon?: () => unknown
  /** 自定义下拉条目。 */
  item?: (props: { item: T, isActive: boolean, isSelected: boolean }) => unknown
  /** 自定义空状态。 */
  empty?: () => unknown
}
