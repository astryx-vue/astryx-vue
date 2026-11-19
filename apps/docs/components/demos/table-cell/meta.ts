import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableCellOverview as demo } from './index'

export const meta = {
  slug: 'table-cell',
  group: 'Table & List',
  family: 'Table',
  order: 7,
  en: 'Table Cell',
  zh: '表格单元格',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
