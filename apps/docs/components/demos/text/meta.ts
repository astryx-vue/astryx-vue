import type { DemoMeta } from '../../demo-infra/demoMeta'
import { textTypes as demo } from './index'

export const meta = {
  slug: 'text',
  group: 'content',
  order: 4,
  en: 'Text',
  zh: '文本',
  demo,
} satisfies DemoMeta
