import type { DemoMeta } from '../../demo-infra/demoMeta'
import { textAreaOverview as demo } from './index'

export const meta = {
  slug: 'text-area',
  group: 'form',
  order: 1,
  en: 'Text Area',
  zh: '文本域',
  demo,
} satisfies DemoMeta
