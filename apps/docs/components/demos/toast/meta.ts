import type { DemoMeta } from '../../demo-infra/demoMeta'
import { toastOverview as demo } from './index'

export const meta = {
  slug: 'toast',
  group: 'Overlay',
  order: 6,
  en: 'Toast',
  zh: '轻提示',
  demo,
} satisfies DemoMeta
