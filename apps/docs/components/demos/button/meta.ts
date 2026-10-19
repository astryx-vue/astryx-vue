import type { DemoMeta } from '../../demo-infra/demoMeta'
import { buttonOverview as demo } from './index'

export const meta = {
  slug: 'button',
  group: 'Action',
  family: 'Button',
  order: 0,
  en: 'Button',
  zh: '按钮',
  demo,
} satisfies DemoMeta
