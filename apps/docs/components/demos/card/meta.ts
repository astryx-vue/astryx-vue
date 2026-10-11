import type { DemoMeta } from '../../demo-infra/demoMeta'
import { cardBasic as demo } from './index'

export const meta = {
  slug: 'card',
  group: 'layout',
  order: 4,
  en: 'Card',
  zh: '卡片',
  demo,
} satisfies DemoMeta
