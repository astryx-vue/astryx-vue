import type { DemoMeta } from '../../demo-infra/demoMeta'
import { bottomSheetOverview as demo } from './index'

export const meta = {
  slug: 'bottom-sheet',
  group: 'overlays',
  order: 6,
  en: 'Bottom Sheet',
  zh: '底部弹窗',
  demo,
} satisfies DemoMeta
