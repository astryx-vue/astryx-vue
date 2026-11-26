import type { ComputedRef } from 'vue'
import type { ListWindowKey, ListWindowSegment, VariableListRange } from './listWindow.js'
import type { ListWindowGeometry } from './listWindowGeometry.js'
import { computed, shallowRef, watch } from 'vue'
import { calculateVariableListRange, createListWindowSegments, isPositiveFinite, reconcileListAnchor } from './listWindow.js'
import { useListFocusIsland } from './useListFocusIsland.js'

export interface UseInlineListWindowOptions {
  /** 每项一个稳定的键，按顺序；焦点和锚点都跟着键走。 */
  keys: () => readonly ListWindowKey[]
  /** 每一项的起点，最后再加上总长度：比项数多一个。 */
  offsets: () => readonly number[]
  /** 行内起点一侧盖住列表的宽度，例如固定在起点的列。 */
  insetStart: () => number
  /** 行内终点一侧盖住列表的宽度。 */
  insetEnd: () => number
  /** 量到视口之前用来规划首帧的视口宽度。 */
  initialViewportWidth: () => number
  /** 可见区两侧各多挂几项。 */
  overscan: number
  canWindow: () => boolean
  geometry: () => ListWindowGeometry
  viewport: () => HTMLElement | null
}

export interface InlineListWindowResult {
  /** 至少有一项没挂载时为真。 */
  isWindowed: ComputedRef<boolean>
  /** 挂载段和占位段；占位段的 `height` 是这几项在行内方向上的总宽度。 */
  segments: ComputedRef<ListWindowSegment[]>
  onItemFocus: (key: ListWindowKey) => void
  onItemBlur: () => void
}

interface PlannedItems {
  keys: readonly ListWindowKey[]
  offsets: readonly number[]
  insetStart: number
  insetEnd: number
}

function sameValues<T>(a: readonly T[], b: readonly T[]): boolean {
  return a === b || (a.length === b.length && a.every((value, index) => value === b[index]))
}

/** 从右到左排版时，视口报的行内滚动距离是负数。 */
function writeInlineScroll(viewport: HTMLElement, logical: number): void {
  const isReversed = viewport.ownerDocument.defaultView?.getComputedStyle(viewport).direction === 'rtl'
  viewport.scrollLeft = isReversed ? -logical : logical
}

/**
 * 行内方向的长列表窗口：项宽各不相同（例如表格列），两端可以有一直挂着的固定内容。
 * 项的键、宽度或两端固定内容变了，第一项可见项和它露出的比例留在原处。
 */
export function useInlineListWindow(options: UseInlineListWindowOptions): InlineListWindowResult {
  const pending = shallowRef<{ from: number, to: number } | undefined>()
  let planned: PlannedItems | undefined
  const keyIndices = computed(() => new Map(options.keys().map((key, index) => [key, index])))
  const island = useListFocusIsland({ keyIndices: () => keyIndices.value, isActive: options.canWindow, viewport: options.viewport })
  const count = computed(() => Math.max(0, options.offsets().length - 1))

  const isMeasured = computed(() => {
    const snapshot = options.geometry()
    return snapshot.isMeasured && isPositiveFinite(snapshot.viewportWidth) && Number.isFinite(snapshot.scrollLeft)
  })
  /** 两端固定内容盖住视口边缘，只有中间这段露出列表。 */
  function visibleSize(insetStart: number, insetEnd: number): number {
    const width = isMeasured.value ? options.geometry().viewportWidth : options.initialViewportWidth()
    return width - insetStart - insetEnd
  }

  const range = computed<VariableListRange | undefined>(() => {
    if (!options.canWindow())
      return undefined
    return calculateVariableListRange({
      offsets: options.offsets(),
      viewportSize: visibleSize(options.insetStart(), options.insetEnd()),
      scrollOffset: isMeasured.value ? (pending.value?.to ?? options.geometry().scrollLeft) : 0,
      isMeasured: isMeasured.value,
      overscan: options.overscan,
    })
  })
  const isWindowed = computed(() => range.value !== undefined && (range.value.start > 0 || range.value.end < count.value))
  const bounds = computed(() => (isWindowed.value ? { start: range.value!.start, end: range.value!.end } : { start: 0, end: count.value }))
  const segments = computed<ListWindowSegment[]>(() => {
    const offsets = options.offsets()
    const focus = isWindowed.value ? island.focusIndex.value : undefined
    return createListWindowSegments(count.value, 1, bounds.value.start, bounds.value.end, focus).map(segment =>
      segment.type === 'gap'
        ? { ...segment, height: (offsets[segment.end] ?? 0) - (offsets[segment.start] ?? 0) }
        : segment,
    )
  })

  // 项变了（同样的值重建的新数组不算）：按上一次的第一项可见项重新定位。
  watch([options.keys, options.offsets, options.insetStart, options.insetEnd], ([keys, offsets, insetStart, insetEnd]) => {
    const last = planned
    if (!options.canWindow() || !isMeasured.value || last == null)
      return
    if (sameValues(last.keys, keys) && sameValues(last.offsets, offsets))
      return
    const scrollLeft = pending.value?.to ?? options.geometry().scrollLeft
    const previous = calculateVariableListRange({
      offsets: last.offsets,
      viewportSize: visibleSize(last.insetStart, last.insetEnd),
      scrollOffset: scrollLeft,
      isMeasured: true,
      overscan: options.overscan,
    })
    const firstSize = (last.offsets[previous.firstVisibleIndex + 1] ?? 0) - (last.offsets[previous.firstVisibleIndex] ?? 0)
    const to = reconcileListAnchor({
      previousKeys: last.keys,
      keys,
      keyIndices: keyIndices.value,
      firstVisibleIndex: previous.firstVisibleIndex,
      offset: firstSize > 0 ? previous.offset / firstSize : 0,
      offsets,
      rowHeight: 0,
      viewportHeight: visibleSize(insetStart, insetEnd),
      startOffset: 0,
    })
    pending.value = Math.abs(to - options.geometry().scrollLeft) > 0.5 ? { from: options.geometry().scrollLeft, to } : undefined
  })

  watch(() => options.geometry().scrollLeft, (scrollLeft) => {
    if (pending.value != null && scrollLeft !== pending.value.from)
      pending.value = undefined
  })

  watch([range, options.keys, options.offsets, options.insetStart, options.insetEnd], ([current]) => {
    planned = current !== undefined && isMeasured.value
      ? { keys: options.keys(), offsets: options.offsets(), insetStart: options.insetStart(), insetEnd: options.insetEnd() }
      : undefined
    const anchor = pending.value
    const viewport = options.viewport()
    if (anchor == null || viewport == null)
      return
    writeInlineScroll(viewport, anchor.to)
    if (Math.abs(Math.abs(viewport.scrollLeft) - anchor.from) < 0.5)
      pending.value = undefined
  }, { flush: 'post', immediate: true })

  return { isWindowed, segments, onItemFocus: island.onItemFocus, onItemBlur: island.onItemBlur }
}
