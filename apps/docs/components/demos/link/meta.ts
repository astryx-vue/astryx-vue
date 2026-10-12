import type { DemoMeta } from '../../demo-infra/demoMeta'
import { linkOverview as demo } from './index'

export const meta = {
  slug: 'link',
  group: 'Action',
  order: 5,
  en: 'Link',
  zh: '链接',
  demo,
} satisfies DemoMeta
