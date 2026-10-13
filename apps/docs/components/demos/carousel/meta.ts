import type { DemoMeta } from '../../demo-infra/demoMeta'
import { carouselOverview as demo } from './index'

export const meta = {
  slug: 'carousel',
  group: 'Container',
  order: 5,
  en: 'Carousel',
  zh: '轮播',
  demo,
} satisfies DemoMeta
