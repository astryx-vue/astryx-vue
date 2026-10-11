import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dividerOverview as demo } from './index'

export const meta = {
  slug: 'divider',
  group: 'layout',
  order: 1,
  en: 'Divider',
  zh: '分隔线',
  demo,
} satisfies DemoMeta
