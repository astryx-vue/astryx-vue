import type { DemoMeta } from '../../demo-infra/demoMeta'
import { segmentedControlBasic as demo } from './index'

export const meta = {
  slug: 'segmented-control',
  group: 'form',
  order: 16,
  en: 'Segmented Control',
  zh: '分段控件',
  demo,
} satisfies DemoMeta
