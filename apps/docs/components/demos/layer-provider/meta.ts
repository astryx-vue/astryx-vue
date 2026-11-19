import type { DemoMeta } from '../../demo-infra/demoMeta'
import { layerProviderOverview as demo } from './index'

export const meta = {
  slug: 'layer-provider',
  group: 'Utility',
  family: 'Utilities',
  order: 1,
  en: 'Layer Provider',
  zh: '浮层 Provider',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
