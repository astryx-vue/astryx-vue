import type { ComputedRef, CSSProperties } from 'vue'
import type { ListWindowGeometry } from '../../../composables/internal/listWindow/listWindowGeometry.js'
import type { TableColumn, TablePlugin } from '../../types.js'
import type { TableColumnWindow } from './useTableColumnWindow.js'
import type { TableRowWindow } from './useTableRowWindow.js'
import { computed } from 'vue'
import { useListWindowGeometry } from '../../../composables/internal/listWindow/listWindowGeometry.js'
import { pixel, resolveColumnFloorWidths, resolveTableMinWidth } from '../../columnUtils.js'
import { isFixedHeightColumn, resolveTableIdentity, sharedFallbackReason } from './admission.js'
import { useTableColumnWindow } from './useTableColumnWindow.js'
import { useTableRowWindow } from './useTableRowWindow.js'

type Row = Record<string, unknown>

/** 表体里的一项：一行数据（按数据下标），或者撑住没挂载那几行的占位行。 */
export type TableRowSlot
  = | { kind: 'row', index: number }
    | { kind: 'gap', key: string, height: number }

/** 一行里的一格：选择列、数据列（`position` 是整表列位置），或者撑住没挂载那几列的占位格。 */
export type TableColumnSlot
  = | { kind: 'select', key: string, position: number }
    | { kind: 'column', key: string, column: TableColumn, position: number }
    | { kind: 'gap', key: string, width: number }

export interface UseTableWindowingOptions {
  rows: () => readonly Row[]
  plugins: () => readonly TablePlugin[]
  idKey: () => string | ((row: Row) => string)
  /** 调用方写的 `textOverflow`，没写时为 `undefined`。 */
  textOverflow: () => string | undefined
  rowIndexStart: () => number | undefined
  rowCount: () => number | undefined
  /** 整张表的列，含选择列。 */
  layoutColumns: () => readonly TableColumn[]
  hasSelection: () => boolean
  /** 插件（例如拖动改宽）给这一列定的像素宽度。 */
  widthOverride: (column: TableColumn) => number | undefined
  /** 调用方在样式里写的最小宽度。 */
  consumerMinWidth: () => CSSProperties['minWidth']
  viewport: () => HTMLElement | null
  table: () => HTMLTableElement | null
  body: () => HTMLTableSectionElement | null
}

export interface TableWindowing {
  textOverflow: ComputedRef<string>
  /** 行窗口化放行：滚动区在块方向上也滚动，并占满父元素给的高度。 */
  hasBlockViewport: ComputedRef<boolean>
  rows: TableRowWindow
  columns: TableColumnWindow
  rowSlots: ComputedRef<TableRowSlot[]>
  columnSlots: ComputedRef<TableColumnSlot[]>
  /** 一行实际渲染的格子数，整行格子（空状态、占位行）用它跨列。 */
  cellCount: ComputedRef<number>
  /** 列窗口化时，挂载的列按最小宽度下的像素定宽：百分比会按占位格算错。 */
  widthStyle: (position: number) => CSSProperties | undefined
  tableAttrs: ComputedRef<Record<string, string | number | undefined>>
  headerRowIndex: ComputedRef<number | undefined>
  /** 行窗口化时一行的 `aria-rowindex`（表头算第 1 行）。 */
  rowAriaIndex: (index: number) => number | undefined
  colAriaIndex: (position: number) => number | undefined
  onRowFocusin: (index: number) => void
  onRowFocusout: (event: FocusEvent) => void
}

