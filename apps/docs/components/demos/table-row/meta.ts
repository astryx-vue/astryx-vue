import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableRowOverview as demo } from './index'

export const meta = {
  slug: 'table-row',
  group: 'Table & List',
  order: 9,
  en: 'Table Row',
  zh: '表格行',
  demo,
} satisfies DemoMeta
