import type { DemoMeta } from '../../demo-infra/demoMeta'
import { spinnerOverview as demo } from './index'

export const meta = {
  slug: 'spinner',
  group: 'feedback',
  order: 3,
  en: 'Spinner',
  zh: '加载态',
  demo,
} satisfies DemoMeta
