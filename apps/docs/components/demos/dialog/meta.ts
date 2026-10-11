import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dialogOverview as demo } from './index'

export const meta = {
  slug: 'dialog',
  group: 'overlays',
  order: 2,
  en: 'Dialog',
  zh: '对话框',
  demo,
} satisfies DemoMeta
