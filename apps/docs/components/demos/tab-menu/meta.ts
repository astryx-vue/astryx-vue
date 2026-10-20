import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tabMenuOverview as demo } from './index'

export const meta = {
  slug: 'tab-menu',
  group: 'Navigation',
  family: 'Tabs',
  order: 25,
  en: 'Tab Menu',
  zh: '标签菜单',
  demo,
} satisfies DemoMeta
