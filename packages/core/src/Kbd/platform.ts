import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { isApplePlatform } from '../composables/internal/platform.js'

export { isApplePlatform }

/**
 * Reads the platform on the client only.
 *
 * The server and the first client render both answer `false`, so a
 * server-rendered shortcut hydrates without a mismatch and only then switches
 * to the platform-resolved keys.
 */
export function useIsApplePlatform(): Ref<boolean> {
  const isApple = ref(false)

  onMounted(() => {
    isApple.value = isApplePlatform()
  })

  return isApple
}
