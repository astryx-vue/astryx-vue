import type { DemoMeta } from '../../demo-infra/demoMeta'
import { itemOverview as demo } from './index'

export const meta = {
  slug: 'item',
  group: 'Indicator',
  order: 2,
  en: 'Item',
  zh: '条目',
  demo,
} satisfies DemoMeta
