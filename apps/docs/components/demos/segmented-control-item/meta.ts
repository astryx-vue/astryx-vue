import type { DemoMeta } from '../../demo-infra/demoMeta'
import { segmentedControlItemOverview as demo } from './index'

export const meta = {
  slug: 'segmented-control-item',
  group: 'Action',
  order: 13,
  en: 'Segmented Control Item',
  zh: '分段控件项',
  demo,
} satisfies DemoMeta
