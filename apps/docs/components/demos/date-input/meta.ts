import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dateInputBasic as demo } from './index'

export const meta = {
  slug: 'date-input',
  group: 'form',
  order: 14,
  en: 'Date Input',
  zh: '日期输入框',
  demo,
} satisfies DemoMeta
