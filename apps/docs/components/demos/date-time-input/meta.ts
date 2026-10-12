import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dateTimeInputOverview as demo } from './index'

export const meta = {
  slug: 'date-time-input',
  group: 'Form Controls',
  order: 6,
  en: 'Date Time Input',
  zh: '日期时间输入框',
  demo,
} satisfies DemoMeta
