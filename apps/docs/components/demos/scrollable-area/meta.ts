import type { DemoMeta } from '../../demo-infra/demoMeta'
import { scrollableAreaOverview as demo } from './index'

export const meta = {
  slug: 'scrollable-area',
  group: 'Layout',
  order: 9,
  en: 'Scrollable Area',
  zh: '可滚动区域',
  demo,
} satisfies DemoMeta
