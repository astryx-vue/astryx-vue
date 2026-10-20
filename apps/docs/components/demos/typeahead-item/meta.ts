import type { DemoMeta } from '../../demo-infra/demoMeta'
import { typeaheadItemOverview as demo } from './index'

export const meta = {
  slug: 'typeahead-item',
  group: 'Form Controls',
  family: 'Typeahead',
  order: 29,
  en: 'Typeahead Item',
  zh: '自动补全项',
  demo,
} satisfies DemoMeta
