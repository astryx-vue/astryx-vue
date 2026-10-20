import type { DemoMeta } from '../../demo-infra/demoMeta'
import { buttonGroupOverview as demo } from './index'

export const meta = {
  slug: 'button-group',
  group: 'Action',
  family: 'Button',
  order: 1,
  en: 'Button Group',
  zh: '按钮组',
  demo,
} satisfies DemoMeta
