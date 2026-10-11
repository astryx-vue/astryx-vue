import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tokenizerOverview as demo } from './index'

export const meta = {
  slug: 'tokenizer',
  group: 'form',
  order: 19,
  en: 'Tokenizer',
  zh: '标签输入框',
  demo,
} satisfies DemoMeta
