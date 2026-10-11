import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioGroupOverview as demo } from './index'

export const meta = {
  slug: 'radio-group',
  group: 'form',
  order: 6,
  en: 'Radio Group',
  zh: '单选组',
  demo,
} satisfies DemoMeta
