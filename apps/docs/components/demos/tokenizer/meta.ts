import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tokenizerOverview as demo } from './index'

export const meta = {
  slug: 'tokenizer',
  group: 'Form Controls',
  order: 26,
  en: 'Tokenizer',
  zh: '标签输入框',
  demo,
} satisfies DemoMeta
