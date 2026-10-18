import type { DemoMeta } from '../../demo-infra/demoMeta'
import { toggleButtonGroupOverview as demo } from './index'

export const meta = {
  slug: 'toggle-button-group',
  group: 'Action',
  order: 16,
  en: 'Toggle Button Group',
  zh: '切换按钮组',
  demo,
} satisfies DemoMeta
