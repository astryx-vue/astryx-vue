import type { DemoMeta } from '../../demo-infra/demoMeta'
import { kbdOverview as demo } from './index'

export const meta = {
  slug: 'kbd',
  group: 'content',
  order: 5,
  en: 'Kbd',
  zh: '快捷键',
  demo,
} satisfies DemoMeta
