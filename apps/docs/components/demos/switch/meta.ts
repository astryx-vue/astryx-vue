import type { DemoMeta } from '../../demo-infra/demoMeta'
import { switchOverview as demo } from './index'

export const meta = {
  slug: 'switch',
  group: 'form',
  order: 8,
  en: 'Switch',
  zh: '开关',
  demo,
} satisfies DemoMeta
