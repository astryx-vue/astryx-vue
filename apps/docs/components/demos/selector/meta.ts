import type { DemoMeta } from '../../demo-infra/demoMeta'
import { selectorOverview as demo } from './index'

export const meta = {
  slug: 'selector',
  group: 'Form Controls',
  family: 'Selector',
  order: 19,
  en: 'Selector',
  zh: '选择器',
  demo,
} satisfies DemoMeta
