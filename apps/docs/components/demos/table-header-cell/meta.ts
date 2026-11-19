import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableHeaderCellOverview as demo } from './index'

export const meta = {
  slug: 'table-header-cell',
  group: 'Table & List',
  family: 'Table',
  order: 10,
  en: 'Table Header Cell',
  zh: '表头单元格',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
