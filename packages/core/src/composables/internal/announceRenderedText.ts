import type { MaybeRefOrGetter, Ref } from 'vue'
import type { AnnouncePoliteness } from './announceChannel.js'
import { onMounted, onUpdated, toValue } from 'vue'
import { renderedText } from '../../Tooltip/renderedText.js'
import { useAnnouncer } from './announce.js'

/** 里面的东西自己会被读出来的容器：它们送出的内容不用再播一遍。 */
const LIVE_CONTAINER = '[aria-live="polite"], [aria-live="assertive"], [role="status"], [role="alert"], [role="log"]'

export interface AnnounceRenderedTextOptions {
  /**
   * 页面加载完成之前渲染或改变的内容保持安静，也不在已经挂着的 live 容器里重复播报。
   * 之后出现、或者文字之后又变了，播报一次。
   * @default false
   */
  skipFirstRender?: boolean
  /** @default 'polite' */
  politeness?: MaybeRefOrGetter<AnnouncePoliteness>
  /** 元素里没有可读文字时播报的名字。 */
  fallbackText?: MaybeRefOrGetter<string | undefined>
}

function isShown(element: HTMLElement): boolean {
  if (!element.isConnected)
    return false
  const probe = element as HTMLElement & { checkVisibility?: () => boolean }
  // 没有 checkVisibility 的引擎（Safari 17.4 之前）按可见处理：没有布局的环境对所有元素都说没有盒子。
  return typeof probe.checkVisibility === 'function' ? probe.checkVisibility() : true
}

function isDocumentLoaded(element: HTMLElement): boolean {
  return element.ownerDocument.readyState === 'complete'
}

/**
 * 把元素渲染出来的文字（读屏会念到的那些）通过共用的播报通道念一次。
 * 元素挂载后、以及它的文字之后变了才播报；相同的文字不重复念。
 * 需要在组件的 setup 里调用：用组件自己的挂载和更新钩子来看内容。
 */
export function useAnnounceRenderedText(
  target: Ref<HTMLElement | null>,
  enabled: MaybeRefOrGetter<boolean>,
  options: AnnounceRenderedTextOptions = {},
): void {
  const announce = useAnnouncer()
  let lastText: string | null = null

  function check(): void {
    const element = target.value
    if (element == null || !toValue(enabled)) {
      lastText = null
      return
    }
    if (options.skipFirstRender === true) {
      // 页面加载期间渲染的内容属于页面本身，读屏用户读页面时会读到。
      if (!isDocumentLoaded(element) || !isShown(element) || element.parentElement?.closest(LIVE_CONTAINER) != null) {
        lastText = null
        return
      }
    }
    let text = renderedText(element)
    if (text === '')
      text = toValue(options.fallbackText) ?? ''
    if (text === '') {
      lastText = null
      return
    }
    if (text === lastText)
      return
    lastText = text
    announce(text, toValue(options.politeness) ?? 'polite', { within: element })
  }

  onMounted(check)
  onUpdated(check)
}
