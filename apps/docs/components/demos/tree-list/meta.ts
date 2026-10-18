import type { DemoMeta } from '../../demo-infra/demoMeta'
import { treeListOverview as demo } from './index'

export const meta = {
  slug: 'tree-list',
  group: 'Table & List',
  order: 11,
  en: 'Tree List',
  zh: '树形列表',
  demo,
} satisfies DemoMeta
