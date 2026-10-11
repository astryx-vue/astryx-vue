import type { DemoMeta } from '../../demo-infra/demoMeta'
import { bannerStatuses as demo } from './index'

export const meta = {
  slug: 'banner',
  group: 'feedback',
  order: 0,
  en: 'Banner',
  zh: '提示条',
  demo,
} satisfies DemoMeta
