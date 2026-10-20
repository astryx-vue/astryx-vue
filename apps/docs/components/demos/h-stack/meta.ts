import type { DemoMeta } from '../../demo-infra/demoMeta'
import { hStackOverview as demo } from './index'

export const meta = {
  slug: 'h-stack',
  group: 'Layout',
  family: 'Layout',
  order: 5,
  en: 'H Stack',
  zh: '水平堆叠',
  demo,
} satisfies DemoMeta
