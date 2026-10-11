import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'

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

export interface UseOverflowOptions {
  /**
   * 项间距，参与宽度计算。
   * @default 0
   */
  gap?: number
  /**
   * 哪怕挤不下也至少留下的项数。
   * @default 0
   */
  minVisibleItems?: number
  /**
   * 哪怕都挤得下也不能超过的项数。比 `minVisibleItems` 还小时，下限胜出。
   */
  maxVisibleItems?: number
  /**
   * 最多排几行再把剩下的收起。不传或 1 表示单行。
   */
  maxRows?: number
  /**
   * 从哪一头收起。
   * @default 'end'
   */
  collapseFrom?: 'start' | 'end'
  /**
   * 量哪一个元素的宽度。
   * `observeSelf` 量容器自己。`observeParent` 量父元素的内容宽度，
   * 容器本身可以继续跟着内容收缩。
   * @default 'observeSelf'
   */
  behavior?: 'observeParent' | 'observeSelf'
}

export interface UseOverflowReturn {
  /** 绑到看得见的容器。 */
  containerRef: Ref<HTMLElement | null>
  /** 绑到屏幕外的测量容器。里面先放全部项，最后可以放一个带 `data-overflow-indicator` 的指示器。 */
  measureRef: Ref<HTMLElement | null>
  /** 看得见的项数。 */
  visibleCount: Ref<number>
  /** 是不是有项被收起来了。 */
  hasOverflow: ComputedRef<boolean>
  /** 看得见的项占几行。 */
  rows: Ref<number>
  /** 测到的最大项高，多行容器用它定高度。 */
  rowHeight: Ref<number>
  /** 宽度是测试里改的、或者折叠状态变了，再量一次。 */
  remeasure: () => void
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

function isActiveRef(value: unknown): value is Ref<boolean> {
  return typeof value === 'object'
    && value != null
    && 'value' in value
    && typeof (value as Ref<boolean>).value === 'boolean'
}

/**
 * 菜单面板的内容是不是比盒子高。
 * 从 ContextMenu 的 `useMenuOverflow` 抽出来：打开时量一次，尺寸变化时再量，关上就回到 false。
 * 元素如果在挂载之后才出现（例如 MoreMenu 用 v-if），也会补上观察。
 */
function useElementOverflow(element: Ref<HTMLElement | null>, isActive: Ref<boolean>): Ref<boolean> {
  const hasOverflow = ref(false)
  let observer: ResizeObserver | null = null
  let observed: HTMLElement | null = null

  function update(): void {
    const el = element.value
    hasOverflow.value = el != null && isActive.value && el.scrollHeight > el.clientHeight
  }

  function observe(el: HTMLElement | null): void {
    if (typeof ResizeObserver === 'undefined')
      return
    observer ??= new ResizeObserver(update)
    if (el === observed)
      return
    if (observed != null)
      observer.unobserve(observed)
    observed = el
    if (el != null)
      observer.observe(el)
  }

  onMounted(() => {
    observe(element.value)
    update()
  })

  watch(element, (el) => {
    observe(el)
    update()
  })

  watch(isActive, (active) => {
    if (active) {
      // 先按当前尺寸答一次，再等这一帧的布局结束补一次。菜单打开时元素往往刚画出来。
      update()
      void nextTick(update)
      return
    }
    hasOverflow.value = false
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    observed = null
  })

  return hasOverflow
}

function useItemOverflow(itemCount: MaybeRefOrGetter<number>, options: UseOverflowOptions = {}): UseOverflowReturn {
  const {
    gap = 0,
    minVisibleItems = 0,
    maxVisibleItems,
    maxRows,
    collapseFrom = 'end',
    behavior = 'observeSelf',
  } = options

  const count = computed(() => {
    const value = toValue(itemCount)
    if (!Number.isFinite(value))
      return 0
    return Math.max(0, Math.floor(value))
  })

  const containerRef = ref<HTMLElement | null>(null)
  const measureRef = ref<HTMLElement | null>(null)
  const visibleCount = ref(count.value)
  const rows = ref(count.value > 0 ? 1 : 0)
  const rowHeight = ref(0)
  const hasOverflow = computed(() => visibleCount.value < count.value)

  let unobserveContainer: (() => void) | null = null
  let unobserveMeasure: (() => void) | null = null

  function availableWidthOf(container: HTMLElement): number {
    if (behavior === 'observeParent' && container.parentElement != null) {
      const parent = container.parentElement
      const style = getComputedStyle(parent)
      return parent.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)
    }
    return container.offsetWidth
  }

