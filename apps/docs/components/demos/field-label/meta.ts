import type { DemoMeta } from '../../demo-infra/demoMeta'
import { fieldLabelOverview as demo } from './index'

export const meta = {
  slug: 'field-label',
  group: 'Form Controls',
  family: 'Field',
  order: 8,
  en: 'Field Label',
  zh: '字段标签',
  demo,
} satisfies DemoMeta
