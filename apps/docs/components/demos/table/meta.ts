import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableOverview as demo } from './index'

export const meta = {
  slug: 'table',
  group: 'content',
  order: 12,
  en: 'Table',
  zh: '表格',
  demo,
} satisfies DemoMeta
