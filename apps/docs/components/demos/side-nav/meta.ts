import type { DemoMeta } from '../../demo-infra/demoMeta'
import { sideNavOverview as demo } from './index'

export const meta = {
  slug: 'side-nav',
  group: 'Navigation',
  family: 'Navigation',
  order: 9,
  en: 'Side Nav',
  zh: '侧边导航',
  demo,
} satisfies DemoMeta
