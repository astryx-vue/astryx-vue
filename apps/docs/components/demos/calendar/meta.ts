import type { DemoMeta } from '../../demo-infra/demoMeta'
import { calendarOverview as demo } from './index'

export const meta = {
  slug: 'calendar',
  group: 'form',
  order: 15,
  en: 'Calendar',
  zh: '日历',
  demo,
} satisfies DemoMeta
