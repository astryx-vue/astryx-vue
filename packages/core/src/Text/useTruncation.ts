import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'
import { observeContent } from '../utils/sharedMutationObserver.js'
import { isResizeObserved, observeResize } from '../utils/sharedResizeObserver.js'

export type TruncateTooltip = boolean | 'above' | 'below' | 'start' | 'end'

/** `false` 关掉提示。`true` 和缺省都出现在上方。 */
export function truncatePlacement(value: TruncateTooltip | undefined): 'above' | 'below' | 'start' | 'end' | null {
  if (value === false)
    return null
  if (value == null || value === true)
    return 'above'
  return value
}

export interface Truncation {
  /** 绑到被测量的文字元素上（`:ref="truncation.bind"`）。换成别的元素时，旧元素的观察自动解除。 */
  bind: (value: Element | null) => void
  /** 文字此刻是否被截断。只在它为 true 时再去渲染显示全文的提示。 */
  isTruncated: Ref<boolean>
  /** 元素当前的全部文字，每次测量时更新；尺寸不变、只换了文字时也会跟上。 */
  fullText: Ref<string>
}

/**
 * 量文字有没有被截断：`maxLines` 为 1 比宽度，大于 1 用 Range 量真实高度
 * （`-webkit-line-clamp` 会把 scrollHeight 也夹成容器高度），0 不测量。
 *
 * 尺寸和内容的变化都走全页共用的 ResizeObserver / MutationObserver，
 * 一页几百个表格单元格也只有各一个观察者。新元素的第一次测量交给共用
 * ResizeObserver 的第一次通知，那是浏览器自己排版之后发的，挂载时不额外强制排版；
 * 元素已被别人观察、不会再有第一次通知时，改在渲染提交后的微任务里量。
 */
export function useTruncation(maxLines: MaybeRefOrGetter<number>): Truncation {
  const isTruncated = ref(false)
  const fullText = ref('')
  let release: (() => void) | undefined
  let node: HTMLElement | null = null

  function measure(element: HTMLElement): void {
    const lines = toValue(maxLines)
    if (lines <= 0) {
      isTruncated.value = false
      fullText.value = ''
      return
    }
    fullText.value = element.textContent ?? ''
    if (lines === 1) {
      isTruncated.value = element.scrollWidth > element.clientWidth + 1
      return
    }
    let contentHeight = element.scrollHeight
    try {
      const range = element.ownerDocument.createRange()
      range.selectNodeContents(element)
      contentHeight = range.getBoundingClientRect().height
      range.detach()
    }
    catch {
      // Range 不可用时退回 scrollHeight。
    }
    isTruncated.value = contentHeight > element.clientHeight + 1
  }

  function observe(element: HTMLElement): () => void {
    let isActive = true
    // 尺寸不变、只换了文字时没有 resize，靠内容观察跟上新文字和截断状态。
    const unobserveContent = observeContent(element, () => measure(element))
    let unobserveResize: (() => void) | undefined
    if (typeof ResizeObserver === 'undefined') {
      measure(element)
    }
    else {
      let isRegistered = false
      const wasObserved = isResizeObserved(element)
      unobserveResize = observeResize(element, () => {
        if (isRegistered)
          measure(element)
      })
      isRegistered = true
      if (wasObserved) {
        queueMicrotask(() => {
          if (isActive)
            measure(element)
        })
      }
    }
    return () => {
      isActive = false
      unobserveContent()
      unobserveResize?.()
    }
  }

  function bind(value: Element | null): void {
    const next = value instanceof HTMLElement ? value : null
    if (next === node && release != null)
      return
    release?.()
    release = undefined
    node = next
    if (node && toValue(maxLines) > 0) {
      release = observe(node)
      return
    }
    isTruncated.value = false
    fullText.value = ''
  }

  watch(() => toValue(maxLines), () => {
    const current = node
    release?.()
    release = undefined
    node = null
    bind(current)
  })
  onScopeDispose(() => release?.())

  return { bind, isTruncated, fullText }
}
