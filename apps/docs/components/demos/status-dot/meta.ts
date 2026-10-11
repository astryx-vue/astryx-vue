import type { DemoMeta } from '../../demo-infra/demoMeta'
import { statusDotVariants as demo } from './index'

export const meta = {
  slug: 'status-dot',
  group: 'feedback',
  order: 4,
  en: 'Status Dot',
  zh: '状态点',
  demo,
} satisfies DemoMeta
