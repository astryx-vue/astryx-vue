import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chartsLine as demo } from './index'

export const meta = {
  slug: 'chart',
  group: 'Data Visualization',
  order: 1,
  en: 'Chart',
  zh: '图表',
  demo,
} satisfies DemoMeta
