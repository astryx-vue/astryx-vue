import type { DemoMeta } from '../../demo-infra/demoMeta'
import { hoverCardOverview as demo } from './index'

export const meta = {
  slug: 'hover-card',
  group: 'Overlay',
  family: 'Hover Card',
  order: 5,
  en: 'Hover Card',
  zh: '悬浮卡片',
  demo,
} satisfies DemoMeta
