import type { DemoMeta } from '../../demo-infra/demoMeta'
import { drawerCard, drawerOverview } from './index'

export const meta = {
  slug: 'drawer',
  group: 'Overlay',
  family: 'Drawer',
  order: 19,
  en: 'Drawer',
  zh: '抽屉',
  demo: drawerOverview,
  cardDemo: drawerCard,
} satisfies DemoMeta
