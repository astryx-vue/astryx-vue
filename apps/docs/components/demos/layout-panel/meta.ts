import type { DemoMeta } from '../../demo-infra/demoMeta'
import { layoutPanelOverview as demo } from './index'

export const meta = {
  slug: 'layout-panel',
  group: 'Layout',
  family: 'Layout',
  order: 12,
  en: 'Layout Panel',
  zh: '布局面板',
  demo,
} satisfies DemoMeta
