import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tabListOverview as demo } from './index'

export const meta = {
  slug: 'tab-list',
  group: 'navigation',
  order: 2,
  en: 'Tab List',
  zh: '标签列表',
  demo,
} satisfies DemoMeta
