import type { DemoMeta } from '../../demo-infra/demoMeta'
import { badgeOverview as demo } from './index'

export const meta = {
  slug: 'badge',
  group: 'feedback',
  order: 1,
  en: 'Badge',
  zh: '徽标',
  demo,
} satisfies DemoMeta
