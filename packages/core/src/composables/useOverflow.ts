import type { MaybeRefOrGetter, Ref } from 'vue'
import { computed, nextTick, onScopeDispose, ref, toValue, watch } from 'vue'
import { computeOverflow } from './computeOverflow.js'

export interface UseOverflowOptions {
  /** 项间距，单位像素。 @default 0 */
  gap?: MaybeRefOrGetter<number>
  /** 至少保留的项数。 @default 0 */
  minVisibleItems?: MaybeRefOrGetter<number>
  /** 最多显示的项数。不传表示不设上限。 */
  maxVisibleItems?: MaybeRefOrGetter<number | undefined>
  /** 最多排成几行。不传或为 1 时保持单行。 */
  maxRows?: MaybeRefOrGetter<number | undefined>
  /** 从哪一头开始收起。 @default 'end' */
  collapseFrom?: MaybeRefOrGetter<'start' | 'end'>
  /**
   * 观察谁的宽度。
   * `observeSelf` 用容器自己的宽度；`observeParent` 用父元素的内容宽度。
   * @default 'observeSelf'
   */
  behavior?: MaybeRefOrGetter<'observeParent' | 'observeSelf'>
}

export interface UseOverflowReturn {
  /** 挂到可见容器上。 */
  containerRef: Ref<HTMLElement | null>
  /** 挂到隐藏的测量容器上。测量容器里先放全部项，最后一项可以是溢出指示器。 */
  measureRef: Ref<HTMLElement | null>
  /** 当前放得下的项数。 */
  visibleCount: Ref<number>
  /** 是否有项被收起。 */
  hasOverflow: Ref<boolean>
  /** 可见项占据的行数。 */
  rows: Ref<number>
  /** 测到的单行高度，多行时用来限制容器。 */
  rowHeight: Ref<number>
  /** 立即重新测量。 */
  recalculate: () => void
}

/**
 * 用隐藏容器测量每一项的宽度，算出当前容器里能放下几项。
 * 测量容器的子元素数量比 `itemCount` 多一个时，最后一个视为溢出指示器。
 */
export function useOverflow(
  itemCount: MaybeRefOrGetter<number>,
  options: UseOverflowOptions = {},
): UseOverflowReturn {
  const containerRef = ref<HTMLElement | null>(null)
  const measureRef = ref<HTMLElement | null>(null)
  const visibleCount = ref(toValue(itemCount))
  const rows = ref(1)
  const rowHeight = ref(0)
  let observer: ResizeObserver | null = null

  function calculate(): void {
    const container = containerRef.value
    const measure = measureRef.value
    const count = toValue(itemCount)
    if (!container || !measure) {
      visibleCount.value = count
      return
    }

    const behavior = toValue(options.behavior) ?? 'observeSelf'
    let availableWidth = container.clientWidth
    if (behavior === 'observeParent' && container.parentElement) {
      const parent = container.parentElement
      const parentStyle = getComputedStyle(parent)
      availableWidth = parent.clientWidth
        - Number.parseFloat(parentStyle.paddingLeft || '0')
        - Number.parseFloat(parentStyle.paddingRight || '0')
    }

    const children = [...measure.children] as HTMLElement[]
    const hasIndicator = children.length > count
    const items = hasIndicator ? children.slice(0, count) : children
    const indicatorWidth = hasIndicator ? (children[children.length - 1]?.offsetWidth ?? 0) : 0

    if (items.length === 0) {
      visibleCount.value = 0
      rows.value = 0
      rowHeight.value = 0
      return
    }

    const widths = items.map(item => item.offsetWidth)
    const measuredHeight = items.reduce((max, item) => Math.max(max, item.offsetHeight || 0), 0)
    const result = computeOverflow({
      widths,
      gap: toValue(options.gap) ?? 0,
      availableWidth,
      indicatorWidth,
      minVisibleItems: toValue(options.minVisibleItems) ?? 0,
      maxVisibleItems: toValue(options.maxVisibleItems),
      maxRows: toValue(options.maxRows),
      collapseFrom: toValue(options.collapseFrom) ?? 'end',
    })
    visibleCount.value = result.visibleCount
    rows.value = result.rows
    rowHeight.value = measuredHeight
  }

  function observe(): void {
    observer?.disconnect()
    const container = containerRef.value
    if (!container || typeof ResizeObserver === 'undefined')
      return
    const behavior = toValue(options.behavior) ?? 'observeSelf'
    const target = behavior === 'observeParent' && container.parentElement
      ? container.parentElement
      : container
    observer = new ResizeObserver(() => calculate())
    observer.observe(target)
  }

  watch([containerRef, measureRef], () => {
    observe()
    void nextTick(calculate)
  })

  watch(
    () => [
      toValue(itemCount),
      toValue(options.gap) ?? 0,
      toValue(options.minVisibleItems) ?? 0,
      toValue(options.maxVisibleItems),
      toValue(options.maxRows),
      toValue(options.collapseFrom) ?? 'end',
      toValue(options.behavior) ?? 'observeSelf',
    ],
    () => {
      void nextTick(calculate)
    },
  )

  onScopeDispose(() => {
    observer?.disconnect()
  })

  const hasOverflow = computed(() => visibleCount.value < toValue(itemCount))

  return {
    containerRef,
    measureRef,
    visibleCount,
    hasOverflow,
    rows,
    rowHeight,
    recalculate: calculate,
  }
}
