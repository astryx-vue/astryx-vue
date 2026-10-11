import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioBasic as demo } from '../radio'

export const meta = {
  slug: 'radio-group',
  group: 'form',
  order: 6,
  en: 'Radio Group',
  zh: '单选组',
  demo,
} satisfies DemoMeta
