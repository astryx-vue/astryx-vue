import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuCheckboxItemOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu-checkbox-item',
  group: 'Action',
  family: 'Dropdown Menu',
  order: 17,
  en: 'Dropdown Menu Checkbox Item',
  zh: '下拉菜单勾选项',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
