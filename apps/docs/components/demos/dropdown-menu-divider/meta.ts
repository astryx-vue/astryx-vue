import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuDividerOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu-divider',
  group: 'Action',
  family: 'Dropdown Menu',
  order: 7,
  en: 'Dropdown Menu Divider',
  zh: '下拉菜单分隔线',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
