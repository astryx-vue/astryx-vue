import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableFooterOverview as demo } from './index'

export const meta = {
  slug: 'table-footer',
  group: 'Table & List',
  family: 'Table',
  order: 8,
  en: 'Table Footer',
  zh: '表格页脚',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
