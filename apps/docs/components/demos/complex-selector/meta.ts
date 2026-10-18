import type { DemoMeta } from '../../demo-infra/demoMeta'
import { complexSelectorOverview as demo } from './index'

export const meta = {
  slug: 'complex-selector',
  group: 'Form Controls',
  order: 30,
  en: 'Complex Selector',
  zh: '复合选择器',
  demo,
} satisfies DemoMeta
