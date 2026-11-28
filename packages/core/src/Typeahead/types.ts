import type { Component, HTMLAttributes, StyleValue } from 'vue'
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { InputStatusVariant } from '../composables/useInputStatusIcon.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'

export type TypeaheadSize = 'sm' | 'md' | 'lg'

/**
 * 菜单里放什么。Astryx 管菜单这一层：位置、点外面关闭、Escape、焦点回收、和输入框的 ARIA 关联，
 * 调用方只负责填内容。
 *
 * - `listbox`：结果列表，焦点留在输入框。`menu` 插槽可以在列表周围放信息（标题、提示）；
 *   要点的东西都应该做成列表里的一个结果，这样方向键才够得到。
 * - `dialog`：会拿走焦点的内容，由 `label` 命名。只能通过 `open()` 打开：输入、聚焦、方向键都不会打开它。
 *   从 `listbox` 换成 `dialog` 时，菜单挂在同一个锚点上保持打开。
 */
export type TypeaheadMenuConfig
  = | { role: 'listbox' }
    | { role: 'dialog', label: string }

/** `menu` 插槽（listbox 角色）拿到的东西。 */
export interface TypeaheadListboxMenuSlotProps {
  /** 结果列表。只渲染一次，方向键在它里面移动：`<component :is="listbox" />`。 */
  listbox: Component
  /** 输入框里的查询。 */
  query: string
  /** 搜索或聚焦清单正在加载。 */
  isBusy: boolean
  /** 这次查询搜完了，没有结果。 */
  isEmptySearch: boolean
  /** 关闭菜单。 */
  close: () => void
}

/** `menu` 插槽（dialog 角色）拿到的东西。 */
export interface TypeaheadDialogMenuSlotProps {
  query: string
  /** 关闭菜单，并把焦点还给打开它时的元素。 */
  close: () => void
}

/** 组件实例上暴露的方法，用模板 ref 调用。 */
export interface TypeaheadHandle {
  /**
   * 打开菜单。dialog 角色马上打开；listbox 角色显示结果，需要时先加载。
   * 在 `change` 里调用，菜单会在这次选择之后保持打开。
   */
  open: () => void
  /** 关闭菜单。 */
  close: () => void
}
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
  /** 字段标签的 id。有值时，值 Token 的按钮用它加上值本身命名。 */
  labelId?: string
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
  /** 状态说明。和 `status` 一起决定输入框末尾的状态图标。 */
  statusMessage?: string
  /**
   * 状态相对输入框怎么摆：`attached` 框里画图标、说明在下面，`detached` 只画下面的说明，
   * `tooltip` 框里画一个能聚焦的图标按钮，说明收在它的提示里。
   * @default 'attached'
   */
  statusVariant?: InputStatusVariant
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
  /** 加到输入外框上，不落到原生 input。 */
  controlClass?: HTMLAttributes['class']
  controlStyle?: StyleValue
  /** 菜单里放什么，默认是结果列表。见 {@link TypeaheadMenuConfig}。 */
  menu?: TypeaheadMenuConfig
}

export interface TypeaheadProps<T extends SearchableItem = SearchableItem> extends FieldPartStylingProps {
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
  /**
   * 状态相对输入框怎么摆：`attached` 框里画图标、说明在下面，`detached` 只画下面的说明，
   * `tooltip` 框里画一个能聚焦的图标按钮，说明收在它的提示里。
   * @default 'attached'
   */
  statusVariant?: InputStatusVariant
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
  /** 输入框起始侧的图标。没有 icon 插槽时使用。 */
  startIcon?: unknown
  /** 菜单里放什么，默认是结果列表。见 {@link TypeaheadMenuConfig}。 */
  menu?: TypeaheadMenuConfig
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
  /** 菜单内容：listbox 角色在结果列表周围放信息，dialog 角色是菜单的全部内容。 */
  menu?: (props: TypeaheadListboxMenuSlotProps & TypeaheadDialogMenuSlotProps) => unknown
}
