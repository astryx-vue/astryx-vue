import type { DemoMeta } from '../../demo-infra/demoMeta'
import { textInputBasic as demo } from './index'

export const meta = {
  slug: 'text-input',
  group: 'form',
  order: 0,
  en: 'Text Input',
  zh: '文本输入框',
  demo,
} satisfies DemoMeta
