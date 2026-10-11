import type { DemoMeta } from '../../demo-infra/demoMeta'
import { numberInputOverview as demo } from './index'

export const meta = {
  slug: 'number-input',
  group: 'form',
  order: 11,
  en: 'Number Input',
  zh: '数字输入框',
  demo,
} satisfies DemoMeta
