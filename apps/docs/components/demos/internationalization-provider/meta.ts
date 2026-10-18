import type { DemoMeta } from '../../demo-infra/demoMeta'
import { internationalizationProviderOverview as demo } from './index'

export const meta = {
  slug: 'internationalization-provider',
  group: 'Utility',
  order: 0,
  en: 'Internationalization Provider',
  zh: '国际化 Provider',
  demo,
} satisfies DemoMeta
