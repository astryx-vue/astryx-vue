import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioGroupOverview as demo } from './index'

export const meta = {
  slug: 'radio-group',
  group: 'Form Controls',
  family: 'Radio',
  order: 16,
  en: 'Radio Group',
  zh: '单选组',
  demo,
} satisfies DemoMeta
