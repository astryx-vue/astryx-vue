import type { DemoMeta } from '../../demo-infra/demoMeta'
import { citationOverview as demo } from './index'

export const meta = {
  slug: 'citation',
  group: 'Content',
  order: 3,
  en: 'Citation',
  zh: '引文',
  demo,
} satisfies DemoMeta
