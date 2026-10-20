import type { DemoMeta } from '../../demo-infra/demoMeta'
import { vStackOverview as demo } from './index'

export const meta = {
  slug: 'v-stack',
  group: 'Layout',
  family: 'Layout',
  order: 6,
  en: 'V Stack',
  zh: '垂直堆叠',
  demo,
} satisfies DemoMeta
