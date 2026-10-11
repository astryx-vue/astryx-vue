import type { DemoMeta } from '../../demo-infra/demoMeta'
import { progressBarBasic as demo } from './index'

export const meta = {
  slug: 'progress-bar',
  group: 'form',
  order: 4,
  en: 'Progress Bar',
  zh: '进度条',
  demo,
} satisfies DemoMeta
