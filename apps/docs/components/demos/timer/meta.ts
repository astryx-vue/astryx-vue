import type { DemoMeta } from '../../demo-infra/demoMeta'
import { timerOverview as demo } from './index'

export const meta = {
  slug: 'timer',
  group: 'Content',
  order: 14,
  en: 'Timer',
  zh: '计时',
  demo,
} satisfies DemoMeta
