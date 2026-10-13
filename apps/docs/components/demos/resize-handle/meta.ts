import type { DemoMeta } from '../../demo-infra/demoMeta'
import { resizeHandleOverview as demo } from './index'

export const meta = {
  slug: 'resize-handle',
  group: 'Layout',
  order: 8,
  en: 'Resize Handle',
  zh: '拖拽分隔条',
  demo,
} satisfies DemoMeta
