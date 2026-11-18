import type { DemoMeta } from '../../demo-infra/demoMeta'
import { sizeContextOverview as demo } from './index'

export const meta = {
  slug: 'size-context',
  group: 'Utility',
  family: 'Utilities',
  order: 8,
  en: 'Size Context',
  zh: '尺寸 Context',
  demo,
} satisfies DemoMeta
