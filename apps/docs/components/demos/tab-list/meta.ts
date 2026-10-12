import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tabListOverview as demo } from './index'

export const meta = {
  slug: 'tab-list',
  group: 'Navigation',
  order: 6,
  en: 'Tab List',
  zh: '标签列表',
  demo,
} satisfies DemoMeta
