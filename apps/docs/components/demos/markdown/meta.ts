import type { DemoMeta } from '../../demo-infra/demoMeta'
import { markdownBasic as demo } from './index'

export const meta = {
  slug: 'markdown',
  group: 'content',
  order: 7,
  en: 'Markdown',
  zh: 'Markdown',
  demo,
} satisfies DemoMeta
