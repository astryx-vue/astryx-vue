import type { DemoMeta } from '../../demo-infra/demoMeta'
import { toastOverview as demo } from '../toast/index'

export const meta = {
  slug: 'use-toast',
  group: 'Utility',
  family: 'Toast',
  order: 153,
  en: 'useToast',
  zh: 'useToast',
  // 原版这个 hook 页顶部的预览和组件页是同一个 showcase。
  demo,
} satisfies DemoMeta
