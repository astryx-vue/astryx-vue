export interface ComputeOverflowInput {
  /** 每一项的宽度，顺序与原始列表一致。 */
  widths: number[]
  /** 项与项之间的间距，单位是像素。 */
  gap: number
  /** 可用于排布的宽度，单位是像素。 */
  availableWidth: number
  /** 溢出指示器的宽度。没有指示器时为 0。 */
  indicatorWidth: number
  /** 至少显示的项数。 */
  minVisibleItems: number
  /** 最多显示的项数。不传表示不设上限。 */
  maxVisibleItems?: number
  /**
   * 最多排成几行后再把剩下的收进指示器。
   * 不传或为 1 时保持单行。
   */
  maxRows?: number
  /** 从哪一头开始收起。 */
  collapseFrom: 'start' | 'end'
}

export interface ComputeOverflowResult {
  /** 应该留在可见区域里的项数。 */
  visibleCount: number
  /** 这些可见项占据的行数。单行时为 1。 */
  rows: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min)
}

function resolveBounds(
  itemCount: number,
  minVisibleItems: number,
  maxVisibleItems: number | undefined,
): { floor: number, ceiling: number } {
  const floor = Math.max(0, Math.min(minVisibleItems, itemCount))
  const rawCeiling = maxVisibleItems ?? itemCount
  const ceiling = Math.max(0, Math.min(rawCeiling, itemCount))
  return { floor, ceiling }
}

/**
 * 单行贪心：每接纳一项非末项时，都给溢出指示器预留位置。
 */
function computeSingleLineFit(
  orderedWidths: number[],
  gap: number,
  availableWidth: number,
  indicatorWidth: number,
  floor: number,
  ceiling: number,
): number {
  let totalWidth = 0
  let count = 0

  for (let index = 0; index < orderedWidths.length; index++) {
    if (count >= ceiling)
      break

    const itemWidth = orderedWidths[index] ?? 0
    const gapWidth = index > 0 ? gap : 0
    const candidateWidth = totalWidth + itemWidth + gapWidth
    const isLastItem = index === orderedWidths.length - 1
    const reservedWidth = isLastItem
      ? 0
      : indicatorWidth + (count > 0 || indicatorWidth > 0 ? gap : 0)

    if (candidateWidth + reservedWidth > availableWidth && count >= floor)
      break

    totalWidth = candidateWidth
    count++
  }

  return count
}

function packRows(
  orderedWidths: number[],
  gap: number,
  availableWidth: number,
  indicatorReserve: number,
  maxRows: number,
): { placed: number, rows: number } {
  let placed = 0
  let row = 1
  let rowWidth = 0

  for (let index = 0; index < orderedWidths.length; index++) {
    const width = orderedWidths[index] ?? 0
    const isFirstInRow = rowWidth === 0
    const candidate = isFirstInRow ? width : rowWidth + gap + width
    const onLastRow = row === maxRows
    const reserve = onLastRow && indicatorReserve > 0 ? indicatorReserve + gap : 0

    if (candidate + reserve <= availableWidth) {
      rowWidth = candidate
      placed++
      continue
    }

    if (isFirstInRow) {
      if (onLastRow && reserve > 0)
        break
      rowWidth = candidate
      placed++
      continue
    }

    if (row >= maxRows)
      break

    row++
    rowWidth = 0
    index--
  }

  return { placed, rows: row }
}

function countRows(orderedWidths: number[], gap: number, availableWidth: number): number {
  if (orderedWidths.length === 0)
    return 0

  let rows = 1
  let rowWidth = 0
  for (const width of orderedWidths) {
    const isFirstInRow = rowWidth === 0
    const candidate = isFirstInRow ? width : rowWidth + gap + width
    if (candidate <= availableWidth || isFirstInRow) {
      rowWidth = candidate
    }
    else {
      rows++
      rowWidth = width
    }
  }
  return rows
}

function computeMultiRowFit(
  orderedWidths: number[],
  gap: number,
  availableWidth: number,
  indicatorWidth: number,
  maxRows: number,
): { count: number, rows: number } {
  if (orderedWidths.length === 0)
    return { count: 0, rows: 0 }

  const packAll = packRows(orderedWidths, gap, availableWidth, 0, maxRows)
  if (packAll.placed === orderedWidths.length)
    return { count: orderedWidths.length, rows: packAll.rows }

  const packWithIndicator = packRows(orderedWidths, gap, availableWidth, indicatorWidth, maxRows)
  const count = packWithIndicator.placed
  const rows = countRows(orderedWidths.slice(0, count), gap, availableWidth)
  return { count, rows: Math.max(count > 0 ? 1 : 0, rows) }
}

/**
 * 根据测量结果计算可见项数和行数。不碰 DOM，方便单独测试。
 */
export function computeOverflow(input: ComputeOverflowInput): ComputeOverflowResult {
  const {
    widths,
    gap,
    availableWidth,
    indicatorWidth,
    minVisibleItems,
    maxVisibleItems,
    maxRows,
    collapseFrom,
  } = input

  const itemCount = widths.length
  if (itemCount === 0)
    return { visibleCount: 0, rows: 0 }

  const { floor, ceiling } = resolveBounds(itemCount, minVisibleItems, maxVisibleItems)
  const orderedWidths = collapseFrom === 'end' ? widths : [...widths].reverse()
  const multiRow = maxRows != null && maxRows > 1

  if (!multiRow) {
    const fitCount = computeSingleLineFit(orderedWidths, gap, availableWidth, indicatorWidth, floor, ceiling)
    const visibleCount = clamp(fitCount, floor, ceiling)
    return { visibleCount, rows: visibleCount > 0 ? 1 : 0 }
  }

  const { count, rows } = computeMultiRowFit(orderedWidths, gap, availableWidth, indicatorWidth, maxRows)
  const visibleCount = clamp(count, floor, ceiling)
  const resolvedRows = visibleCount === count
    ? rows
    : countRows(orderedWidths.slice(0, visibleCount), gap, availableWidth)
  return { visibleCount, rows: visibleCount > 0 ? Math.max(1, resolvedRows) : 0 }
}
