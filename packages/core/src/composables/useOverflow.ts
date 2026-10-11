import type { ComputedRef, Ref } from 'vue'
import { computed, nextTick, onMounted, onScopeDispose, ref, watch } from 'vue'

/**
 * 计算单行里能放下几项。放不下的项要给「+N」指示器留位置。
 * `available <= 0` 表示还没量到宽度，这时不折叠，避免首屏闪成空。
 */
export function computeOverflow(
  itemWidths: readonly number[],
  available: number,
  gap: number,
  indicatorWidth: number,
): number {
  const count = itemWidths.length
  if (count === 0)
    return 0
  if (!(available > 0))
    return count

  const total = itemWidths.reduce((sum, width, index) => sum + width + (index > 0 ? gap : 0), 0)
  if (total <= available)
    return count

  let used = 0
  let visible = 0
  for (let index = 0; index < count; index++) {
    const gapBefore = visible > 0 ? gap : 0
    const next = used + gapBefore + itemWidths[index]!
    const hasMore = index < count - 1
    const withIndicator = hasMore ? next + gap + indicatorWidth : next
    if (withIndicator > available + 0.5)
      break
    used = next
    visible++
  }
  return visible
}

export interface UseOverflowOptions {
  container: Ref<HTMLElement | null>
  /** 子项数量。变化后会重新测量。 */
  count: Ref<number>
  /** 为 false 时全部可见，例如输入框获得焦点后展开。 */
  enabled: Ref<boolean>
  itemSelector?: string
  indicatorSelector?: string
  /** 指示器还没排出来时用的预留宽度。 */
  indicatorFallback?: number
}

export interface OverflowState {
  visibleCount: Ref<number>
  overflowCount: ComputedRef<number>
  remeasure: () => void
}

function gapOf(element: HTMLElement): number {
  const style = getComputedStyle(element)
  const raw = style.columnGap || style.gap || '0'
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * 测量容器里的子项，得出当前能露出来的数量。
 * 测量时会暂时取消 `display: none`，读完宽度再交还给调用方的 v-show。
 */
export function useOverflow(options: UseOverflowOptions): OverflowState {
  const itemSelector = options.itemSelector ?? '[data-overflow-item]'
  const indicatorSelector = options.indicatorSelector ?? '[data-overflow-indicator]'
  const indicatorFallback = options.indicatorFallback ?? 32
  const visibleCount = ref(options.count.value)

  function remeasure(): void {
    if (!options.enabled.value) {
      visibleCount.value = options.count.value
      return
    }
    const root = options.container.value
    if (!root) {
      visibleCount.value = options.count.value
      return
    }

    const items = [...root.querySelectorAll<HTMLElement>(itemSelector)]
    const indicator = root.querySelector<HTMLElement>(indicatorSelector)
    const itemDisplay = items.map(item => item.style.display)
    const indicatorDisplay = indicator?.style.display
    for (const item of items)
      item.style.display = ''
    if (indicator)
      indicator.style.display = ''

    const widths = items.map(item => item.getBoundingClientRect().width)
    const indicatorWidth = indicator?.getBoundingClientRect().width || indicatorFallback
    const next = computeOverflow(widths, root.clientWidth, gapOf(root), indicatorWidth)

    items.forEach((item, index) => {
      item.style.display = itemDisplay[index] ?? ''
    })
    if (indicator && indicatorDisplay != null)
      indicator.style.display = indicatorDisplay

    visibleCount.value = next
  }

  watch([options.count, options.enabled], () => {
    void nextTick(remeasure)
  })

  let observer: ResizeObserver | undefined
  onMounted(() => {
    remeasure()
    const root = options.container.value
    if (typeof ResizeObserver === 'undefined' || !root)
      return
    observer = new ResizeObserver(() => {
      remeasure()
    })
    observer.observe(root)
  })

  onScopeDispose(() => {
    observer?.disconnect()
  })

  const overflowCount = computed(() => Math.max(0, options.count.value - visibleCount.value))

  return { visibleCount, overflowCount, remeasure }
}
