import type { DemoMeta } from '../../demo-infra/demoMeta'
import { multiSelectorBadges as demo } from './index'

export const meta = {
  slug: 'multi-selector',
  group: 'form',
  order: 18,
  en: 'Multi Selector',
  zh: '多选器',
  demo,
} satisfies DemoMeta
