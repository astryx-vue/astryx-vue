import type { MaybeRefOrGetter } from 'vue'
import type {
  ColumnWidth,
  TableColumn,
  TableColumnResizeContribution,
  TablePlugin,
} from '../types.js'
import { toValue } from 'vue'
import { DEFAULT_FLEXIBLE_COLUMN_MIN_WIDTH, DEFAULT_MIN_COLUMN_WIDTH } from '../columnUtils.js'

export interface UseTableColumnResizeConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  /** 已经提交的像素宽度，键是列 key。有值时覆盖列自己声明的宽度。 */
  columnWidths?: Record<string, number>
  /** 一次调整结束时调用（松开指针，或按方向键 / Home / End），带上所有宽度变了的列。 */
  onColumnResizeEnd?: (updates: Record<string, number>) => void
  /** 全局最窄宽度，覆盖每一列自己的下限。 */
  minWidth?: number
  /** 全局最宽宽度。不传就是不限。 */
  maxWidth?: number
  /** 列定义。表格自己会传，只有单独用这些纯函数时才需要。 */
  columns?: readonly TableColumn<T>[]
}

/** 一列在拖动期间的尺寸快照。 */
export interface ColumnResizeSnapshot {
  key: string
  initialWidth: number
  minWidth: number
  maxWidth: number
}

export interface ColumnResizePlan {
  snapshots: readonly ColumnResizeSnapshot[]
  /** 正在被拖的那一列在 `snapshots` 里的下标。 */
  resizeIndex: number
  /** 让出宽度的相邻列下标；`null` 表示不牵动邻列。 */
  neighborIndex: number | null
  /** 表格当前宽度。大于 0 时最后一列会吃掉剩余空间。 */
  tableWidth: number
}

/** 宽度的类型。没写宽度按比例列处理。 */
export function isProportionalColumnWidth(width: ColumnWidth | undefined): boolean {
  return width == null || width.type === 'proportional'
}

/**
 * 一列能拖到的最窄像素。
 * 全局 `minWidth` 优先，其次列自己声明的下限，再退到默认值：没写宽度 60px，比例列 120px。
 * 固定像素列不能比它声明的宽度更窄。
 */
export function columnResizeMinWidth(width: ColumnWidth | undefined, globalMinWidth?: number): number {
  if (globalMinWidth != null)
    return globalMinWidth
  if (width == null)
    return DEFAULT_FLEXIBLE_COLUMN_MIN_WIDTH
  if (width.type === 'proportional')
    return width.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH
  if (width.type === 'pixel')
    return width.value
  return DEFAULT_FLEXIBLE_COLUMN_MIN_WIDTH
}

/**
 * 按拖动位移算出每一列的新宽度。
 *
 * 有相邻列时两列一增一减，表格总宽不变；没有相邻列时只改这一列，钳在它自己的上下限里。
 * 表格宽度已知时，最后一列总是吃掉剩下的空间，所以表格保持撑满。
 */
export function resizeColumnWidths(plan: ColumnResizePlan, delta: number): number[] {
  const { snapshots, resizeIndex, neighborIndex, tableWidth } = plan
  const widths = snapshots.map(snapshot => snapshot.initialWidth)
  const self = snapshots[resizeIndex]
  if (self == null)
    return widths
  if (neighborIndex != null) {
    const neighbor = snapshots[neighborIndex]
    if (neighbor != null) {
      // 邻列最多让到自己下限，自己最多让到对方下限，两边都不会被拖穿。
      const room = neighbor.initialWidth - neighbor.minWidth
      const give = Math.max(self.minWidth - self.initialWidth, Math.min(delta, room))
      widths[neighborIndex] = neighbor.initialWidth - give
      widths[resizeIndex] = self.initialWidth + give
    }
  }
  else {
    widths[resizeIndex] = Math.min(self.maxWidth, Math.max(self.minWidth, self.initialWidth + delta))
  }
  const last = snapshots.length - 1
  if (last >= 0 && tableWidth > 0) {
    let used = 0
    for (let index = 0; index < widths.length; index++) {
      if (index !== last)
        used += widths[index] ?? 0
    }
    widths[last] = Math.max(snapshots[last]?.minWidth ?? 0, tableWidth - used)
  }
  return widths
}

/** 横向位移的方向。RTL 里往右拖等于把列变窄。 */
export function columnResizeDirectionSign(direction: string): 1 | -1 {
  return direction === 'rtl' ? -1 : 1
}

/** 键盘按一下走多少像素。按住 Shift 走大步。 */
export function columnResizeStep(isShiftKey: boolean): number {
  return isShiftKey ? 50 : 10
}

function roundWidth(value: number): number {
  return Math.round(value)
}

export function useTableColumnResize<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableColumnResizeConfig<T>>,
): TablePlugin<T> {
  return {
    widthFor(column: TableColumn<T>) {
      return toValue(config).columnWidths?.[column.key]
    },
    resizeFor(column: TableColumn<T>, columns: readonly TableColumn<T>[]): TableColumnResizeContribution | null {
      if (column.resizable === false)
        return null
      const current = toValue(config)
      const all = current.columns ?? columns
      const resizable = all.filter(item => item.resizable !== false)
      const index = resizable.findIndex(item => item.key === column.key)
      const isLast = index >= 0 && index === resizable.length - 1
      const isProportional = isProportionalColumnWidth(column.width)
      const neighbor = isProportional && index >= 0 && index < resizable.length - 1
        ? resizable[index + 1]?.key ?? null
        : null
      return {
        currentWidth: current.columnWidths?.[column.key],
        minWidth: columnResizeMinWidth(column.width, current.minWidth),
        maxWidth: current.maxWidth ?? Number.POSITIVE_INFINITY,
        neighborKey: neighbor,
        hasHandle: !(isLast && isProportional),
      }
    },
    onColumnResizeEnd(updates: Record<string, number>) {
      const current = toValue(config)
      if (current.onColumnResizeEnd == null)
        return
      const rounded: Record<string, number> = {}
      for (const [key, width] of Object.entries(updates))
        rounded[key] = roundWidth(width)
      current.onColumnResizeEnd(rounded)
    },
  }
}
