import type { DemoMeta } from '../../demo-infra/demoMeta'
import { checkIndicatorOverview as demo } from './index'

export const meta = {
  slug: 'check-indicator',
  group: 'Indicator',
  family: 'Indicator',
  order: 1,
  en: 'Check Indicator',
  zh: '勾选指示器',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
