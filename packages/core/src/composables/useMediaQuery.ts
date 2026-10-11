import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'

/**
 * 订阅一条媒体查询。查询字符串变化时会重新订阅。
 * 服务端或没有 matchMedia 时返回 `serverDefault`。
 */
export function useMediaQuery(
  query: MaybeRefOrGetter<string | undefined>,
  serverDefault = false,
): Ref<boolean> {
  const matches = ref(serverDefault)
  let media: MediaQueryList | null = null

  function onChange(): void {
    matches.value = media?.matches ?? serverDefault
  }

  function stop(): void {
    media?.removeEventListener('change', onChange)
    media = null
  }

  function start(): void {
    stop()
    const value = toValue(query)
    if (value == null || value === '' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      matches.value = serverDefault
      return
    }
    media = window.matchMedia(value)
    matches.value = media.matches
    media.addEventListener('change', onChange)
  }

  watch(() => toValue(query), start, { immediate: true })
  onScopeDispose(stop)
  return matches
}
