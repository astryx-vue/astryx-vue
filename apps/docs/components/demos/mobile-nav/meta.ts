import type { DemoMeta } from '../../demo-infra/demoMeta'
import { mobileNavOverview as demo } from './index'

export const meta = {
  slug: 'mobile-nav',
  group: 'Navigation',
  family: 'Navigation',
  order: 2,
  en: 'Mobile Nav',
  zh: '移动端导航',
  demo,
} satisfies DemoMeta
