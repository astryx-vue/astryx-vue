import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dateRangeInputOverview as demo } from './index'

export const meta = {
  slug: 'date-range-input',
  group: 'form',
  order: 16,
  en: 'Date Range Input',
  zh: '日期区间输入框',
  demo,
} satisfies DemoMeta
