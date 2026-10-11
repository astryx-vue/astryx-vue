import type { DemoMeta } from '../../demo-infra/demoMeta'
import { hoverCardOverview as demo } from './index'

export const meta = {
  slug: 'hover-card',
  group: 'overlays',
  order: 4,
  en: 'Hover Card',
  zh: '悬浮卡片',
  demo,
} satisfies DemoMeta
