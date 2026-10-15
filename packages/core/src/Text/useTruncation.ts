import type { Ref } from 'vue'
import { onBeforeUnmount, ref, watch } from 'vue'

export type TruncateTooltip = boolean | 'above' | 'below' | 'start' | 'end'

/** `false` 关掉提示。`true` 和缺省都出现在上方。 */
export function truncatePlacement(value: TruncateTooltip | undefined): 'above' | 'below' | 'start' | 'end' | null {
  if (value === false)
    return null
  if (value == null || value === true)
    return 'above'
  return value
}

/**
 * 量文字有没有被截断。单行比宽度，多行用 Range 量真实高度，
 * 避免 line-clamp 把 scrollHeight 也夹成容器高度。
 */
export interface Truncation {
  bind: (value: Element | null) => void
  isTruncated: Ref<boolean>
  fullText: Ref<string>
}

export function useTruncation(maxLines: Ref<number>): Truncation {
  const isTruncated = ref(false)
  const fullText = ref('')
  let observer: ResizeObserver | undefined
  let node: HTMLElement | null = null

  function measure(): void {
    if (!node || maxLines.value <= 0) {
      isTruncated.value = false
      fullText.value = ''
      return
    }
    fullText.value = node.textContent ?? ''
    if (maxLines.value === 1) {
      isTruncated.value = node.scrollWidth > node.clientWidth + 1
      return
    }
    let contentHeight = node.scrollHeight
    try {
      const range = node.ownerDocument.createRange()
      range.selectNodeContents(node)
      contentHeight = range.getBoundingClientRect().height
      range.detach()
    }
    catch {
      // Range 不可用时退回 scrollHeight。
    }
    isTruncated.value = contentHeight > node.clientHeight + 1
  }

  function bind(value: Element | null): void {
    observer?.disconnect()
    observer = undefined
    node = value instanceof HTMLElement ? value : null
    if (node && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => measure())
      observer.observe(node)
    }
    measure()
  }

  watch(maxLines, () => measure())
  onBeforeUnmount(() => observer?.disconnect())

  return { bind, isTruncated, fullText }
}
