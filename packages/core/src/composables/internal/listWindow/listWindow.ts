/**
 * 长列表窗口化的纯计算：给定行高、滚动位置和视口大小，算出该挂载哪一段，
 * 以及挂载段前后各留多高的占位。和框架、DOM 都无关，表格和列表共用。
 *
 * 区间一律左闭右开：`start` 挂载，`end` 不挂载。
 */

export type ListWindowKey = string | number

export type ListWindowSegment
  = | { type: 'rows', start: number, end: number }
    | { type: 'gap', start: number, end: number, height: number }

export interface ListWindowOptions {
  rowCount: number
  rowHeight: number
  viewportHeight: number
  scrollTop: number
  /** 量到的整个内容高度，只用来夹住滚动位置，不改变行数。 */
  scrollHeight?: number
  /** 从滚动起点到第一行的距离，例如表头的高度。 */
  startOffset: number
  isMeasured: boolean
  /** 有焦点的那一行，滚出窗口也继续挂载。 */
  focusIndex?: number
}

export interface ListWindowPlan {
  segments: ListWindowSegment[]
  start: number
  end: number
  firstVisibleIndex: number
  /** 第一行可见行顶部到滚动位置的距离；滚动位置还在第一行上方时为负数。 */
  offset: number
  totalHeight: number
}

/** 可见区前后各多挂几行。 */
export const LIST_WINDOW_OVERSCAN = 4

export function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

function hasValidInputs(options: ListWindowOptions, totalHeight: number): boolean {
  const { rowCount, rowHeight, viewportHeight, scrollTop, startOffset, scrollHeight } = options
  return Number.isSafeInteger(rowCount)
    && rowCount >= 0
    && isPositiveFinite(rowHeight)
    && isPositiveFinite(viewportHeight)
    && Number.isFinite(totalHeight)
    && Number.isFinite(startOffset + totalHeight)
    && Number.isFinite(viewportHeight / rowHeight)
    && Number.isFinite(scrollTop)
    && (scrollHeight === undefined || (Number.isFinite(scrollHeight) && scrollHeight >= 0))
    && Number.isFinite(startOffset)
    && startOffset >= 0
}

/**
 * 定高行的窗口。输入算不出有限的窗口时返回 `null`，调用方退回全部渲染。
 * 还没量到视口时，从第一行开始挂满 `viewportHeight` 再加缓冲区，服务端和首帧用同一个结果。
 */
export function calculateListWindow(options: ListWindowOptions): ListWindowPlan | null {
  const { rowCount, rowHeight, viewportHeight, scrollTop, startOffset, isMeasured, focusIndex } = options
  const totalHeight = rowCount * rowHeight
  if (!hasValidInputs(options, totalHeight))
    return null
  if (rowCount === 0)
    return { segments: [], start: 0, end: 0, firstVisibleIndex: 0, offset: 0, totalHeight: 0 }

  // 按整段内容的高度夹住滚动位置，不按挂载了多少行。
  const contentHeight = Math.max(startOffset + totalHeight, options.scrollHeight ?? 0)
  const maximumScroll = Math.max(0, contentHeight - viewportHeight)
  const clampedScroll = Math.min(maximumScroll, Math.max(0, scrollTop))
  const listTop = clampedScroll - startOffset
  const bodyTop = Math.min(totalHeight, Math.max(0, listTop))
  const bodyBottom = Math.min(totalHeight, Math.max(0, clampedScroll + viewportHeight - startOffset))
  const firstVisibleIndex = isMeasured ? Math.min(rowCount - 1, Math.floor(bodyTop / rowHeight)) : 0
  // 还在第一行上方时，offset 是到第一行的负距离，锚点换算回来仍落在原处。
  let offset = 0
  if (isMeasured)
    offset = listTop < 0 ? listTop : bodyTop - firstVisibleIndex * rowHeight
  const start = isMeasured ? Math.max(0, firstVisibleIndex - LIST_WINDOW_OVERSCAN) : 0
  const end = isMeasured
    ? Math.min(rowCount, Math.max(firstVisibleIndex, Math.ceil(bodyBottom / rowHeight)) + LIST_WINDOW_OVERSCAN)
    : Math.min(rowCount, Math.ceil(viewportHeight / rowHeight) + LIST_WINDOW_OVERSCAN)
  return {
    segments: createListWindowSegments(rowCount, rowHeight, start, end, focusIndex),
    start,
    end,
    firstVisibleIndex,
    offset,
    totalHeight,
  }
}

/** 一段挂载区间加上窗口外那一个焦点行，换成挂载段和占位段。 */
export function createListWindowSegments(
  rowCount: number,
  rowHeight: number,
  start: number,
  end: number,
  focusIndex?: number,
): ListWindowSegment[] {
  if (rowCount === 0)
    return []
  const intervals: { start: number, end: number }[] = [{ start, end }]
  if (
    focusIndex !== undefined
    && Number.isInteger(focusIndex)
    && focusIndex >= 0
    && focusIndex < rowCount
    && (focusIndex < start || focusIndex >= end)
  ) {
    intervals.push({ start: focusIndex, end: focusIndex + 1 })
    intervals.sort((a, b) => a.start - b.start)
  }
  const merged: { start: number, end: number }[] = []
  for (const interval of intervals) {
    const previous = merged.at(-1)
    if (previous && interval.start <= previous.end)
      previous.end = Math.max(previous.end, interval.end)
    else if (interval.end > interval.start)
      merged.push({ ...interval })
  }
  const segments: ListWindowSegment[] = []
  let cursor = 0
  for (const interval of merged) {
    if (interval.start > cursor)
      segments.push({ type: 'gap', start: cursor, end: interval.start, height: (interval.start - cursor) * rowHeight })
    segments.push({ type: 'rows', ...interval })
    cursor = interval.end
  }
  if (cursor < rowCount)
    segments.push({ type: 'gap', start: cursor, end: rowCount, height: (rowCount - cursor) * rowHeight })
  return segments
}

