import type { DemoMeta } from '../../demo-infra/demoMeta'
import { statusDotOverview as demo } from './index'

export const meta = {
  slug: 'status-dot',
  group: 'Feedback & Status',
  order: 5,
  en: 'Status Dot',
  zh: '状态点',
  demo,
} satisfies DemoMeta
