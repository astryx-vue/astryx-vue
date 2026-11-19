import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuRadioItemOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu-radio-item',
  group: 'Action',
  family: 'Dropdown Menu',
  order: 19,
  en: 'Dropdown Menu Radio Item',
  zh: '下拉菜单单选项',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
