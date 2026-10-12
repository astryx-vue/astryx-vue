import type { DemoMeta } from '../../demo-infra/demoMeta'
import { listOverview as demo } from './index'

export const meta = {
  slug: 'list',
  group: 'Table & List',
  order: 0,
  en: 'List',
  zh: '列表',
  demo,
} satisfies DemoMeta
