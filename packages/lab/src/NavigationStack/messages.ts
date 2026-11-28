import type { ComponentMessageDefaults } from '@astryx-vue/core'
import type { ComputedRef } from 'vue'
import { useComponentMessages } from '@astryx-vue/core'
import { computed } from 'vue'

/** NavigationStack 的内置文案，命名空间是 `navigationStack`。 */
export interface NavigationStackMessages {
  /** 前一屏没有标题时，返回按钮的名字。 */
  back: string
}

export const navigationStackMessages: Record<'en' | 'zh-CN', NavigationStackMessages> = {
  'en': { back: 'Back' },
  'zh-CN': { back: '返回' },
}

/**
 * 读 `navigationStack` 命名空间的文案。外层 provider 的文案树里有这个命名空间时用树里的，
 * 否则按当前语言取内置的一份。
 */
export function useNavigationStackMessages(): ComputedRef<NavigationStackMessages> {
  // core 的 AstryxMessages 还没有 navigationStack 这一项，这里按同样的读法单独声明它。
  const messages = useComponentMessages({ navigationStack: navigationStackMessages } as unknown as ComponentMessageDefaults)
  return computed(() => (messages.value as unknown as { navigationStack: NavigationStackMessages }).navigationStack)
}
