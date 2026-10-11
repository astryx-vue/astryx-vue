import type { DemoMeta } from '../../demo-infra/demoMeta'
import { gridBasic as demo } from './index'

export const meta = {
  slug: 'grid',
  group: 'layout',
  order: 3,
  en: 'Grid',
  zh: '网格布局',
  demo,
} satisfies DemoMeta
