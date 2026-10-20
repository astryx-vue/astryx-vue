import type { CSSProperties, VNode, VNodeChild } from 'vue'
import type { SectionVariant } from '../Section/types.js'
import type { ToolbarSize } from '../Toolbar/types.js'
import type { TableSelectionState } from './plugins/selection.js'

export type TableDensity = 'compact' | 'balanced' | 'spacious'
export type TableDividers = 'rows' | 'columns' | 'grid' | 'none'
export type TableTextOverflow = 'wrap' | 'truncate'
export type TableVerticalAlign = 'top' | 'middle' | 'bottom'
export type TableColumnAlign = 'start' | 'center' | 'end'
export type TableSortDirection = 'ascending' | 'descending'

export interface ProportionalWidth {
  type: 'proportional'
  value: number
  minWidth?: number
}

export interface PixelWidth {
  type: 'pixel'
  value: number
}

export type ColumnWidth = ProportionalWidth | PixelWidth

export interface TableSortEntry<TSortKey extends string = string> {
  sortKey: TSortKey
  direction: TableSortDirection
}

export type TableSortState<TSortKey extends string = string> = TableSortEntry<TSortKey>[]

export interface TableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
  key: string
  header?: string
  width?: ColumnWidth
  align?: TableColumnAlign
  verticalAlign?: TableVerticalAlign
  sortable?: boolean | { sortKey?: string, compare?: (a: T, b: T) => number }
  /** Field key used by the filtering plugin. */
  filter?: string
  /** 表头只留给读屏，视觉上留空。 */
  headerHidden?: boolean
  /** 为 false 时，列宽拖动不给这一列画把手。 */
  resizable?: boolean
  renderCell?: (item: T, index: number) => VNodeChild
}

/**
 * 过滤控件的输入类型。
 * - `string`：文本，匹配子串。
 * - `enum`：单选，命中其中一个选项。
 * - `multi-select`：多选，命中其中任意一个选项。
 * - `number`：数字，数值相等才算命中。
 * - `date`：日期，单元格日期晚于选中日期才算命中。
 */
export type TableFilterFieldType = 'string' | 'enum' | 'multi-select' | 'number' | 'date'

export interface TableFilterField {
  key: string
  label: string
  type: TableFilterFieldType
  /** `enum` 和 `multi-select` 的选项。 */
  options?: readonly { value: string, label: string }[]
  /** `number` 字段允许的最小值。 */
  min?: number
  /** `number` 字段允许的最大值。 */
  max?: number
  /** `number` 字段的步进。`isIntegerOnly` 为真时默认 1。 */
  step?: number
  /** `number` 字段只接受整数。 */
  isIntegerOnly?: boolean
}

/** 过滤值。`number` 字段存数字，`multi-select` 存字符串数组，其余存字符串。 */
export type TableFilterValue = string | number | string[]
export type TableFilterState = Record<string, TableFilterValue>

export interface TableSortContribution {
  direction: TableSortDirection | null
  rank: number | null
  label: string
  onClick: (event: MouseEvent) => void
}

/** 过滤控件的摆放方式。`inline-compact` 和 `inline` 同位置，但控件更紧凑。 */
export type TableFilterVariant = 'inline' | 'inline-compact' | 'popover'

export interface TableFilterContribution {
  variant: TableFilterVariant
  field: TableFilterField
  value: TableFilterValue | null
  onChange: (value: TableFilterValue | null) => void
}

export interface TableSelectionContribution<T> {
  isAllSelected: () => boolean
  isIndeterminate: () => boolean
  isSelected: (row: T) => boolean
  isSelectable?: (row: T) => boolean
  /** 为 false 时这一行的复选框渲染成禁用状态。 */
  isEnabled?: (row: T) => boolean
  selectAll: (selected: boolean) => void
  selectRow: (row: T, selected: boolean) => void
  rowLabel?: (row: T) => string
  hasRowHighlight?: boolean
}

export interface TableRowMenuItem {
  id: string
  label: string
  icon?: string
  onSelect: () => void
}

export interface TableGroupPatch {
  groupKey: string
  count: number
  collapsed: boolean
  onToggle: () => void
  render?: () => VNodeChild
}

export interface TablePanelPatch {
  variant: 'muted' | 'transparent'
  render: () => VNodeChild
}

export interface TableRowPatch {
  attrs?: Record<string, string | undefined>
  class?: string
  onClick?: (event: MouseEvent) => void
  suppressSelection?: boolean
  skipRowIndex?: boolean
  group?: TableGroupPatch
  panel?: TablePanelPatch
  menu?: readonly TableRowMenuItem[]
}

export interface TableCellPatch {
  class?: string
  style?: CSSProperties
  attrs?: Record<string, string | undefined>
}

export interface TableCellPatchInput<T extends Record<string, unknown>> {
  column: TableColumn<T>
  columns: readonly TableColumn<T>[]
  row: T | null
  kind: 'header' | 'body'
}

