import type { DemoMeta } from '../../demo-infra/demoMeta'
import { emptyStateOverview as demo } from './index'

export const meta = {
  slug: 'empty-state',
  group: 'feedback',
  order: 5,
  en: 'Empty State',
  zh: '空状态',
  demo,
} satisfies DemoMeta
