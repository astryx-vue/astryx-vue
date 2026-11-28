import type { DemoMeta } from '../../demo-infra/demoMeta'

export const meta = {
  slug: 'create-swipe',
  group: 'Utility',
  family: 'Utilities',
  order: 188,
  en: 'createSwipe',
  zh: 'createSwipe',
  // 和上游一样是个构造函数：列在工具里、紧挨着接它的值的行，不进组件总览。
  isHiddenFromOverview: true,
} satisfies DemoMeta
