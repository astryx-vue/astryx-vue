import type { ComputedRef } from 'vue'
import { computed, onMounted, onScopeDispose, shallowRef } from 'vue'

/** 粗指针（触摸）为 true。服务端和细指针设备为 false。 */
export function useCoarsePointer(): ComputedRef<boolean> {
  const coarse = shallowRef(false)
  let query: MediaQueryList | undefined

  function update(): void {
    coarse.value = query?.matches ?? false
  }

  onMounted(() => {
    query = window.matchMedia('(pointer: coarse)')
    update()
    query.addEventListener('change', update)
  })

  onScopeDispose(() => {
    query?.removeEventListener('change', update)
  })

  return computed(() => coarse.value)
}