/** 行、列两个窗口化插件接进数据表格：放行条件、几何来源、要渲染的行和格子，以及无障碍位置。 */
export function useTableWindowing(options: UseTableWindowingOptions): TableWindowing {
  const contributions = computed(() => options.plugins().map(plugin => plugin.virtualization).filter(item => item != null))
  const rowsConfig = computed(() => contributions.value.find(item => item.rows)?.rows?.())
  const columnsConfig = computed(() => contributions.value.find(item => item.columns)?.columns?.())
  const identity = computed(() => resolveTableIdentity(options.rows(), options.idKey()))
  const hasFixedHeightColumns = computed(() => options.layoutColumns().every(isFixedHeightColumn))
  const shared = computed(() => sharedFallbackReason({
    plugins: options.plugins(),
    identity: identity.value,
    textOverflow: options.textOverflow(),
  }) ?? (hasFixedHeightColumns.value ? undefined : 'a custom cell renderer has no fixed-height admission'))

  const sizedColumns = computed(() => options.layoutColumns().map((column) => {
    const override = options.widthOverride(column)
    return override == null ? column : { ...column, width: pixel(override) }
  }))
  const pitches = computed(() => {
    const floors = resolveColumnFloorWidths(sizedColumns.value)
    return sizedColumns.value.map(column => floors.get(column.key) ?? 0)
  })
  const floorMinWidth = computed(() => pitches.value.reduce((sum, width) => sum + width, 0))
  const columnKeys = computed(() => sizedColumns.value.map(column => column.key))
  const pinned = computed(() => {
    const keys = columnKeys.value
    let startCount = 0
    let endCount = 0
    for (const plugin of options.plugins()) {
      const runs = plugin.pinnedColumns?.()
      if (runs == null)
        continue
      const lastStart = keys.reduce((last, key, index) => (runs.startKeys.includes(key) ? index : last), -1)
      const firstEnd = keys.findIndex(key => runs.endKeys.includes(key))
      startCount = Math.max(startCount, lastStart + 1)
      endCount = Math.max(endCount, firstEnd === -1 ? 0 : keys.length - firstEnd)
    }
    return { startCount, endCount }
  })

  // 有窗口化插件就量几何：滚动监听和 ResizeObserver 都很便宜，放行与否由两个方向各自决定。
  const geometry = useListWindowGeometry({
    viewport: options.viewport,
    start: options.body,
    isActive: () => rowsConfig.value != null || columnsConfig.value != null,
  })
  const readGeometry = (): ListWindowGeometry => geometry.snapshot.value

  const rows = useTableRowWindow({
    config: () => rowsConfig.value,
    keys: () => identity.value.keys,
    fallbackReason: () => shared.value
      ?? (options.rowIndexStart() != null || options.rowCount() != null
        ? 'rowIndexStart and rowCount conflict with windowed row positions'
        : undefined),
    geometry: readGeometry,
    viewport: options.viewport,
    body: options.body,
  })
  const columns = useTableColumnWindow({
    config: () => columnsConfig.value,
    keys: () => columnKeys.value,
    widths: () => pitches.value,
    pinned: () => pinned.value,
    fallbackReason: () => shared.value
      ?? (resolveTableMinWidth(options.consumerMinWidth(), floorMinWidth.value) !== `${floorMinWidth.value}px`
        ? 'a table min-width wider than the column floors changes the column widths'
        : undefined),
    geometry: readGeometry,
    viewport: options.viewport,
    table: options.table,
  })
  // 窗口化让内容在任何宽度下都保持一行，表格跨过最小宽度时行高不变。
  const textOverflow = computed(() => options.textOverflow()
    ?? (rows.isWindowed.value || columnsConfig.value != null ? 'truncate' : 'wrap'))

  const rowSlots = computed<TableRowSlot[]>(() => {
    const count = options.rows().length
    if (!rows.isWindowed.value)
      return Array.from({ length: count }, (_, index) => ({ kind: 'row', index }))
    return rows.segments.value.flatMap<TableRowSlot>(segment => segment.type === 'gap'
      ? [{ kind: 'gap', key: `\u0000gap:${segment.start}:${segment.end}`, height: segment.height }]
      : Array.from({ length: segment.end - segment.start }, (_, offset) => ({ kind: 'row', index: segment.start + offset })))
  })

  const columnSlots = computed<TableColumnSlot[]>(() => {
    const layout = options.layoutColumns()
    const hasSelection = options.hasSelection()
    const slotAt = (position: number): TableColumnSlot => (hasSelection && position === 0
      ? { kind: 'select', key: '\u0000select', position }
      : { kind: 'column', key: layout[position]!.key, column: layout[position]!, position })
    return columns.segments.value.flatMap<TableColumnSlot>(segment => segment.type === 'gap'
      ? [{ kind: 'gap', key: `\u0000gap:${segment.start}`, width: segment.width }]
      : Array.from({ length: segment.end - segment.start }, (_, offset) => slotAt(segment.start + offset)))
  })
  const cellCount = computed(() => Math.max(1, columnSlots.value.length))

  const hasMoreRows = computed(() => options.plugins().some(plugin => plugin.loadingState?.().hasMore === true))
  const tableAttrs = computed(() => ({
    'aria-rowcount': rows.isWindowed.value
      ? (hasMoreRows.value ? -1 : 1 + options.rows().length)
      : options.rowCount() != null || options.rowIndexStart() != null ? String(options.rowCount() ?? -1) : undefined,
    'aria-colcount': columns.isWindowed.value ? options.layoutColumns().length : undefined,
    'data-windowed': rows.isWindowed.value || columns.isWindowed.value ? '' : undefined,
  }))

  function widthStyle(position: number): CSSProperties | undefined {
    if (!columns.isWindowed.value)
      return undefined
    const width = `${pitches.value[position] ?? 0}px`
    return { width, minWidth: width, maxWidth: width }
  }

  return {
    textOverflow,
    hasBlockViewport: rows.isActive,
    rows,
    columns,
    rowSlots,
    columnSlots,
    cellCount,
    widthStyle,
    tableAttrs,
    headerRowIndex: computed(() => (rows.isWindowed.value ? 1 : undefined)),
    rowAriaIndex: index => (rows.isWindowed.value ? index + 2 : undefined),
    colAriaIndex: position => (columns.isWindowed.value ? position + 1 : undefined),
    onRowFocusin(index) {
      const key = identity.value.keys[index]
      if (rows.isWindowed.value && key !== undefined)
        rows.onRowFocus(key)
    },
    onRowFocusout(event) {
      if (!rows.isWindowed.value)
        return
      const row = event.currentTarget as HTMLElement
      const next = event.relatedTarget
      const leavesDocument = next == null && !row.ownerDocument.hasFocus()
      if (!leavesDocument && !(next instanceof Node && row.contains(next)))
        rows.onRowBlur()
    },
  }
}
