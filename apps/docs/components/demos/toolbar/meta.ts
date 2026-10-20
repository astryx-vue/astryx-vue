import type { DemoMeta } from '../../demo-infra/demoMeta'
import { toolbarOverview as demo } from './index'

export const meta = {
  slug: 'toolbar',
  group: 'Action',
  order: 15,
  en: 'Toolbar',
  zh: '工具栏',
  demo,
} satisfies DemoMeta
