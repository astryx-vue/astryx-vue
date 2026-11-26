import type { ComputedRef, CSSProperties } from 'vue'
import type {
  TableCellPatch,
  TableColumn,
  TableColumnResizeContribution,
  TableFilterContribution,
  TablePlugin,
  TableSelectionContribution,
  TableSortContribution,
} from './types.js'
import { computed } from 'vue'
import { pixel, resolveColumnWidths } from './columnUtils.js'
import { selectColumn } from './plugins/stickyColumns.js'

type Row = Record<string, unknown>

export interface TableDataModel {
  resolvedColumns: ComputedRef<TableColumn[]>
  layoutColumns: ComputedRef<TableColumn[]>
  selection: ComputedRef<TableSelectionContribution<Row> | undefined>
  widths: ComputedRef<ReturnType<typeof resolveColumnWidths>>
  resizeContributions: ComputedRef<Map<string, TableColumnResizeContribution | null>>
  sortFor: (column: TableColumn) => TableSortContribution | null
  filterAt: (column: TableColumn, place: 'line' | 'below') => TableFilterContribution | null
  mergeCell: (column: TableColumn, row: Row | null, kind: 'header' | 'body') => TableCellPatch
  headerStyle: (column: TableColumn) => CSSProperties
  bodyStyle: (column: TableColumn, row: Row) => CSSProperties
  selectCellPatch: (kind: 'header' | 'body', row: Row | null) => TableCellPatch
}

/**
 * 数据模式表格的列与单元格模型：插件改过的列、列宽、拖动改宽、排序和筛选的贡献，
 * 以及每个格子叠加插件补丁后的类名、样式和属性。模板只管把它们画出来。
 */
export function useTableDataModel(options: {
  columns: () => readonly TableColumn[]
  plugins: () => readonly TablePlugin[]
}): TableDataModel {
  const resolvedColumns = computed(() => options.plugins().reduce(
    (columns, plugin) => plugin.transformColumns?.(columns) ?? columns,
    [...options.columns()],
  ))

  const selection = computed(() => options.plugins().find(plugin => plugin.selection)?.selection)

  /**
   * 选择列的宽度可以被插件的 `widthFor` 改（原版靠 `transformColumns` 改选择列宽）。
   * 它和别的列一起进 `resolveColumnWidths`，所以表头、数据格和表格最小宽度读到同一个值。
   */
  const selectionColumn = computed(() => {
    const base = selectColumn()
    const override = options.plugins().map(plugin => plugin.widthFor?.(base)).find(value => value != null)
    return override == null ? base : { ...base, width: pixel(override) }
  })
  const layoutColumns = computed(() => selection.value
    ? [selectionColumn.value, ...resolvedColumns.value]
    : resolvedColumns.value)
  // 原版把选择列（fixed pixel 宽）也算进 tableMinWidth，比例列分到的下限才不被它挤占。
  const widths = computed(() => resolveColumnWidths(layoutColumns.value))
  const canResize = computed(() => options.plugins().some(plugin => plugin.onColumnResizeEnd))

  /**
   * 一列参与拖动改宽的方式。第一个给出结果的插件说了算。
   * 只实现了 `onColumnResizeEnd` 的老插件仍然拿到一个最朴素的把手：只管自己这一列，最窄 60px。
   */
  function resizeContribution(column: TableColumn): TableColumnResizeContribution | null {
    for (const plugin of options.plugins()) {
      const contribution = plugin.resizeFor?.(column, resolvedColumns.value)
      if (contribution != null)
        return contribution
    }
    if (!canResize.value || column.resizable === false)
      return null
    return { minWidth: 60, maxWidth: Number.POSITIVE_INFINITY, neighborKey: null, hasHandle: true }
  }

  const resizeContributions = computed(() => new Map(
    resolvedColumns.value.map(column => [column.key, resizeContribution(column)]),
  ))

  function styleFor(column: TableColumn): CSSProperties {
    const base = { ...(widths.value.columns.get(column.key)?.style ?? {}) }
    const override = options.plugins().map(plugin => plugin.widthFor?.(column)).find(value => value != null)
      ?? resizeContributions.value.get(column.key)?.currentWidth
    if (override != null) {
      base.width = `${override}px`
      base.minWidth = `${override}px`
    }
    return base
  }

  function sortFor(column: TableColumn): TableSortContribution | null {
    for (const plugin of options.plugins()) {
      const sort = plugin.sortFor?.(column)
      if (sort)
        return sort
    }
    return null
  }

  function filterFor(column: TableColumn): TableFilterContribution | null {
    for (const plugin of options.plugins()) {
      const filter = plugin.filterFor?.(column)
      if (filter)
        return filter
    }
    return null
  }

  const filterContributions = computed(() => new Map(
    resolvedColumns.value.map(column => [column.key, filterFor(column)]),
  ))

  /**
   * 取某一列落在指定位置的筛选控件。
   * `popover` 是一个漏斗按钮，跟标题、排序图标同一行；`inline` 系列是输入框，垫在标题下面。
   */
  function filterAt(column: TableColumn, place: 'line' | 'below'): TableFilterContribution | null {
    const filter = filterContributions.value.get(column.key) ?? null
    if (filter == null)
      return null
    return (filter.variant === 'popover' ? 'line' : 'below') === place ? filter : null
  }

  function mergeCell(column: TableColumn, row: Row | null, kind: 'header' | 'body'): TableCellPatch {
    const style: CSSProperties = {}
    const classes: string[] = []
    const attrs: Record<string, string | undefined> = {}
    for (const plugin of options.plugins()) {
      const patch = plugin.cellPatch?.({ column, columns: layoutColumns.value, row, kind })
      if (patch == null)
        continue
      if (patch.class)
        classes.push(patch.class)
      if (patch.style)
        Object.assign(style, patch.style)
      if (patch.attrs)
        Object.assign(attrs, patch.attrs)
    }
    return { class: classes.join(' ') || undefined, style, attrs }
  }

  function headerStyle(column: TableColumn): CSSProperties {
    return { ...styleFor(column), ...mergeCell(column, null, 'header').style }
  }

  function bodyStyle(column: TableColumn, row: Row): CSSProperties {
    const style: CSSProperties = { ...mergeCell(column, row, 'body').style }
    if (column.verticalAlign)
      style.verticalAlign = column.verticalAlign
    return style
  }

  /** 选择列的格子：宽度来自布局里的选择列，再叠加插件的补丁。 */
  function selectCellPatch(kind: 'header' | 'body', row: Row | null): TableCellPatch {
    const patch = mergeCell(selectionColumn.value, row, kind)
    const width = widths.value.columns.get(selectionColumn.value.key)?.style.width
    return { ...patch, style: { width, minWidth: width, maxWidth: width, ...patch.style } }
  }

  return {
    resolvedColumns,
    layoutColumns,
    selection,
    widths,
    resizeContributions,
    sortFor,
    filterAt,
    mergeCell,
    headerStyle,
    bodyStyle,
    selectCellPatch,
  }
}
