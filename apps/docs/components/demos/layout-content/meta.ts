import type { DemoMeta } from '../../demo-infra/demoMeta'
import { layoutContentOverview as demo } from './index'

export const meta = {
  slug: 'layout-content',
  group: 'Layout',
  family: 'Layout',
  order: 15,
  en: 'Layout Content',
  zh: '布局正文',
  demo,
} satisfies DemoMeta
