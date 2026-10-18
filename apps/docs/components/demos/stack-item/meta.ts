import type { DemoMeta } from '../../demo-infra/demoMeta'
import { stackItemOverview as demo } from './index'

export const meta = {
  slug: 'stack-item',
  group: 'Layout',
  order: 7,
  en: 'Stack Item',
  zh: '堆叠项',
  demo,
} satisfies DemoMeta
