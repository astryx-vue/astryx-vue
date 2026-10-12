import type { DemoMeta } from '../../demo-infra/demoMeta'
import { checkboxListOverview as demo } from './index'

export const meta = {
  slug: 'checkbox-list',
  group: 'form',
  order: 3,
  en: 'Checkbox List',
  zh: '复选列表',
  demo,
} satisfies DemoMeta
