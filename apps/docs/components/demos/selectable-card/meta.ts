import type { DemoMeta } from '../../demo-infra/demoMeta'
import { selectableCardOverview as demo } from './index'

export const meta = {
  slug: 'selectable-card',
  group: 'Container',
  order: 3,
  en: 'Selectable Card',
  zh: '可选卡片',
  demo,
} satisfies DemoMeta
