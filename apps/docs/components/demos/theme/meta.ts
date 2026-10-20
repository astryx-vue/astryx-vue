import type { DemoMeta } from '../../demo-infra/demoMeta'
import { themeOverview as demo } from './index'

export const meta = {
  slug: 'theme',
  group: 'Utility',
  family: 'Utilities',
  order: 6,
  en: 'Theme',
  zh: '主题',
  demo,
} satisfies DemoMeta
