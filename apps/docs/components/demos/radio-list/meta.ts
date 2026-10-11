import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioList as demo } from '../radio'

export const meta = {
  slug: 'radio-list',
  group: 'form',
  order: 7,
  en: 'Radio List',
  zh: '单选列表',
  demo,
} satisfies DemoMeta
