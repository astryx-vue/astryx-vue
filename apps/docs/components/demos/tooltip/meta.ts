import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tooltipOverview as demo } from './index'

export const meta = {
  slug: 'tooltip',
  group: 'Overlay',
  order: 9,
  en: 'Tooltip',
  zh: '提示框',
  demo,
} satisfies DemoMeta
