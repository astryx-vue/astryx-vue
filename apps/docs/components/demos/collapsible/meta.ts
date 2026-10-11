import type { DemoMeta } from '../../demo-infra/demoMeta'
import { collapsibleOverview as demo } from './index'

export const meta = {
  slug: 'collapsible',
  group: 'content',
  order: 8,
  en: 'Collapsible',
  zh: '折叠面板',
  demo,
} satisfies DemoMeta
