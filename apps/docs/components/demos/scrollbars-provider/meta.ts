import type { DemoMeta } from '../../demo-infra/demoMeta'
import { scrollbarsProviderOverview as demo } from './index'

export const meta = {
  slug: 'scrollbars-provider',
  group: 'Utility',
  family: 'Utilities',
  order: 7,
  en: 'Scrollbars Provider',
  zh: '滚动条 Provider',
  demo,
} satisfies DemoMeta
