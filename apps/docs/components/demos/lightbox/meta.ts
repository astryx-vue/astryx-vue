import type { DemoMeta } from '../../demo-infra/demoMeta'
import { lightboxOverview as demo } from './index'

export const meta = {
  slug: 'lightbox',
  group: 'Overlay',
  order: 9,
  en: 'Lightbox',
  zh: '灯箱',
  demo,
} satisfies DemoMeta
