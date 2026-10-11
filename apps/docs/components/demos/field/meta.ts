import type { DemoMeta } from '../../demo-infra/demoMeta'
import { fieldOverview as demo } from './index'

export const meta = {
  slug: 'field',
  group: 'form',
  order: 10,
  en: 'Field',
  zh: '表单字段',
  demo,
} satisfies DemoMeta
