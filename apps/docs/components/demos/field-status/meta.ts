import type { DemoMeta } from '../../demo-infra/demoMeta'
import { fieldStatusOverview as demo } from './index'

export const meta = {
  slug: 'field-status',
  group: 'form',
  order: 10,
  en: 'Field Status',
  zh: '字段状态',
  demo,
} satisfies DemoMeta
