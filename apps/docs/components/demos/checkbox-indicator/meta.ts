import type { DemoMeta } from '../../demo-infra/demoMeta'
import { checkboxIndicatorOverview as demo } from './index'

export const meta = {
  slug: 'checkbox-indicator',
  group: 'Indicator',
  family: 'Indicator',
  order: 0,
  en: 'Checkbox Indicator',
  zh: '复选指示器',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
