import type { DemoMeta } from '../../demo-infra/demoMeta'
import { sideNavItemOverview as demo } from './index'

export const meta = {
  slug: 'side-nav-item',
  group: 'Navigation',
  family: 'Navigation',
  order: 10,
  en: 'Side Nav Item',
  zh: '侧边导航项',
  demo,
} satisfies DemoMeta
