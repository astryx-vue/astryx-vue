import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

function readMatches(query: string): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return false
  return window.matchMedia(query).matches
}

/**
 * 对应原版 Astryx 的 `hooks/useMediaQuery`。
 *
 * Tracks a CSS media query as a ref. The first value is read during setup so a
 * layout decision does not have to wait for mount, and changes are followed
 * while the component is alive.
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(readMatches(query))
  let mediaQueryList: MediaQueryList | null = null

  function update(event: MediaQueryListEvent | MediaQueryList): void {
    matches.value = event.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
      return
    mediaQueryList = window.matchMedia(query)
    update(mediaQueryList)
    mediaQueryList.addEventListener('change', update)
  })

  onBeforeUnmount(() => {
    mediaQueryList?.removeEventListener('change', update)
  })

  return matches
}
