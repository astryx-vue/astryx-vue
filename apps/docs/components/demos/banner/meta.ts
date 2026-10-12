import type { DemoMeta } from '../../demo-infra/demoMeta'
import { bannerOverview as demo } from './index'

export const meta = {
  slug: 'banner',
  group: 'Feedback & Status',
  order: 1,
  en: 'Banner',
  zh: '提示条',
  demo,
} satisfies DemoMeta
