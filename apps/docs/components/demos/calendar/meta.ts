import type { DemoMeta } from '../../demo-infra/demoMeta'
import { calendarOverview as demo } from './index'

export const meta = {
  slug: 'calendar',
  group: 'Form Controls',
  order: 0,
  en: 'Calendar',
  zh: '日历',
  demo,
} satisfies DemoMeta
