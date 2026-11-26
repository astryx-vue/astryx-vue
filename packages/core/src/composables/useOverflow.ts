import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import { computeOverflow, resolveBounds } from './internal/computeOverflow.js'

export { computeOverflow } from './internal/computeOverflow.js'
export type { ComputeOverflowInput, ComputeOverflowResult } from './internal/computeOverflow.js'

export interface UseOverflowOptions {
  /**
   * 项间距，参与宽度计算。
   * @default 0
   */
  gap?: number
  /**
   * 项间距在主题里的值（比如 `'var(--astryx-spacing-2)'`）。传了就不用 `gap`，
   * 改读测量副本在浏览器里真正排出来的间距：间距阶梯跟主题和根字号走，像素值要排完版才知道。
   * 值变了会重新量一次。
   */
  gapToken?: MaybeRefOrGetter<string | undefined>
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

export interface OverflowInlineBounds {
  collapsed: number
  rendered: number
  inFlexRow: boolean
}

const NO_INLINE_BOUNDS: OverflowInlineBounds = { collapsed: 0, rendered: 0, inFlexRow: false }

function isFlexRow(parent: Element | null): boolean {
  if (parent == null)
    return false
  const style = getComputedStyle(parent)
  return (style.display === 'flex' || style.display === 'inline-flex') && style.flexDirection.startsWith('row')
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
  /**
   * 单行列表的横向边界，从测量副本量出来；排版前都是 0。
   * `collapsed` 是折到最窄（只剩下限的项加指示器）的宽度，`rendered` 是全部项展开的宽度，
   * `inFlexRow` 是父元素是不是横向 flex（那时列表的宽度会跟着已显示的内容走）。
   */
  inlineBounds: Ref<OverflowInlineBounds>
  /** 量的时候用的项间距（像素）：传了 `gapToken` 时是排出来的值，否则是 `gap`。 */
  renderedGap: Ref<number>
  /** 宽度是测试里改的、或者折叠状态变了，再量一次。 */
  remeasure: () => void
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
  const renderedGap = ref(gap)
  const inlineBounds = ref<OverflowInlineBounds>(NO_INLINE_BOUNDS)

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

    // 间距阶梯跟主题走，像素值排完版才知道；读不出来就退回传进来的数字。
    if (toValue(options.gapToken) != null) {
      const rendered = Number.parseFloat(getComputedStyle(measure).columnGap)
      renderedGap.value = Number.isFinite(rendered) ? rendered : gap
    }
    const gapWidth = renderedGap.value
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
    if (!(maxRows != null && maxRows > 1)) {
      const { floor } = resolveBounds(total, minVisibleItems, maxVisibleItems)
      const kept = collapseFrom === 'end' ? widths.slice(0, floor) : widths.slice(widths.length - floor)
      const keptWidth = kept.reduce((sum, width) => sum + width, 0) + gapWidth * Math.max(0, kept.length - 1)
      const collapsed = Math.ceil(keptWidth + indicatorWidth + (kept.length > 0 && indicatorWidth > 0 ? gapWidth : 0))
      const rendered = widths.reduce((sum, width) => sum + width, 0) + gapWidth * Math.max(0, widths.length - 1)
      const inFlexRow = isFlexRow(container.parentElement)
      const current = inlineBounds.value
      if (current.collapsed !== collapsed || current.rendered !== rendered || current.inFlexRow !== inFlexRow)
        inlineBounds.value = { collapsed, rendered, inFlexRow }
    }
    const measuredRowHeight = children.reduce((max, child) => Math.max(max, child.offsetHeight || 0), 0)
    const next = computeOverflow({
      availableWidth,
      collapseFrom,
      gap: gapWidth,
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

  watch(() => toValue(options.gapToken), () => {
    void nextTick(calculate)
  })

  onBeforeUnmount(() => {
    unobserveContainer?.()
    unobserveMeasure?.()
  })

  return {
    containerRef,
    hasOverflow,
    measureRef,
    inlineBounds,
    remeasure: calculate,
    renderedGap,
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
