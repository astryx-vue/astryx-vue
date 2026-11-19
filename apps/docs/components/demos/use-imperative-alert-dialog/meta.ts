import type { DemoMeta } from '../../demo-infra/demoMeta'
import { alertDialogOverview as demo } from '../alert-dialog/index'

export const meta = {
  slug: 'use-imperative-alert-dialog',
  group: 'Utility',
  family: 'Dialog',
  order: 114,
  en: 'useImperativeAlertDialog',
  zh: 'useImperativeAlertDialog',
  // 原版这个 hook 页顶部的预览和组件页是同一个 showcase。
  demo,
} satisfies DemoMeta
