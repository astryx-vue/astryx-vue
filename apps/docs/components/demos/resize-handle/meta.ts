import type { DemoMeta } from '../../demo-infra/demoMeta'
import { resizeHandleOverview as demo } from './index'

export const meta = {
  slug: 'resize-handle',
  group: 'Layout',
  family: 'Resizable',
  order: 16,
  en: 'Resize Handle',
  zh: '拖拽分隔条',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
