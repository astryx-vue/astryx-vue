import type { DemoMeta } from '../../demo-infra/demoMeta'
import { stepOverview as demo } from './index'

export const meta = {
  slug: 'step',
  group: 'Navigation',
  order: 24,
  en: 'Step',
  zh: '步骤',
  demo,
} satisfies DemoMeta
