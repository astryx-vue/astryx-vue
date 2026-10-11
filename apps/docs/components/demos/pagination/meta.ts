import type { DemoMeta } from '../../demo-infra/demoMeta'
import { paginationBasic as demo } from './index'

export const meta = {
  slug: 'pagination',
  group: 'navigation',
  order: 3,
  en: 'Pagination',
  zh: '分页',
  demo,
} satisfies DemoMeta
