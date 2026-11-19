import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuRadioGroupOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu-radio-group',
  group: 'Action',
  family: 'Dropdown Menu',
  order: 18,
  en: 'Dropdown Menu Radio Group',
  zh: '下拉菜单单选组',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
