import type { DemoMeta } from '../../demo-infra/demoMeta'
import { stepperOverview as demo } from './index'

export const meta = {
  slug: 'stepper',
  group: 'Navigation',
  order: 8,
  en: 'Stepper',
  zh: '步骤条',
  demo,
} satisfies DemoMeta
