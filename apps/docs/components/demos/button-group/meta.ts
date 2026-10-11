import type { DemoMeta } from '../../demo-infra/demoMeta'
import { buttonGroupBasic as demo } from './index'

export const meta = {
  slug: 'button-group',
  group: 'action',
  order: 1,
  en: 'Button Group',
  zh: '按钮组',
  demo,
} satisfies DemoMeta
