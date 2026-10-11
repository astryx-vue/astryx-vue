import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioBasic as demo } from './index'

export const meta = {
  slug: 'radio',
  group: 'form',
  order: 5,
  en: 'Radio',
  zh: '单选按钮',
  demo,
} satisfies DemoMeta
