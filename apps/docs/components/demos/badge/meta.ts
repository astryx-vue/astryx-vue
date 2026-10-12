import type { DemoMeta } from '../../demo-infra/demoMeta'
import { badgeOverview as demo } from './index'

export const meta = {
  slug: 'badge',
  group: 'Feedback & Status',
  order: 0,
  en: 'Badge',
  zh: '徽标',
  demo,
} satisfies DemoMeta
