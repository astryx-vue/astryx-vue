import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuItemOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu-item',
  group: 'Action',
  family: 'Dropdown Menu',
  order: 5,
  en: 'Dropdown Menu Item',
  zh: '下拉菜单项',
  demo,
} satisfies DemoMeta
