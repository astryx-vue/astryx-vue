import type { DemoMeta } from '../../demo-infra/demoMeta'
import { calendarBasic as demo } from './index'

export const meta = {
  slug: 'calendar',
  group: 'form',
  order: 17,
  en: 'Calendar',
  zh: '日历',
  demo,
} satisfies DemoMeta
