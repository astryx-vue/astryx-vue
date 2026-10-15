import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'

export type HandleRef<T> = Ref<T | null> | ((handle: T | null) => void)

function publish<T>(target: HandleRef<T> | undefined, handle: T | null): void {
  if (target == null)
    return
  if (typeof target === 'function')
    target(handle)
  else
    target.value = handle
}

/** Keeps an imperative handle on a ref or a callback, and clears it when the owner goes away. */
export function useHandleRef<T extends object>(read: () => HandleRef<T> | undefined, handle: T): void {
  watch(read, (_next, previous) => {
    if (previous != null && previous !== read())
      publish(previous, null)
    publish(read(), handle)
  }, { immediate: true })

  onBeforeUnmount(() => publish(read(), null))
}
