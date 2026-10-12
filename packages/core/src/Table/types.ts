import type { VNode, VNodeChild } from 'vue'

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

export interface TablePlugin<T extends Record<string, unknown> = Record<string, unknown>> {
  transformColumns?: (columns: TableColumn<T>[]) => TableColumn<T>[]
  sortFor?: (column: TableColumn<T>) => TableSortContribution | null
  filterFor?: (column: TableColumn<T>) => TableFilterContribution | null
  selection?: TableSelectionContribution<T>
  widthFor?: (column: TableColumn<T>) => number | undefined
  onColumnResizeEnd?: (key: string, width: number) => void
  below?: () => VNodeChild
}

export interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data?: readonly T[]
  columns?: readonly TableColumn<T>[]
  idKey?: string
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
