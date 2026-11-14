import type { Ref } from 'vue'
import { watch } from 'vue'

/** Keep a ref equal to the latest value of a getter, written after commit. */
export function bindLatestRef<T>(source: () => T, target: Ref<T>): void {
  watch(source, (value) => {
    target.value = value
  }, { flush: 'post' })
}