export interface VariableListRangeOptions {
  /** 每一项的起点，最后再加上总长度：比项数多一个。 */
  offsets: readonly number[]
  viewportSize: number
  scrollOffset: number
  isMeasured: boolean
  overscan: number
}

export interface VariableListRange {
  start: number
  end: number
  firstVisibleIndex: number
  /** 第一项可见项的起点到滚动位置的距离。 */
  offset: number
}

/** `[0, limit)` 里第一个起点不小于 `value` 的位置；`isStrict` 时要求大于。 */
function lowerBound(offsets: readonly number[], value: number, limit: number, isStrict = false): number {
  let low = 0
  let high = limit
  while (low < high) {
    const middle = (low + high) >> 1
    const current = offsets[middle] ?? 0
    if (isStrict ? current <= value : current < value)
      low = middle + 1
    else
      high = middle
  }
  return low
}

/**
 * 不等宽（或不等高）项的挂载区间。还没量到视口时，挂起点落在视口里的项，再往后加缓冲区。
 */
export function calculateVariableListRange({
  offsets,
  viewportSize,
  scrollOffset,
  isMeasured,
  overscan,
}: VariableListRangeOptions): VariableListRange {
  const count = Math.max(0, offsets.length - 1)
  if (count === 0)
    return { start: 0, end: 0, firstVisibleIndex: 0, offset: 0 }
  if (!isMeasured) {
    return {
      start: 0,
      end: Math.min(count, lowerBound(offsets, viewportSize, count) + overscan),
      firstVisibleIndex: 0,
      offset: 0,
    }
  }
  const total = offsets[count] ?? 0
  const visibleSize = Math.max(0, viewportSize)
  const scroll = Math.min(Math.max(0, total - visibleSize), Math.max(0, scrollOffset))
  // 起点在滚动位置或之前的最后一项。
  const first = Math.max(0, Math.min(count - 1, lowerBound(offsets, scroll, count, true) - 1))
  const last = Math.max(first + 1, lowerBound(offsets, scroll + visibleSize, count))
  return {
    start: Math.max(0, first - overscan),
    end: Math.min(count, last + overscan),
    firstVisibleIndex: first,
    offset: scroll - (offsets[first] ?? 0),
  }
}

export interface ListAnchorOptions {
  previousKeys: readonly ListWindowKey[]
  keys: readonly ListWindowKey[]
  firstVisibleIndex: number
  offset: number
  rowHeight: number
  viewportHeight: number
  startOffset: number
  /** 列表之后的其他内容高度（例如加载更多），数据变了也保留。 */
  trailingContentHeight?: number
  /** 键到位置的映射。键变了才重建，滚动时不建。 */
  keyIndices?: ReadonlyMap<ListWindowKey, number>
  /**
   * 不等长项的起点加总长度。给了它，`offset` 按锚点项长度的比例算，不读 `rowHeight`。
   */
  offsets?: readonly number[]
}

function findSurvivingIndex(
  previousKeys: readonly ListWindowKey[],
  indices: ReadonlyMap<ListWindowKey, number>,
  firstVisibleIndex: number,
): number | undefined {
  const anchor = previousKeys[firstVisibleIndex]
  let index = anchor === undefined ? undefined : indices.get(anchor)
  // 锚点行没了：先往后找第一个还在的，再往前找。
  for (let i = firstVisibleIndex + 1; index === undefined && i < previousKeys.length; i += 1)
    index = indices.get(previousKeys[i]!)
  for (let i = Math.min(firstVisibleIndex - 1, previousKeys.length - 1); index === undefined && i >= 0; i -= 1)
    index = indices.get(previousKeys[i]!)
  return index
}

/**
 * 数据、顺序或行高变化之后，让原来第一行可见的那一行（按键找）留在原处，返回新的滚动位置。
 */
export function reconcileListAnchor(options: ListAnchorOptions): number {
  const { previousKeys, keys, firstVisibleIndex, offset, rowHeight, viewportHeight, startOffset, offsets } = options
  const indices = options.keyIndices ?? new Map(keys.map((key, index) => [key, index]))
  const index = findSurvivingIndex(previousKeys, indices, firstVisibleIndex)
  const contentSize = offsets ? (offsets[keys.length] ?? 0) : keys.length * rowHeight
  const maximumScroll = Math.max(0, startOffset + contentSize + (options.trailingContentHeight ?? 0) - viewportHeight)
  if (offsets) {
    const itemStart = offsets[index ?? 0] ?? 0
    const itemSize = index === undefined ? 0 : (offsets[index + 1] ?? itemStart) - itemStart
    const fraction = Math.min(1, Math.max(0, offset))
    return Math.max(0, Math.min(maximumScroll, startOffset + itemStart + fraction * itemSize))
  }
  // 一个键都没留下：停在列表前面内容里的位置不动，停在行里的回到第一行。
  const fraction = index === undefined
    ? Math.min(0, Math.max(-startOffset, offset))
    : Math.min(Math.max(-startOffset, offset), rowHeight)
  return Math.min(maximumScroll, startOffset + (index ?? 0) * rowHeight + fraction)
}
