import type { DemoMeta } from '../../demo-infra/demoMeta'
import { typeaheadStatic as demo } from './index'

export const meta = {
  slug: 'typeahead',
  group: 'form',
  order: 17,
  en: 'Typeahead',
  zh: '自动补全',
  demo,
} satisfies DemoMeta
