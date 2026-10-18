import type { DemoMeta } from '../../demo-infra/demoMeta'
import { listItemOverview as demo } from './index'

export const meta = {
  slug: 'list-item',
  group: 'Table & List',
  order: 1,
  en: 'List Item',
  zh: '列表项',
  demo,
} satisfies DemoMeta
