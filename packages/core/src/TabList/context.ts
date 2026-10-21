import type { TabListContextValue } from './types.js'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

export const tabListContextKey = defineLayerScopedKey<TabListContextValue | null>('tabListContext', null)

/**
 * 读最近的 `TabList`。不在 `TabList` 里（包括被浮层边界截断的情况）就报错，
 * 报错方式和上游 `useTabListContext` 一致。
 */
export function useTabListContext(): TabListContextValue {
  const context = readLayerScoped(tabListContextKey)
  if (context == null)
    throw new Error('useTabListContext must be used within TabList. Wrap your Tab in <TabList>.')
  return context
}
