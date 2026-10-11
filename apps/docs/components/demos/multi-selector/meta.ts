import type { DemoMeta } from '../../demo-infra/demoMeta'
import { multiSelectorOverview as demo } from './index'

export const meta = {
  slug: 'multi-selector',
  group: 'form',
  order: 14,
  en: 'Multi Selector',
  zh: '多选器',
  demo,
} satisfies DemoMeta
