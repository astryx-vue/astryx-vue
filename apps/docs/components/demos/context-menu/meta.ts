import type { DemoMeta } from '../../demo-infra/demoMeta'
import { contextMenuOverview as demo } from './index'

export const meta = {
  slug: 'context-menu',
  group: 'action',
  order: 4,
  en: 'Context Menu',
  zh: '上下文菜单',
  demo,
} satisfies DemoMeta
