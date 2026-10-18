import type { DemoMeta } from '../../demo-infra/demoMeta'
import { contextMenuItemOverview as demo } from './index'

export const meta = {
  slug: 'context-menu-item',
  group: 'Action',
  order: 3,
  en: 'Context Menu Item',
  zh: '上下文菜单项',
  demo,
} satisfies DemoMeta
