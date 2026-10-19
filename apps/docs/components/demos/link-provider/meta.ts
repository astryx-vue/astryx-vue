import type { DemoMeta } from '../../demo-infra/demoMeta'
import { linkProviderOverview as demo } from './index'

export const meta = {
  slug: 'link-provider',
  group: 'Utility',
  family: 'Utilities',
  order: 2,
  en: 'Link Provider',
  zh: '链接 Provider',
  demo,
} satisfies DemoMeta
