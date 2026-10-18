import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableCellOverview as demo } from './index'

export const meta = {
  slug: 'table-cell',
  group: 'Table & List',
  order: 7,
  en: 'Table Cell',
  zh: '表格单元格',
  demo,
} satisfies DemoMeta
