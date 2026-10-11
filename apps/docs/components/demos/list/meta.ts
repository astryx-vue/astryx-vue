import type { DemoMeta } from '../../demo-infra/demoMeta'
import { listBasic as demo } from './index'

export const meta = {
  slug: 'list',
  group: 'content',
  order: 6,
  en: 'List',
  zh: '列表',
  demo,
} satisfies DemoMeta
