import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioListOverview as demo } from './index'

export const meta = {
  slug: 'radio-list',
  group: 'form',
  order: 7,
  en: 'Radio List',
  zh: '单选列表',
  demo,
} satisfies DemoMeta
