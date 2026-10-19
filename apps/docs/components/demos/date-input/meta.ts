import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dateInputOverview as demo } from './index'

export const meta = {
  slug: 'date-input',
  group: 'Form Controls',
  family: 'Date Input',
  order: 4,
  en: 'Date Input',
  zh: '日期输入框',
  demo,
} satisfies DemoMeta
