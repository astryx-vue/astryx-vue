import type { DemoMeta } from '../../demo-infra/demoMeta'
import { checkIndicatorOverview as demo } from './index'

export const meta = {
  slug: 'check-indicator',
  group: 'Indicator',
  family: 'Indicator',
  order: 1,
  en: 'Check Indicator',
  zh: '勾选指示器',
  demo,
} satisfies DemoMeta
