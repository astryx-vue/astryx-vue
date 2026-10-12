import type { DemoMeta } from '../../demo-infra/demoMeta'
import { codeOverview as demo } from './index'

export const meta = {
  slug: 'code',
  group: 'Content',
  order: 4,
  en: 'Code',
  zh: '代码',
  demo,
} satisfies DemoMeta
