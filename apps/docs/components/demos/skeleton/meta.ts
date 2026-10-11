import type { DemoMeta } from '../../demo-infra/demoMeta'
import { skeletonOverview as demo } from './index'

export const meta = {
  slug: 'skeleton',
  group: 'feedback',
  order: 2,
  en: 'Skeleton',
  zh: '骨架屏',
  demo,
} satisfies DemoMeta
