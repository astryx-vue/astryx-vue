import type { DemoMeta } from '../../demo-infra/demoMeta'
import { toggleButtonOverview as demo } from './index'

export const meta = {
  slug: 'toggle-button',
  group: 'action',
  order: 6,
  en: 'Toggle Button',
  zh: '切换按钮',
  demo,
} satisfies DemoMeta
