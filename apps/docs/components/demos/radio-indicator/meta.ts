import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioIndicatorOverview as demo } from './index'

export const meta = {
  slug: 'radio-indicator',
  group: 'Indicator',
  order: 2,
  en: 'Radio Indicator',
  zh: '单选指示器',
  demo,
} satisfies DemoMeta
