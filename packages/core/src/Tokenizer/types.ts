import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { InputStatusVariant } from '../composables/useInputStatusIcon.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { TypeaheadDialogMenuSlotProps, TypeaheadListboxMenuSlotProps, TypeaheadMenuConfig } from '../Typeahead/types.js'

export type TokenizerSize = 'sm' | 'md' | 'lg'
export type TokenizerStatus = 'default' | 'success' | 'warning' | 'error'

/**
 * none：标签换行。
 * unfocused-inline：失焦时收成一行，末尾 +N，聚焦后在原处展开。
 * unfocused-layer：失焦时同样收成一行，聚焦后浮在字段上展开，不把下面的内容往下推。
 */
export type TokenizerOverflow = 'none' | 'unfocused-inline' | 'unfocused-layer'

/**
 * popover：行内输入框加锚定的结果菜单。
 * bottom-sheet：字段是一个打开触屏底部弹层的触发器，在弹层里搜索、勾选，按「保存」提交。
 * adaptive：紧凑触屏上用底部弹层，其余用浮层；服务端渲染和水合时是浮层。
 */
export type TokenizerPresentation = 'popover' | 'bottom-sheet' | 'adaptive'

export type TokenizerChange<T extends SearchableItem = SearchableItem>
  = | { type: 'add', item: T }
    | { type: 'create', item: T }
    | { type: 'remove', item: T }
    | { type: 'clear' }

export interface TokenizerProps<T extends SearchableItem = SearchableItem> extends FieldPartStylingProps {
  modelValue?: readonly T[]
  /** 菜单里放什么，默认是结果列表。见 {@link TypeaheadMenuConfig}。 */
  menu?: TypeaheadMenuConfig
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
  /**
   * 状态相对输入框怎么摆：`attached` 框里画图标、说明在下面，`detached` 只画下面的说明，
   * `tooltip` 框里画一个能聚焦的图标按钮，说明收在它的提示里。
   * @default 'attached'
   */
  statusVariant?: InputStatusVariant
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
  /**
   * 结果在哪里呈现。`popover` 是行内输入框加锚定菜单；`bottom-sheet` 让字段变成触发器，
   * 在触屏底部弹层里编辑一份草稿：勾选行、新建、全部清除都只改草稿，按「保存」才提交一次，
   * 草稿改过时下滑、点遮罩、Escape 会先确认要不要放弃；`adaptive` 在紧凑触屏上用底部弹层，
   * 其余用浮层。底部弹层里，`item` 插槽、`hasClear`、`hasEntriesOnFocus`、`menuWidth`、`menu`、
   * `overflow`、`hasAutoFocus` 没有地方生效，开发期会提示一次；想在所有设备上保留行内字段就传
   * `popover`。
   * @default 'adaptive'
   */
  presentation?: TokenizerPresentation
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
  /** 菜单内容：listbox 角色在结果列表周围放信息，dialog 角色是菜单的全部内容。 */
  menu?: (props: TypeaheadListboxMenuSlotProps & TypeaheadDialogMenuSlotProps) => unknown
}
