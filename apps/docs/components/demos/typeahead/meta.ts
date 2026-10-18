import type { DemoMeta } from '../../demo-infra/demoMeta'
import { typeaheadOverview as demo } from './index'

export const meta = {
  slug: 'typeahead',
  group: 'Form Controls',
  order: 27,
  en: 'Typeahead',
  zh: '自动补全',
  demo,
} satisfies DemoMeta
