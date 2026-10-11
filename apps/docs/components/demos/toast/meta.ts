import type { DemoMeta } from '../../demo-infra/demoMeta'
import { toastOverview as demo } from './index'

export const meta = {
  slug: 'toast',
  group: 'overlays',
  order: 3,
  en: 'Toast',
  zh: '轻提示',
  demo,
} satisfies DemoMeta
