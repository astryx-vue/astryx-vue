import type { DemoMeta } from '../../demo-infra/demoMeta'
import { textOverview as demo } from './index'

export const meta = {
  slug: 'text',
  group: 'Content',
  order: 9,
  en: 'Text',
  zh: '文本',
  demo,
} satisfies DemoMeta
