import type { DemoMeta } from '../../demo-infra/demoMeta'
import { radioIndicatorOverview as demo } from './index'

export const meta = {
  slug: 'radio-indicator',
  group: 'Indicator',
  family: 'Indicator',
  order: 3,
  en: 'Radio Indicator',
  zh: '单选指示器',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
