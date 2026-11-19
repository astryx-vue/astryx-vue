import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tableBodyOverview as demo } from './index'

export const meta = {
  slug: 'table-body',
  group: 'Table & List',
  family: 'Table',
  order: 6,
  en: 'Table Body',
  zh: '表格主体',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
