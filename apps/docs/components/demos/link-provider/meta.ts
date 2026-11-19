import type { DemoMeta } from '../../demo-infra/demoMeta'
import { linkProviderOverview as demo } from './index'

export const meta = {
  slug: 'link-provider',
  group: 'Utility',
  family: 'Utilities',
  order: 2,
  en: 'Link Provider',
  zh: '链接 Provider',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
