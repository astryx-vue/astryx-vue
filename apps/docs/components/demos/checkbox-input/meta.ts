import type { DemoMeta } from '../../demo-infra/demoMeta'
import { checkboxInputBasic as demo } from './index'

export const meta = {
  slug: 'checkbox-input',
  group: 'form',
  order: 2,
  en: 'Checkbox Input',
  zh: '复选框',
  demo,
} satisfies DemoMeta
