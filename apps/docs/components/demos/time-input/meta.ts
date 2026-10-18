import type { DemoMeta } from '../../demo-infra/demoMeta'
import { timeInputOverview as demo } from './index'

export const meta = {
  slug: 'time-input',
  group: 'Form Controls',
  order: 25,
  en: 'Time Input',
  zh: '时间输入框',
  demo,
} satisfies DemoMeta
