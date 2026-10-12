import type { DemoMeta } from '../../demo-infra/demoMeta'
import { progressBarOverview as demo } from './index'

export const meta = {
  slug: 'progress-bar',
  group: 'Feedback & Status',
  order: 2,
  en: 'Progress Bar',
  zh: '进度条',
  demo,
} satisfies DemoMeta
