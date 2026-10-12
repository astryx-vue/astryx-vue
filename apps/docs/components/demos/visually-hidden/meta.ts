import type { DemoMeta } from '../../demo-infra/demoMeta'
import { visuallyHiddenOverview as demo } from './index'

export const meta = {
  slug: 'visually-hidden',
  group: 'Utility',
  order: 0,
  en: 'Visually Hidden',
  zh: '视觉隐藏',
  demo,
} satisfies DemoMeta
