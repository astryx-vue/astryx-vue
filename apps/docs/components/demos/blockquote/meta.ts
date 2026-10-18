import type { DemoMeta } from '../../demo-infra/demoMeta'
import { blockquoteOverview as demo } from './index'

export const meta = {
  slug: 'blockquote',
  group: 'Content',
  order: 4,
  en: 'Blockquote',
  zh: '引用',
  demo,
} satisfies DemoMeta
