import type { DemoMeta } from '../../demo-infra/demoMeta'
import { outlineOverview as demo } from './index'

export const meta = {
  slug: 'outline',
  group: 'Navigation',
  order: 8,
  en: 'Outline',
  zh: '大纲',
  demo,
} satisfies DemoMeta
