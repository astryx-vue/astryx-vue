import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { watchMediaQuery } from '../composables/useMediaQuery.js'

/**
 * 页面根（`<html>`）画的那一种配色：根的 `color-scheme`，没有就看
 * `<meta name="color-scheme">`，都没有就是浅色。
 *
 * 根声明了两种（`light dark`）时是 null，由读者的偏好决定；
 * 读不到计算样式（没有布局引擎的环境）时也是 null。
 */
export type PageScheme = 'light' | 'dark' | null

/** `system` 模式跟谁：`root` 跟页面根的配色，`preference` 直接跟读者的偏好。 */
export type SystemScheme = 'root' | 'preference'

const STYLE_NODES = 'style, link[rel~="stylesheet"]'
const SCHEME_META = 'meta[name="color-scheme" i]'

/** 只写一种时是那一种，两种都写是 null，一种都没写是 undefined。 */
function oneScheme(schemes: string): PageScheme | undefined {
  const names = schemes.toLowerCase().split(/\s+/)
  const light = names.includes('light')
  const dark = names.includes('dark')
  if (light && dark)
    return null
  if (light || dark)
    return dark ? 'dark' : 'light'
  return undefined
}

/** 此刻页面根画的配色。 */
export function readRootScheme(): PageScheme {
  if (typeof document === 'undefined' || typeof window === 'undefined')
    return null
  const declared = window.getComputedStyle(document.documentElement).colorScheme as string | undefined
  if (declared == null || declared === '')
    return null
  if (declared !== 'normal')
    return oneScheme(declared) ?? null
  // 浏览器按第一个写了配色的 meta 来。
  for (const meta of document.querySelectorAll(SCHEME_META)) {
    const content = meta.getAttribute('content') ?? ''
    const fromMeta = oneScheme(content)
    if (fromMeta !== undefined)
      return fromMeta
    if (/(?:^|\s)normal(?:\s|$)/i.test(content))
      return 'light'
  }
  return 'light'
}

/** 这批变动会不会改变根的配色：根自己的属性、样式节点的内容、样式或 meta 节点增减。 */
function changesRootScheme(records: MutationRecord[]): boolean {
  return records.some((record) => {
    const target = record.target
    if (target === document.documentElement)
      return true
    const element = target instanceof Element ? target : target.parentElement
    if (element?.closest('style') != null)
      return true
    if (record.type === 'attributes')
      return element?.matches('link, style, meta') === true
    const watched = `${STYLE_NODES}, ${SCHEME_META}`
    return [...record.addedNodes, ...record.removedNodes].some(
      node => node instanceof Element && (node.matches(watched) || node.querySelector(watched) != null),
    )
  })
}

const listeners = new Set<() => void>()
let stopWatching: (() => void) | null = null

function notify(): void {
  for (const listener of listeners)
    listener()
}

function onStylesheetLoad(event: Event): void {
  if (event.target instanceof HTMLLinkElement)
    notify()
}

/** 全页面共用一个观察器，第一个订阅者来时启动，最后一个走时停掉。 */
function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (listeners.size === 1 && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((records) => {
      if (changesRootScheme(records))
        notify()
    })
    observer.observe(document.documentElement, { attributes: true })
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['href', 'media', 'disabled', 'rel', 'name', 'content'],
    })
    // 外链样式表在加载完才生效；load 不冒泡，用捕获接。
    document.addEventListener('load', onStylesheetLoad, true)
    // 根的配色靠媒体查询跟随读者时，读者偏好变了根也变，DOM 里没有任何动静。
    const stopPreference = typeof window.matchMedia === 'function'
      ? watchMediaQuery('(prefers-color-scheme: dark)', notify)
      : () => {}
    stopWatching = () => {
      observer.disconnect()
      document.removeEventListener('load', onStylesheetLoad, true)
      stopPreference()
    }
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      stopWatching?.()
      stopWatching = null
    }
  }
}

/**
 * 页面根画的配色，随页面变化。`watching` 为 false 时不读也不订阅；
 * 挂载前（服务端和 hydration 那一趟）一律是 null，和服务端算得一样。
 */
export function useRootScheme(watching: () => boolean): Ref<PageScheme> {
  const scheme = ref<PageScheme>(null)
  const mounted = ref(false)
  let unsubscribe: (() => void) | null = null

  function sync(): void {
    unsubscribe?.()
    unsubscribe = null
    if (!mounted.value || !watching()) {
      scheme.value = null
      return
    }
    scheme.value = readRootScheme()
    unsubscribe = subscribe(() => {
      scheme.value = readRootScheme()
    })
  }

  onMounted(() => {
    mounted.value = true
  })
  watch([mounted, watching], sync, { immediate: true })
  onBeforeUnmount(() => {
    mounted.value = false
    unsubscribe?.()
    unsubscribe = null
  })
  return scheme
}
