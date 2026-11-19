import type { DemoMeta } from '../../demo-infra/demoMeta'
import { internationalizationProviderOverview as demo } from './index'

export const meta = {
  slug: 'internationalization-provider',
  group: 'Utility',
  family: 'Utilities',
  order: 0,
  en: 'Internationalization Provider',
  zh: '国际化 Provider',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
