import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

function readMatches(query: string): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return false
  return window.matchMedia(query).matches
}

/** 每条查询只挂一个监听，所有用到它的组件共用：一个页面里几百个组件读同一条查询时不会有几百个监听。 */
interface SharedQuery {
  list: MediaQueryList
  listeners: Set<(matches: boolean) => void>
  onChange: (event: MediaQueryListEvent) => void
}

/** 按 `window.matchMedia` 这个函数分开存：换了实现（测试里常见）就是另一套，不会拿到旧的监听。 */
const sharedByMatcher = new WeakMap<object, Map<string, SharedQuery>>()

function watchMediaQuery(query: string, listener: (matches: boolean) => void): () => void {
  let sharedQueries = sharedByMatcher.get(window.matchMedia)
  if (sharedQueries == null) {
    sharedQueries = new Map()
    sharedByMatcher.set(window.matchMedia, sharedQueries)
  }
  const queries = sharedQueries
  let shared = queries.get(query)
  if (shared == null) {
    const list = window.matchMedia(query)
    const created: SharedQuery = {
      list,
      listeners: new Set(),
      onChange: (event) => {
        for (const notify of created.listeners)
          notify(event.matches)
      },
    }
    list.addEventListener('change', created.onChange)
    queries.set(query, created)
    shared = created
  }
  const entry = shared
  entry.listeners.add(listener)
  listener(entry.list.matches)
  return () => {
    entry.listeners.delete(listener)
    if (entry.listeners.size === 0) {
      entry.list.removeEventListener('change', entry.onChange)
      queries.delete(query)
    }
  }
}

/**
 * 对应原版 Astryx 的 `hooks/useMediaQuery`。
 *
 * Tracks a CSS media query as a ref. The first value is read during setup so a
 * layout decision does not have to wait for mount, and changes are followed
 * while the component is alive. All callers of one query share one listener.
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(readMatches(query))
  let stop: (() => void) | null = null

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
      return
    stop = watchMediaQuery(query, (next) => {
      matches.value = next
    })
  })

  onBeforeUnmount(() => {
    stop?.()
    stop = null
  })

  return matches
}
