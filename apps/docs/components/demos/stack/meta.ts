import type { DemoMeta } from '../../demo-infra/demoMeta'
import { stackOverview as demo } from './index'

export const meta = {
  slug: 'stack',
  group: 'Layout',
  order: 3,
  en: 'Stack',
  zh: '堆叠布局',
  demo,
} satisfies DemoMeta
