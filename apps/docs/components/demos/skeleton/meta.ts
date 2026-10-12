import type { DemoMeta } from '../../demo-infra/demoMeta'
import { skeletonOverview as demo } from './index'

export const meta = {
  slug: 'skeleton',
  group: 'Feedback & Status',
  order: 3,
  en: 'Skeleton',
  zh: '骨架屏',
  demo,
} satisfies DemoMeta
