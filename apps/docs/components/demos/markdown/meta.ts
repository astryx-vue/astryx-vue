import type { DemoMeta } from '../../demo-infra/demoMeta'
import { markdownOverview as demo } from './index'

export const meta = {
  slug: 'markdown',
  group: 'Content',
  order: 8,
  en: 'Markdown',
  zh: 'Markdown',
  demo,
} satisfies DemoMeta
