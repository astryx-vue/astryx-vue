import type { DemoMeta } from '../../demo-infra/demoMeta'
import { typeaheadOverview as demo } from './index'

export const meta = {
  slug: 'typeahead',
  group: 'form',
  order: 15,
  en: 'Typeahead',
  zh: '自动补全',
  demo,
} satisfies DemoMeta
