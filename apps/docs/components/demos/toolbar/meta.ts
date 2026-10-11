import type { DemoMeta } from '../../demo-infra/demoMeta'
import { toolbarOverview as demo } from './index'

export const meta = {
  slug: 'toolbar',
  group: 'navigation',
  order: 9,
  en: 'Toolbar',
  zh: '工具栏',
  demo,
} satisfies DemoMeta
