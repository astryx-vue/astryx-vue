import type { DemoMeta } from '../../demo-infra/demoMeta'
import { textAreaOverview as demo } from './index'

export const meta = {
  slug: 'text-area',
  group: 'Form Controls',
  order: 23,
  en: 'Text Area',
  zh: '文本域',
  demo,
} satisfies DemoMeta
