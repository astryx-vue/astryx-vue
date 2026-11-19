import type { DemoMeta } from '../../demo-infra/demoMeta'
import { hoverCardOverview as demo } from '../hover-card/index'

export const meta = {
  slug: 'use-hover-card',
  group: 'Utility',
  family: 'Hover Card',
  order: 112,
  en: 'useHoverCard',
  zh: 'useHoverCard',
  // 原版这个 hook 页顶部的预览和组件页是同一个 showcase。
  demo,
} satisfies DemoMeta
