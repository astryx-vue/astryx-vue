import type { DemoMeta } from '../../demo-infra/demoMeta'
import { paginationOverview as demo } from './index'

export const meta = {
  slug: 'pagination',
  group: 'Navigation',
  order: 4,
  en: 'Pagination',
  zh: '分页',
  demo,
} satisfies DemoMeta