export interface TableHeaderPatch {
  before?: () => VNodeChild
}

/**
 * 一列参与拖动改宽的方式。`Table` 用它画把手的无障碍属性，并在拖动时算出每一列的新宽度。
 */
export interface TableColumnResizeContribution {
  /** 当前生效的像素宽度。没被拖过时是 `undefined`，按 DOM 实际宽度算。 */
  currentWidth?: number
  /** 这一列能拖到的最窄像素。 */
  minWidth: number
  /** 这一列能拖到的最宽像素。 */
  maxWidth: number
  /** 拖动时把宽度让给这一列的相邻列 key；`null` 表示这一列自己伸缩。 */
  neighborKey: string | null
  /** 是否画把手。最后一列按比例伸缩时不画。 */
  hasHandle: boolean
}

export interface TablePlugin<T extends Record<string, unknown> = Record<string, unknown>> {
  transformColumns?: (columns: TableColumn<T>[]) => TableColumn<T>[]
  sortFor?: (column: TableColumn<T>) => TableSortContribution | null
  filterFor?: (column: TableColumn<T>) => TableFilterContribution | null
  selection?: TableSelectionContribution<T>
  widthFor?: (column: TableColumn<T>) => number | undefined
  /**
   * 一列怎么参与拖动改宽。`columns` 是当前表格里的全部列，用来找相邻列和最后一列。
   * 返回 `null` 的列不参与。
   */
  resizeFor?: (column: TableColumn<T>, columns: readonly TableColumn<T>[]) => TableColumnResizeContribution | null
  /** 一次调整结束时调用（松开指针，或按方向键 / Home / End），带上所有宽度变了的列。 */
  onColumnResizeEnd?: (updates: Record<string, number>) => void
  /** 渲染在表格上方的内容，分页这类插件用。 */
  above?: () => VNodeChild
  below?: () => VNodeChild
  /** 改一行的属性、点击、分组头或展开面板。多个插件的结果会合并。 */
  rowPatch?: (row: T, index: number, columnCount: number) => TableRowPatch | null
  /** 改表头或单元格的定位与类名。选择列的 key 是 `__select`。 */
  cellPatch?: (input: TableCellPatchInput<T>) => TableCellPatch | null
  /** 在列表头文字前面加控件，例如树的全部展开。 */
  headerPatch?: (column: TableColumn<T>) => TableHeaderPatch | null
  /** 表格滚动容器挂上或卸下时调用，用来画固定列的滚动阴影。 */
  bindScrollRoot?: (element: HTMLElement | null) => void
}

export interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data?: readonly T[]
  columns?: readonly TableColumn<T>[]
  idKey?: string | ((item: T) => string)
  /**
   * 窗口里第一行数据的行号，从 1 计。
   * 和 `rowCount` 任一设置后，数据行带 `aria-rowindex`。分组头和展开面板不计。
   */
  rowIndexStart?: number
  /**
   * 完整结果集的行数，含当前窗口以外的行。
   * 设置后表格带 `aria-rowcount`。只设置了 `rowIndexStart` 时，行数为未知（-1）。
   */
  rowCount?: number
  density?: TableDensity
  dividers?: TableDividers
  isStriped?: boolean
  hasHover?: boolean
  verticalAlign?: TableVerticalAlign
  textOverflow?: TableTextOverflow
  plugins?: Record<string, TablePlugin<T> | undefined>
  label?: string
}

export interface TableSlots {
  default?: () => VNode[]
  empty?: () => VNode[]
}

export interface TableSectionProps {
  children?: never
}

export interface TableRowProps {
  isHeaderRow?: boolean
}

export interface TableCellProps {
  align?: TableColumnAlign
  colSpan?: number
  rowSpan?: number
  headers?: string
}

export interface TableSelectionToolbarProps {
  /**
   * 选中的行数。`selection` 没给时用它。
   * @default 0
   */
  count?: number
  /**
   * `useTableSelectionState` 返回的 `selectionState`。给了就代替 `count`，
   * 并且一个都没选中时整条不渲染。
   */
  selection?: TableSelectionState
  /**
   * 工具栏的无障碍名称。不传用内置文案。
   */
  label?: string
  /**
   * 清空按钮的文字。不传用内置文案。
   */
  clearLabel?: string
  /**
   * 高度档，同时决定清空按钮的高度。
   * @default 'sm'
   */
  size?: ToolbarSize
  /**
   * 底色。`section` 用表面色，`muted` 用弱化底，`transparent` 不铺底。
   * @default 'muted'
   */
  variant?: SectionVariant
}

export interface TableSelectionToolbarSlots {
  /** 产品自己的操作按钮，排在逻辑起点。 */
  start?: () => VNodeChild
  /** 计数文字的替代渲染，参数里带 `count`。 */
  label?: (props: { count: number }) => VNodeChild
  /** `start` 的旧写法，两者都没给时不用。 */
  default?: () => VNodeChild
}
