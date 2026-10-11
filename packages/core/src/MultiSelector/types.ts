export type MultiSelectorSize = 'sm' | 'md' | 'lg'
export type MultiSelectorVariant = 'input' | 'ghost'
export type MultiSelectorPresentation = 'popover' | 'bottom-sheet'
export type MultiSelectorStatus = 'default' | 'success' | 'warning' | 'error'
export type MultiSelectorTriggerDisplay = 'count' | 'labels' | 'badges'
export type MultiSelectorCheckboxPosition = 'start' | 'end'

export interface MultiSelectorOptionData {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

export interface MultiSelectorDivider {
  type: 'divider'
}

export interface MultiSelectorSection {
  type: 'section'
  label: string
  options: readonly (string | MultiSelectorOptionData)[]
}

export type MultiSelectorOption = string | MultiSelectorOptionData | MultiSelectorDivider | MultiSelectorSection

export interface MultiSelectorProps {
  modelValue?: readonly (string | number)[]
  options: readonly MultiSelectorOption[]
  label: string
  labelHidden?: boolean
  description?: string
  placeholder?: string
  disabled?: boolean
  disabledReason?: string
  status?: MultiSelectorStatus
  statusMessage?: string
  size?: MultiSelectorSize
  /** input 是带边框的表单控件，ghost 适合放在工具栏里。 */
  variant?: MultiSelectorVariant
  /** popover 锚在触发器下，bottom-sheet 在底部弹层里展开。 */
  presentation?: MultiSelectorPresentation
  clearable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  /** 列表顶部的全选行。 */
  selectAll?: boolean
  selectAllLabel?: string
  /**
   * count 显示「已选 N 项」，labels 用逗号拼接，badges 用标签并在放不下时显示 +N。
   */
  triggerDisplay?: MultiSelectorTriggerDisplay
  /** badges / labels 最多露出几项，更窄时还会按宽度再收。 */
  maxBadges?: number
  checkboxPosition?: MultiSelectorCheckboxPosition
  required?: boolean
  optional?: boolean
  name?: string
  width?: number | string
}

export interface MultiSelectorEmits {
  'update:modelValue': [value: (string | number)[]]
  'change': [value: (string | number)[]]
  'search': [query: string]
  'openChange': [isOpen: boolean]
}

export interface MultiSelectorSlots {
  icon?: () => unknown
  option?: (props: { option: MultiSelectorOptionData, selected: boolean, active: boolean }) => unknown
  empty?: () => unknown
}
