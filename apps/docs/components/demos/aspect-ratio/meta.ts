import type { DemoMeta } from '../../demo-infra/demoMeta'
import { aspectRatioOverview as demo } from './index'

export const meta = {
  slug: 'aspect-ratio',
  group: 'Layout',
  order: 9,
  en: 'Aspect Ratio',
  zh: '宽高比',
  demo,
} satisfies DemoMeta
