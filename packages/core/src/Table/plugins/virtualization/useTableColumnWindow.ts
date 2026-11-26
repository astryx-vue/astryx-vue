import type { ComputedRef } from 'vue'
import type { ListWindowGeometry } from '../../../composables/internal/listWindow/listWindowGeometry.js'
import type { TableVirtualizationContribution } from '../../types.js'
import { computed, watch } from 'vue'
import { isPositiveFinite } from '../../../composables/internal/listWindow/listWindow.js'
import { useInlineListWindow } from '../../../composables/internal/listWindow/useInlineListWindow.js'
import { devWarn } from '../../../composables/useDevWarning.js'

type ColumnsConfig = ReturnType<NonNullable<TableVirtualizationContribution['columns']>>

/** 列窗口化的段，下标是整张表里的列位置（含选择列）。 */
export type TableColumnSegment
  = | { type: 'columns', start: number, end: number }
    | { type: 'gap', start: number, end: number, width: number }

export interface UseTableColumnWindowOptions {
  config: () => ColumnsConfig | undefined
  /** 每一列的键，按整张表的顺序。 */
  keys: () => readonly string[]
  /** 每一列在表格最小宽度下的像素宽度，和 `keys` 一一对应。 */
  widths: () => readonly number[]
  /** 固定在起点、终点的列数。 */
  pinned: () => { startCount: number, endCount: number }
  fallbackReason: () => string | undefined
  geometry: () => ListWindowGeometry
  viewport: () => HTMLElement | null
  table: () => HTMLTableElement | null
}

export interface TableColumnWindow {
  isActive: ComputedRef<boolean>
  /** 至少有一列没挂载。 */
  isWindowed: ComputedRef<boolean>
  segments: ComputedRef<TableColumnSegment[]>
  onFocusin: (event: FocusEvent) => void
  onFocusout: (event: FocusEvent) => void
}

const OVERSCAN = 2

/** 事件目标所在格子的整表列位置。占位格没有列。 */
export function cellColumnIndex(table: HTMLTableElement, target: EventTarget | null): number | undefined {
  if (!(target instanceof Element))
    return undefined
  const cell = target.closest('td, th')
  if (cell == null || !table.contains(cell) || cell.getAttribute('aria-hidden') === 'true')
    return undefined
  const position = cell.getAttribute('aria-colindex')
  return position == null ? (cell as HTMLTableCellElement).cellIndex : Number(position) - 1
}

/**
 * 表格接到共用行内窗口上的那一层：固定列一直挂着，只有夹在两段固定列中间的列参与窗口化；
 * 有焦点的格子所在的列滚出视口也继续挂着，直到焦点离开表格或者换到别的格子。
 */
export function useTableColumnWindow(options: UseTableColumnWindowOptions): TableColumnWindow {
  const count = computed(() => options.widths().length)
  const run = computed(() => {
    const { startCount, endCount } = options.pinned()
    const start = Math.min(count.value, Math.max(0, startCount))
    return { start, end: Math.max(start, count.value - Math.max(0, endCount)) }
  })
  const isActive = computed(() => {
    const config = options.config()
    return config != null
      && options.fallbackReason() == null
      && isPositiveFinite(config.initialViewportWidth)
      && run.value.end > run.value.start
      && options.keys().length === count.value
      && options.widths().every(width => Number.isFinite(width) && width >= 0)
  })
  const layout = computed(() => {
    const widths = options.widths()
    const offsets = [0]
    for (let index = run.value.start; index < run.value.end; index += 1)
      offsets.push(offsets.at(-1)! + (widths[index] ?? 0))
    let pinnedStart = 0
    for (let index = 0; index < run.value.start; index += 1)
      pinnedStart += widths[index] ?? 0
    let pinnedEnd = 0
    for (let index = run.value.end; index < count.value; index += 1)
      pinnedEnd += widths[index] ?? 0
    return { offsets, pinnedStart, pinnedEnd }
  })
  const runKeys = computed(() => options.keys().slice(run.value.start, run.value.end))

  const window = useInlineListWindow({
    keys: () => runKeys.value,
    offsets: () => layout.value.offsets,
    insetStart: () => layout.value.pinnedStart,
    insetEnd: () => layout.value.pinnedEnd,
    initialViewportWidth: () => options.config()?.initialViewportWidth ?? 0,
    overscan: OVERSCAN,
    canWindow: () => isActive.value,
    geometry: options.geometry,
    viewport: options.viewport,
  })

  watch(() => (options.config() == null ? undefined : options.fallbackReason()), (reason) => {
    if (reason != null)
      devWarn('Table', `Column windowing disabled: ${reason}. Rendering every column.`)
  }, { immediate: true })

  const segments = computed<TableColumnSegment[]>(() => {
    if (!window.isWindowed.value)
      return count.value === 0 ? [] : [{ type: 'columns', start: 0, end: count.value }]
    const { start, end } = run.value
    const next: TableColumnSegment[] = []
    if (start > 0)
      next.push({ type: 'columns', start: 0, end: start })
    for (const segment of window.segments.value) {
      next.push(segment.type === 'gap'
        ? { type: 'gap', start: start + segment.start, end: start + segment.end, width: segment.height }
        : { type: 'columns', start: start + segment.start, end: start + segment.end })
    }
    if (end < count.value)
      next.push({ type: 'columns', start: end, end: count.value })
    return next
  })

  function onFocusin(event: FocusEvent): void {
    const table = options.table()
    if (!isActive.value || table == null)
      return
    const index = cellColumnIndex(table, event.target)
    if (index === undefined)
      return
    const key = options.keys()[index]
    if (key !== undefined && index >= run.value.start && index < run.value.end)
      window.onItemFocus(key)
    else
      window.onItemBlur()
  }

  function onFocusout(event: FocusEvent): void {
    const table = options.table()
    if (!isActive.value || table == null)
      return
    const next = event.relatedTarget
    // 切到别的窗口或标签页：焦点回来时还在原处，列继续留着。
    const leavesDocument = next == null && !table.ownerDocument.hasFocus()
    if (!leavesDocument && !(next instanceof Node && table.contains(next)))
      window.onItemBlur()
  }

  return { isActive, isWindowed: window.isWindowed, segments, onFocusin, onFocusout }
}
