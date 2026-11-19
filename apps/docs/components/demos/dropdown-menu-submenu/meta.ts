import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuSubMenuOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu-submenu',
  group: 'Action',
  family: 'Dropdown Menu',
  order: 8,
  en: 'Dropdown Menu Submenu',
  zh: '下拉菜单子菜单',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
