import type { DemoMeta } from '../../demo-infra/demoMeta'
import { collapsibleOverview as demo } from './index'

export const meta = {
  slug: 'collapsible',
  group: 'Container',
  family: 'Collapsible',
  order: 1,
  en: 'Collapsible',
  zh: '折叠面板',
  demo,
} satisfies DemoMeta
