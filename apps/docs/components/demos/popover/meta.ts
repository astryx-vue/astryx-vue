import type { DemoMeta } from '../../demo-infra/demoMeta'
import { popoverOverview as demo } from './index'

export const meta = {
  slug: 'popover',
  group: 'overlays',
  order: 1,
  en: 'Popover',
  zh: '弹出层',
  demo,
} satisfies DemoMeta
