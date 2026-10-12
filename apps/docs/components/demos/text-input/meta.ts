import type { DemoMeta } from '../../demo-infra/demoMeta'
import { textInputOverview as demo } from './index'

export const meta = {
  slug: 'text-input',
  group: 'Form Controls',
  order: 20,
  en: 'Text Input',
  zh: '文本输入框',
  demo,
} satisfies DemoMeta
