import type { InjectionKey } from 'vue'
import type { TabListContextValue } from './types.js'
import { inject } from 'vue'

export const tabListContextKey: InjectionKey<TabListContextValue | null> = Symbol('tabListContext')

/**
 * 读最近的 `TabList`。不在 `TabList` 里（包括被浮层边界截断的情况）就报错，
 * 报错方式和上游 `useTabListContext` 一致。
 */
export function useTabListContext(): TabListContextValue {
  const context = inject(tabListContextKey, null)
  if (context == null)
    throw new Error('useTabListContext must be used within TabList. Wrap your Tab in <TabList>.')
  return context
}
