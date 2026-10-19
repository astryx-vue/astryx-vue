import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tabOverview as demo } from './index'

export const meta = {
  slug: 'tab',
  group: 'Navigation',
  family: 'Tabs',
  order: 15,
  en: 'Tab',
  zh: '标签',
  demo,
} satisfies DemoMeta
