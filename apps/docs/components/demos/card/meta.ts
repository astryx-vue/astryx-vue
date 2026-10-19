import type { DemoMeta } from '../../demo-infra/demoMeta'
import { cardOverview as demo } from './index'

export const meta = {
  slug: 'card',
  group: 'Container',
  family: 'Card',
  order: 0,
  en: 'Card',
  zh: '卡片',
  demo,
} satisfies DemoMeta
