import type { DemoMeta } from '../../demo-infra/demoMeta'
import { segmentedControlOverview as demo } from './index'

export const meta = {
  slug: 'segmented-control',
  group: 'Action',
  order: 12,
  en: 'Segmented Control',
  zh: '分段控件',
  demo,
} satisfies DemoMeta
