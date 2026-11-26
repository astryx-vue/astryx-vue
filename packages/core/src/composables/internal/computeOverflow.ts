export interface ComputeOverflowInput {
  /** 每一项的宽度，按原来的 DOM 顺序。 */
  widths: number[]
  /** 项与项之间的间距。 */
  gap: number
  /** 可以用来排项的宽度。 */
  availableWidth: number
  /** 溢出指示器的宽度。没有就是 0。 */
  indicatorWidth: number
  /** 至少显示这么多项，哪怕挤不下。 */
  minVisibleItems: number
  /** 最多显示这么多项。不传表示不封顶。 */
  maxVisibleItems?: number
  /**
   * 最多排几行，多出来的收进指示器。不传或 1 表示只排一行。
   * 不限行数的换行不是溢出折叠，直接用 flex-wrap。
   */
  maxRows?: number
  /** 从哪一头开始收起。 */
  collapseFrom: 'start' | 'end'
}

export interface ComputeOverflowResult {
  /** 可见容器里应该留下的项数。 */
  visibleCount: number
  /** 这些项占几行。单行时是 1。 */
  rows: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min)
}

export function resolveBounds(
  itemCount: number,
  minVisibleItems: number,
  maxVisibleItems: number | undefined,
): { floor: number, ceiling: number } {
  const floor = Math.max(0, Math.min(minVisibleItems, itemCount))
  const rawCeiling = maxVisibleItems ?? itemCount
  const ceiling = Math.max(0, Math.min(rawCeiling, itemCount))
  return { floor, ceiling }
}

function computeSingleLineFit(
  orderedWidths: number[],
  gap: number,
  availableWidth: number,
  indicatorWidth: number,
  floor: number,
  ceiling: number,
): number {
  // 全部放得下就不需要指示器，也就不给它留位置：否则最后一项比指示器窄的一组，明明放得下也会折起来。
  const allWidth = orderedWidths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, orderedWidths.length - 1)
  if (orderedWidths.length <= ceiling && allWidth <= availableWidth)
    return orderedWidths.length

  let totalWidth = 0
  let count = 0

  for (let i = 0; i < orderedWidths.length; i++) {
    if (count >= ceiling)
      break

    const itemWidth = orderedWidths[i] ?? 0
    const gapWidth = i > 0 ? gap : 0
    const candidateWidth = totalWidth + itemWidth + gapWidth
    const isLastItem = i === orderedWidths.length - 1
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

  for (let i = 0; i < orderedWidths.length; i++) {
    const width = orderedWidths[i] ?? 0
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
    i--
  }

  return { placed, rows: row }
}

function countRows(orderedWidths: number[], gap: number, availableWidth: number): number {
  if (orderedWidths.length === 0)
    return 0
  let rows = 1
  let rowWidth = 0
  for (let i = 0; i < orderedWidths.length; i++) {
    const width = orderedWidths[i] ?? 0
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
  const total = orderedWidths.length
  if (total === 0)
    return { count: 0, rows: 0 }

  const packAll = packRows(orderedWidths, gap, availableWidth, 0, maxRows)
  if (packAll.placed === total)
    return { count: total, rows: packAll.rows }

  const packWithIndicator = packRows(orderedWidths, gap, availableWidth, indicatorWidth, maxRows)
  const count = packWithIndicator.placed
  const rows = countRows(orderedWidths.slice(0, count), gap, availableWidth)
  return { count, rows: Math.max(count > 0 ? 1 : 0, rows) }
}

/**
 * 对应原版 Astryx 的 `hooks/computeOverflow`。
 * 只做加减，不碰 DOM，方便单测。
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
