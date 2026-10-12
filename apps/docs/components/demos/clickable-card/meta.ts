import type { DemoMeta } from '../../demo-infra/demoMeta'
import { clickableCardOverview as demo } from './index'

export const meta = {
  slug: 'clickable-card',
  group: 'Container',
  order: 2,
  en: 'Clickable Card',
  zh: '可点击卡片',
  demo,
} satisfies DemoMeta
