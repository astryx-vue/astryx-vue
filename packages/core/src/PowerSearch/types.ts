import type { Component, VNodeChild } from 'vue'
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'

export interface EmptyOperatorValue {
  readonly type: 'empty'
}

export interface StringOperatorValue {
  readonly type: 'string'
  readonly searchSource?: SearchSource
  readonly isArbitraryStringAllowed?: boolean
}

export interface OperatorTokenizationConfig {
  readonly regex?: string
  readonly sort?: boolean
}

export interface StringListOperatorValue {
  readonly type: 'string_list'
  readonly searchSource?: SearchSource
  readonly isArbitraryStringAllowed?: boolean
  readonly tokenization?: OperatorTokenizationConfig
}

export interface IntegerOperatorValue {
  readonly type: 'integer'
  readonly minValue?: number
  readonly maxValue?: number
  readonly units?: string
}

export interface FloatOperatorValue {
  readonly type: 'float'
  readonly minValue?: number
  readonly maxValue?: number
  readonly units?: string
}

export interface TimeOperatorValue {
  readonly type: 'time'
  readonly minValue?: string
  readonly maxValue?: string
}

export interface DateAbsoluteOperatorValue {
  readonly type: 'date_absolute'
  readonly isDateOnly?: boolean
}

export interface DateRelativeOperatorValue {
  readonly type: 'date_relative'
  readonly isPastAllowed?: boolean
  readonly isFutureAllowed?: boolean
}

export type DateTimeRangePart
  = | { readonly type: 'NOW' }
    | { readonly type: 'ABSOLUTE', readonly unixSeconds: number }
    | {
      readonly type: 'RELATIVE'
      readonly backValue: number
      readonly unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
      readonly anchorKey?: string
    }

export interface DateTimeRange {
  readonly start: DateTimeRangePart
  readonly end: DateTimeRangePart
}

export interface DateRangeFilterPreset {
  readonly label: string
  readonly value: DateTimeRange
}

export interface RelativeDateFilterPreset {
  readonly label: string
  readonly value: string
}

export interface DateRangeOperatorValue {
  readonly type: 'date_range'
  readonly intervalDatePresets?: readonly DateRangeFilterPreset[]
  readonly relativeDatePresets?: readonly RelativeDateFilterPreset[]
}

export interface EnumItem {
  readonly value: string
  readonly label: string
  /** 内置图形名，或 `collection:icon`。 */
  readonly icon?: string
}

export interface EnumOperatorValue {
  readonly type: 'enum'
  readonly values: readonly EnumItem[]
}

export interface EnumListOperatorValue {
  readonly type: 'enum_list'
  readonly values: readonly EnumItem[]
}

export interface EntityListOperatorValue {
  readonly type: 'entity_list'
  readonly searchSource?: SearchSource
  readonly isArbitraryStringAllowed?: boolean
  readonly tokenization?: OperatorTokenizationConfig
}

export interface CustomOperatorValue {
  readonly type: 'custom'
  readonly Editor: Component
  readonly getString: (value: string) => string
}

export interface NestedOperatorValue {
  readonly type: 'nested'
}

export type OperatorValue
  = | EmptyOperatorValue
    | StringOperatorValue
    | StringListOperatorValue
    | IntegerOperatorValue
    | FloatOperatorValue
    | TimeOperatorValue
    | DateAbsoluteOperatorValue
    | DateRelativeOperatorValue
    | DateRangeOperatorValue
    | EnumOperatorValue
    | EnumListOperatorValue
    | EntityListOperatorValue
    | CustomOperatorValue
    | NestedOperatorValue

export interface FilterValueEmpty { readonly type: 'empty' }
export interface FilterValueString { readonly type: 'string', readonly value: string }
export interface FilterValueStringList { readonly type: 'string_list', readonly value: readonly string[] }
export interface FilterValueInteger { readonly type: 'integer', readonly value: number }
export interface FilterValueFloat { readonly type: 'float', readonly value: number }
export interface FilterValueTime { readonly type: 'time', readonly value: string }
export interface FilterValueDateAbsolute { readonly type: 'date_absolute', readonly unixSeconds: number }
export interface FilterValueDateRelative { readonly type: 'date_relative', readonly value: string }
export interface FilterValueDateRange { readonly type: 'date_range', readonly value: DateTimeRange }
export interface FilterValueEnum { readonly type: 'enum', readonly value: string }
export interface FilterValueEnumList { readonly type: 'enum_list', readonly value: readonly string[] }

export interface PowerSearchEntity {
  readonly id: string
  readonly label: string
  readonly photo?: string
}

export interface FilterValueEntityList { readonly type: 'entity_list', readonly value: readonly PowerSearchEntity[] }
export interface FilterValueCustom { readonly type: 'custom', readonly value: string }
export interface FilterValueNested { readonly type: 'nested', readonly value: readonly PowerSearchFilter[] }

export type FilterValue
  = | FilterValueEmpty
    | FilterValueString
    | FilterValueStringList
    | FilterValueInteger
    | FilterValueFloat
    | FilterValueTime
    | FilterValueDateAbsolute
    | FilterValueDateRelative
    | FilterValueDateRange
    | FilterValueEnum
    | FilterValueEnumList
    | FilterValueEntityList
    | FilterValueCustom
    | FilterValueNested

export interface PowerSearchOperatorBase {
  readonly key: string
  readonly value: OperatorValue
}

export interface PowerSearchOperatorWithLabel extends PowerSearchOperatorBase {
  readonly label: string
  readonly i18nKey?: never
}

