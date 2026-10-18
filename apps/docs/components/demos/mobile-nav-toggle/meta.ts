import type { DemoMeta } from '../../demo-infra/demoMeta'
import { mobileNavToggleOverview as demo } from './index'

export const meta = {
  slug: 'mobile-nav-toggle',
  group: 'Navigation',
  order: 3,
  en: 'Mobile Nav Toggle',
  zh: '移动端导航开关',
  demo,
} satisfies DemoMeta
