import type { DemoMeta } from '../../demo-infra/demoMeta'
import { sideNavCollapse as demo } from './index'

export const meta = {
  slug: 'side-nav',
  group: 'navigation',
  order: 5,
  en: 'Side Nav',
  zh: '侧边导航',
  demo,
} satisfies DemoMeta
