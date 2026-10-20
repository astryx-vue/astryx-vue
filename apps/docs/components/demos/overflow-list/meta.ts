import type { DemoMeta } from '../../demo-infra/demoMeta'
import { overflowListOverview as demo } from './index'

export const meta = {
  slug: 'overflow-list',
  group: 'Table & List',
  order: 4,
  en: 'Overflow List',
  zh: '溢出列表',
  demo,
} satisfies DemoMeta
