import type { DemoMeta } from '../../demo-infra/demoMeta'
import { switchOverview as demo } from './index'

export const meta = {
  slug: 'switch',
  group: 'Form Controls',
  order: 22,
  en: 'Switch',
  zh: '开关',
  demo,
} satisfies DemoMeta
