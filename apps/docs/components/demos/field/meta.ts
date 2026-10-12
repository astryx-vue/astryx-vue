import type { DemoMeta } from '../../demo-infra/demoMeta'
import { fieldOverview as demo } from './index'

export const meta = {
  slug: 'field',
  group: 'Form Controls',
  order: 7,
  en: 'Field',
  zh: '表单字段',
  demo,
} satisfies DemoMeta
