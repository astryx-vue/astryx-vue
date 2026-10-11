import type { DemoMeta } from '../../demo-infra/demoMeta'
import { overlayBasic as demo } from './index'

export const meta = {
  slug: 'overlay',
  group: 'layout',
  order: 5,
  en: 'Overlay',
  zh: '覆盖层',
  demo,
} satisfies DemoMeta
