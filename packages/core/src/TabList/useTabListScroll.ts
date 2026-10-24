import type { ComputedRef, Ref } from 'vue'
import { onMounted, onScopeDispose, watch } from 'vue'
import { useScrollOverflow } from '../composables/useScrollOverflow.js'

/** 点一次箭头，滚过可见宽度的这一截。和上游的滚动步长一致。 */
const SCROLL_PAGE_RATIO = 0.8

/**
 * 标签条比容器宽时横向滚动。
 * 选中项或刚获得焦点的项如果被挡住，立刻滚回可见区域，不走平滑滚动。
 */
export function useTabListScroll(options: {
  enabled: ComputedRef<boolean>
  selectedValue: ComputedRef<string>
}): {
  bind: (node: unknown) => void
  onFocusIn: (event: FocusEvent) => void
  overflowEnd: Ref<boolean>
  overflowStart: Ref<boolean>
  scrollByPage: (direction: -1 | 1) => void
} {
  let strip: HTMLElement | null = null
  let resizeObserver: ResizeObserver | undefined
  let revealedValue: string | null = null
  const { scrollRef, overflowStart, overflowEnd } = useScrollOverflow()

  function insetOf(node: HTMLElement): number {
    const style = getComputedStyle(node)
    const raw = style.scrollPaddingInlineStart || style.scrollPaddingLeft
    const parsed = Number.parseFloat(raw)
    return Number.isFinite(parsed) ? parsed : 0
  }

  function readingRtl(node: HTMLElement): boolean {
    return getComputedStyle(node).direction === 'rtl'
  }

  function revealStop(stop: HTMLElement | null): void {
    if (!options.enabled.value || strip == null || stop == null)
      return
    const stripBox = strip.getBoundingClientRect()
    const stopBox = stop.getBoundingClientRect()
    const inset = insetOf(strip)
    const pastEnd = stopBox.right - (stripBox.right - inset)
    const pastStart = stopBox.left - (stripBox.left + inset)
    const tooWide = stopBox.width > stripBox.width - 2 * inset
    const delta = tooWide
      ? (readingRtl(strip) ? pastEnd : pastStart)
      : pastEnd > 0
        ? pastEnd
        : pastStart < 0
          ? pastStart
          : 0
    if (delta !== 0)
      strip.scrollBy({ behavior: 'instant', left: delta })
  }

  function selectedStop(): HTMLElement | null {
    if (strip == null)
      return null
    const value = CSS.escape(options.selectedValue.value)
    return strip.querySelector<HTMLElement>(`[data-tab-value="${value}"]`)
  }

  function revealSelected(): void {
    revealStop(selectedStop())
  }

  function bind(node: unknown): void {
    const host = node instanceof HTMLElement ? node : null
    resizeObserver?.disconnect()
    resizeObserver = undefined
    strip = host
    scrollRef(options.enabled.value ? host : null)
    if (host == null || !options.enabled.value || typeof ResizeObserver === 'undefined')
      return
    resizeObserver = new ResizeObserver(() => revealSelected())
    resizeObserver.observe(host)
  }

  function scrollByPage(direction: -1 | 1): void {
    if (strip == null)
      return
    const rtlSign = readingRtl(strip) ? -1 : 1
    strip.scrollBy({ left: rtlSign * direction * strip.clientWidth * SCROLL_PAGE_RATIO })
  }

  function onFocusIn(event: FocusEvent): void {
    const target = event.target
    if (!(target instanceof Element) || strip == null || !strip.contains(target))
      return
    revealStop(target.closest<HTMLElement>('[data-tab-value], [data-tab-menu]'))
  }

  watch(options.enabled, (enabled) => {
    bind(strip)
    if (enabled)
      revealSelected()
  })

  watch(options.selectedValue, (value) => {
    if (!options.enabled.value) {
      revealedValue = value
      return
    }
    if (revealedValue === value)
      return
    revealedValue = value
    revealSelected()
  })

  onMounted(() => {
    revealedValue = options.selectedValue.value
    if (options.enabled.value)
      revealSelected()
  })

  onScopeDispose(() => {
    resizeObserver?.disconnect()
  })

  return {
    bind,
    onFocusIn,
    overflowEnd,
    overflowStart,
    scrollByPage,
  }
}
