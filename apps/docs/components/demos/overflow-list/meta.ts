import type { DemoMeta } from '../../demo-infra/demoMeta'
import { overflowListBasic as demo } from './index'

export const meta = {
  slug: 'overflow-list',
  group: 'navigation',
  order: 10,
  en: 'Overflow List',
  zh: '溢出列表',
  demo,
} satisfies DemoMeta
