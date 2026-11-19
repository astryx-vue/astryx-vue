import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableHeaderOverview as demo } from './index'

export const meta = {
  slug: 'table-header',
  group: 'Table & List',
  family: 'Table',
  order: 9,
  en: 'Table Header',
  zh: '表格表头',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
