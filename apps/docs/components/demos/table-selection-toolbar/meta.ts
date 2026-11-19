import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableSelectionToolbarOverview as demo } from './index'

export const meta = {
  slug: 'table-selection-toolbar',
  group: 'Table & List',
  family: 'Table',
  order: 12,
  en: 'Table Selection Toolbar',
  zh: '表格选择工具栏',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
