import type { DemoMeta } from '../../demo-infra/demoMeta'
import { gridSpanOverview as demo } from './index'

export const meta = {
  slug: 'grid-span',
  group: 'Layout',
  family: 'Layout',
  order: 3,
  en: 'Grid Span',
  zh: '网格跨列',
  demo,
} satisfies DemoMeta
