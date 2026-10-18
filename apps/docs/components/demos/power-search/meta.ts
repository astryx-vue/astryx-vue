import type { DemoMeta } from '../../demo-infra/demoMeta'
import { powerSearchOverview as demo } from './index'

export const meta = {
  slug: 'power-search',
  group: 'Form Controls',
  order: 31,
  en: 'Power Search',
  zh: '结构化搜索',
  demo,
} satisfies DemoMeta
