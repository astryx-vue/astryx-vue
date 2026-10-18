import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableOverview as demo } from './index'

export const meta = {
  slug: 'table',
  group: 'Table & List',
  order: 5,
  en: 'Table',
  zh: '表格',
  demo,
} satisfies DemoMeta
