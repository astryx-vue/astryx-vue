import type { DemoMeta } from '../../demo-infra/demoMeta'
import { sliderOverview as demo } from './index'

export const meta = {
  slug: 'slider',
  group: 'Form Controls',
  order: 12,
  en: 'Slider',
  zh: '滑块',
  demo,
} satisfies DemoMeta
