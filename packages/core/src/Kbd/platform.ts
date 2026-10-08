import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'

interface UserAgentData {
  platform?: unknown
}

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: UserAgentData
}

/**
 * Whether the current platform is macOS or iOS.
 *
 * Prefers the User-Agent Client Hints API when it names a platform, and falls
 * back to `navigator.platform` when it names none. A platform that names
 * nothing (`''`, or the spec's `Unknown` sentinel) is treated as no answer
 * rather than as a negative one.
 */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined')
    return false

  const userAgentData = (navigator as NavigatorWithUserAgentData).userAgentData
  const named = typeof userAgentData?.platform === 'string' ? userAgentData.platform.trim() : ''

  if (named !== '' && named.toLowerCase() !== 'unknown')
    return /mac/i.test(named)

  return /Mac|iPhone|iPad|iPod/.test(navigator.platform ?? '')
}

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