export interface PowerSearchOperatorWithI18nKey extends PowerSearchOperatorBase {
  readonly i18nKey: string
  readonly label?: never
}

export type PowerSearchOperator = PowerSearchOperatorWithLabel | PowerSearchOperatorWithI18nKey

export interface PowerSearchField {
  readonly key: string
  readonly label: string
  readonly operators: readonly PowerSearchOperator[]
  readonly icon?: string
  readonly defaultOperator?: string
  readonly group?: string
  readonly description?: string
  readonly typeaheadAliases?: readonly string[]
  readonly typeaheadMinQueryLength?: number
  readonly isValueMatchAllowed?: boolean
}

export interface PowerSearchConfig {
  readonly name: string
  readonly fields: readonly PowerSearchField[]
  readonly contentSearchFieldKey?: string
}

export interface PowerSearchFilter {
  readonly field: string
  readonly operator: string
  readonly value: FilterValue
  readonly isReadOnly?: boolean
}

export interface PartialFilter {
  readonly field: string
  readonly operator?: string
  readonly value?: FilterValue
  readonly isReadOnly?: boolean
}

export type PowerSearchChangeType = 'add' | 'edit' | 'remove'

export interface PowerSearchHandle {
  focusTypeahead: () => void
  blurTypeahead: () => void
}

export interface PowerSearchAuxData {
  readonly fieldKey: string
  readonly operatorKey?: string
  readonly filterValue?: FilterValue
  readonly filterIndex?: number
  readonly group?: string
}

export type PowerSearchItem = SearchableItem<PowerSearchAuxData>

export type PowerSearchSize = 'sm' | 'md' | 'lg'
export type PowerSearchStatus = 'default' | 'success' | 'warning' | 'error'
export type PowerSearchStatusVariant = 'attached' | 'detached'
export type PowerSearchOverflow = 'none' | 'unfocused-inline' | 'unfocused-layer'

export interface PowerSearchTokenProps {
  config: PowerSearchConfig
  filter: PowerSearchFilter
  field: PowerSearchField
  operator: PowerSearchOperator
  maxLength: number
  disabled?: boolean
  onClick?: () => void
  onRemove?: () => void
}

export interface PowerSearchEditorProps {
  config: PowerSearchConfig
  filter: PartialFilter
  mode: 'create' | 'edit'
  saveLabel?: string
  readOnly?: boolean
  timeZone?: string
  maxMenuItems?: number
  onSave: (filter: PowerSearchFilter | null) => void
  onCancel: () => void
}

export interface PowerSearchComponentOverride {
  token?: Component
  editor?: Component
}

export type PowerSearchComponents = Partial<Record<OperatorValue['type'], PowerSearchComponentOverride>>

export interface PowerSearchProps extends FieldPartStylingProps {
  config: PowerSearchConfig
  filters?: readonly PowerSearchFilter[]
  label?: string
  /** 视觉上隐藏标签。没传时隐藏。传 false 会把标签显示出来。 */
  isLabelHidden?: boolean
  /** `isLabelHidden` 的旧名。两个都传时听正名。 */
  labelHidden?: boolean
  placeholder?: string
  autofocus?: boolean
  /** 有筛选条件时显示全部清空按钮。默认 true。 */
  hasClear?: boolean
  /** 有筛选条件时显示全部清空按钮。等同于 hasClear。 */
  clearable?: boolean
  readOnly?: boolean
  disabled?: boolean
  /** 为什么禁用。和 `disabled` 一起用时，输入框仍可聚焦，但不能用。 */
  disabledMessage?: string
  /** 禁用原因。等同于 disabledMessage。 */
  disabledReason?: string
  status?: PowerSearchStatus
  statusMessage?: string
  statusVariant?: PowerSearchStatusVariant
  maxTokenLength?: number
  maxOperatorMenuItems?: number
  maxSearchResults?: number
  menuWidth?: number
  /** 筛选编辑器里保存按钮的文字。默认「Apply」。 */
  popoverSaveButtonLabel?: string
  /** 筛选编辑器里保存按钮的文字。等同于 popoverSaveButtonLabel。 */
  saveLabel?: string
  /** 日期类筛选格式化用的时区 ID，例如 `America/New_York`。 */
  timezoneID?: string
  /** 日期类筛选格式化用的时区 ID。等同于 timezoneID。 */
  timeZone?: string
  overflow?: PowerSearchOverflow
  resultCount?: number | string
  size?: PowerSearchSize
  components?: PowerSearchComponents
}

export interface PowerSearchEmits {
  'update:filters': [filters: PowerSearchFilter[]]
  'change': [filters: PowerSearchFilter[], changeType: PowerSearchChangeType, index: number]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface PowerSearchSlots {
  icon?: () => VNodeChild
  /** 输入行末尾的内容，放操作按钮之类的控件。 */
  endContent?: () => VNodeChild
  /** 输入行末尾的内容。等同于 endContent。 */
  end?: () => VNodeChild
  token?: (props: PowerSearchTokenProps) => VNodeChild
  editor?: (props: PowerSearchEditorProps) => VNodeChild
}

export type PowerSearchFieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'enum_list' | 'string_list'

export interface PowerSearchFieldDefinition<K extends string = string, T extends PowerSearchFieldType = PowerSearchFieldType> {
  readonly key: K
  readonly type: T
  readonly label?: string
  readonly enumValues?: readonly EnumItem[]
}
