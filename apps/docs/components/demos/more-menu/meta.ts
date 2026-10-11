import type { DemoMeta } from '../../demo-infra/demoMeta'
import { moreMenuOverview as demo } from './index'

export const meta = {
  slug: 'more-menu',
  group: 'action',
  order: 5,
  en: 'More Menu',
  zh: '更多菜单',
  demo,
} satisfies DemoMeta