  function calculate(): void {
    const container = containerRef.value
    const measure = measureRef.value
    const total = count.value
    if (container == null || measure == null)
      return

    const availableWidth = availableWidthOf(container)
    const allChildren = Array.from(measure.children) as HTMLElement[]
    const hasIndicator = allChildren.length > total
    const children = hasIndicator ? allChildren.slice(0, total) : allChildren
    const indicatorWidth = hasIndicator ? (allChildren[allChildren.length - 1]?.offsetWidth ?? 0) : 0

    if (children.length === 0) {
      visibleCount.value = 0
      rows.value = 0
      rowHeight.value = 0
      return
    }

    // 宽度还是 0 说明这一帧还没排出来。先按上限全留，避免首屏闪成空。
    if (!(availableWidth > 0)) {
      const { ceiling } = resolveBounds(total, minVisibleItems, maxVisibleItems)
      visibleCount.value = ceiling
      rows.value = ceiling > 0 ? 1 : 0
      rowHeight.value = children.reduce((max, child) => Math.max(max, child.offsetHeight || 0), 0)
      return
    }

    const widths = children.map(child => child.offsetWidth)
    const measuredRowHeight = children.reduce((max, child) => Math.max(max, child.offsetHeight || 0), 0)
    const next = computeOverflow({
      availableWidth,
      collapseFrom,
      gap,
      indicatorWidth,
      maxRows,
      maxVisibleItems,
      minVisibleItems,
      widths,
    })
    visibleCount.value = next.visibleCount
    rows.value = next.rows
    rowHeight.value = measuredRowHeight
  }

  function observeResize(target: HTMLElement | null, onResize: () => void): () => void {
    if (target == null || typeof ResizeObserver === 'undefined')
      return () => {}
    const observer = new ResizeObserver(onResize)
    observer.observe(target)
    return () => observer.disconnect()
  }

  watch([containerRef, measureRef, count], () => {
    unobserveContainer?.()
    unobserveMeasure?.()
    const container = containerRef.value
    const resizeTarget = container == null
      ? null
      : (behavior === 'observeParent' && container.parentElement != null ? container.parentElement : container)
    unobserveContainer = observeResize(resizeTarget, calculate)
    unobserveMeasure = observeResize(measureRef.value, calculate)
    calculate()
  }, { immediate: true })

  onBeforeUnmount(() => {
    unobserveContainer?.()
    unobserveMeasure?.()
  })

  return {
    containerRef,
    hasOverflow,
    measureRef,
    remeasure: calculate,
    rowHeight,
    rows,
    visibleCount,
  }
}

/**
 * 对应原版 Astryx 的 `hooks/useOverflow`，计算部分对应 `hooks/computeOverflow`。
 *
 * 两种调用：
 * - `useOverflow(元素, 是否有效)` 返回这块元素的内容是不是比盒子高。
 *   这是从 ContextMenu 的 `useMenuOverflow` 抽出来的，ContextMenu 和 MoreMenu 用它决定滚动归谁。
 * - `useOverflow(条目数, 选项)` 测量横向能放下几项。TopNav、Toolbar、OverflowList、Tokenizer 用这个。
 *   测量容器里按顺序放全部项，指示器放在最后，并标上 `data-overflow-indicator`。
 */
export function useOverflow(element: Ref<HTMLElement | null>, isActive: Ref<boolean>): Ref<boolean>
export function useOverflow(itemCount: MaybeRefOrGetter<number>, options?: UseOverflowOptions): UseOverflowReturn
export function useOverflow(
  elementOrCount: Ref<HTMLElement | null> | MaybeRefOrGetter<number>,
  activeOrOptions?: Ref<boolean> | UseOverflowOptions,
): Ref<boolean> | UseOverflowReturn {
  if (isActiveRef(activeOrOptions))
    return useElementOverflow(elementOrCount as Ref<HTMLElement | null>, activeOrOptions)
  return useItemOverflow(elementOrCount as MaybeRefOrGetter<number>, activeOrOptions)
}
