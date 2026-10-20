import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuGroupOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu-group',
  group: 'Action',
  family: 'Dropdown Menu',
  order: 6,
  en: 'Dropdown Menu Group',
  zh: '下拉菜单分组',
  demo,
} satisfies DemoMeta
