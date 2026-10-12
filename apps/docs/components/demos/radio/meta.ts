import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioOverview as demo } from './index'

export const meta = {
  slug: 'radio',
  group: 'Form Controls',
  order: 8,
  en: 'Radio',
  zh: '单选按钮',
  demo,
} satisfies DemoMeta
