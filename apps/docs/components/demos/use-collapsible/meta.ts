import type { DemoMeta } from '../../demo-infra/demoMeta'
import { collapsibleOverview as demo } from '../collapsible/index'

export const meta = {
  slug: 'use-collapsible',
  group: 'Utility',
  family: 'Collapsible',
  order: 104,
  en: 'useCollapsible',
  zh: 'useCollapsible',
  // 原版这个 hook 页顶部的预览和组件页是同一个 showcase。
  demo,
} satisfies DemoMeta
