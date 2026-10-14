import type { CSSProperties, VNode, VNodeChild } from 'vue'

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

export interface TableFilterField {
  key: string
  label: string
  type: 'string' | 'enum'
  options?: readonly { value: string, label: string }[]
}

export type TableFilterValue = string | string[]
export type TableFilterState = Record<string, TableFilterValue>

export interface TableSortContribution {
  direction: TableSortDirection | null
  rank: number | null
  label: string
  onClick: (event: MouseEvent) => void
}

export interface TableFilterContribution {
  variant: 'inline' | 'popover'
  field: TableFilterField
  value: TableFilterValue | null
  onChange: (value: TableFilterValue | null) => void
}

export interface TableSelectionContribution<T> {
  isAllSelected: () => boolean
  isIndeterminate: () => boolean
  isSelected: (row: T) => boolean
  isSelectable?: (row: T) => boolean
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

export interface TablePlugin<T extends Record<string, unknown> = Record<string, unknown>> {
  transformColumns?: (columns: TableColumn<T>[]) => TableColumn<T>[]
  sortFor?: (column: TableColumn<T>) => TableSortContribution | null
  filterFor?: (column: TableColumn<T>) => TableFilterContribution | null
  selection?: TableSelectionContribution<T>
  widthFor?: (column: TableColumn<T>) => number | undefined
  onColumnResizeEnd?: (key: string, width: number) => void
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
