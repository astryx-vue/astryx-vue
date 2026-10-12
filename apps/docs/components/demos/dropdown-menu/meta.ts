import type { DemoMeta } from '../../demo-infra/demoMeta'
import { dropdownMenuOverview as demo } from './index'

export const meta = {
  slug: 'dropdown-menu',
  group: 'Action',
  order: 3,
  en: 'Dropdown Menu',
  zh: '下拉菜单',
  demo,
} satisfies DemoMeta
