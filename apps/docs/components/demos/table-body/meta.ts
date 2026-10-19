import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableBodyOverview as demo } from './index'

export const meta = {
  slug: 'table-body',
  group: 'Table & List',
  family: 'Table',
  order: 6,
  en: 'Table Body',
  zh: '表格主体',
  demo,
} satisfies DemoMeta
