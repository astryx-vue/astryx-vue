import type { DemoMeta } from '../../demo-infra/demoMeta'
import { popoverOverview as demo } from '../popover/index'

export const meta = {
  slug: 'use-popover',
  group: 'Utility',
  family: 'Popover',
  order: 129,
  en: 'usePopover',
  zh: 'usePopover',
  // 原版这个 hook 页顶部的预览和组件页是同一个 showcase。
  demo,
} satisfies DemoMeta
