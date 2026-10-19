import type { DemoMeta } from '../../demo-infra/demoMeta'
import { bottomSheetOverview as demo } from './index'

export const meta = {
  slug: 'bottom-sheet',
  group: 'Overlay',
  family: 'Bottom Sheet',
  order: 1,
  en: 'Bottom Sheet',
  zh: '底部弹窗',
  demo,
} satisfies DemoMeta
