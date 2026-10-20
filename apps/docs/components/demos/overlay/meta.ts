import type { DemoMeta } from '../../demo-infra/demoMeta'
import { overlayOverview as demo } from './index'

export const meta = {
  slug: 'overlay',
  group: 'Overlay',
  order: 6,
  en: 'Overlay',
  zh: '覆盖层',
  demo,
} satisfies DemoMeta
