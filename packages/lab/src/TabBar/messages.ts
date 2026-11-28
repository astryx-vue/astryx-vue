import type { ComponentMessageDefaults } from '@astryx-vue/core'
import type { ComputedRef } from 'vue'
import { tabListMessages, useComponentMessages } from '@astryx-vue/core'
import { computed } from 'vue'

/** TabBar 的内置文案，命名空间是 `tabBar`。 */
export interface TabBarMessages {
  /** 标签超过五个时第五格「更多」标签的名字，也是它那份列表的无障碍名称。 */
  more: string
  /** 带角标的标签的无障碍名称。`{label}` 是标签名，`{badge}` 是角标或它的读法。 */
  badgedItem: string
}

export const tabBarMessages: Record<'en' | 'zh-CN', TabBarMessages> = {
  'en': { more: 'More', badgedItem: '{label}, {badge}' },
  'zh-CN': { more: '更多', badgedItem: '{label}，{badge}' },
}

/** TabBar 读到的文案：自己的命名空间，加上没给名字时标签列表用的默认名。 */
export interface ResolvedTabBarMessages extends TabBarMessages {
  tabListLabel: string
}

/**
 * 读 `tabBar` 命名空间的文案。外层 provider 的文案树里有这个命名空间时用树里的，
 * 否则按当前语言取内置的一份。标签列表的默认名和 core 的 TabList 共用 `tabList.label`。
 */
export function useTabBarMessages(): ComputedRef<ResolvedTabBarMessages> {
  // core 的 AstryxMessages 还没有 tabBar 这一项，这里按同样的读法单独声明它。
  const messages = useComponentMessages({
    tabBar: tabBarMessages,
    tabList: tabListMessages,
  } as unknown as ComponentMessageDefaults)
  return computed(() => {
    const tree = messages.value as unknown as { tabBar: TabBarMessages, tabList: { label: string } }
    return { ...tree.tabBar, tabListLabel: tree.tabList.label }
  })
}

/** 把 `{label}`、`{badge}` 这样的占位填进一条文案。 */
export function formatMessage(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
