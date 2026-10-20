import type { DemoMeta } from '../../demo-infra/demoMeta'
import { checkboxListItemOverview as demo } from './index'

export const meta = {
  slug: 'checkbox-list-item',
  group: 'Form Controls',
  family: 'Checkbox',
  order: 3,
  en: 'Checkbox List Item',
  zh: '复选列表项',
  demo,
} satisfies DemoMeta
