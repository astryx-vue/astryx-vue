import type { DemoMeta } from '../../demo-infra/demoMeta'
import { gridOverview as demo } from './index'

export const meta = {
  slug: 'grid',
  group: 'Layout',
  family: 'Layout',
  order: 2,
  en: 'Grid',
  zh: '网格布局',
  demo,
} satisfies DemoMeta
