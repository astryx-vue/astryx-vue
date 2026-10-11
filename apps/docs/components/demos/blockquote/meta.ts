import type { DemoMeta } from '../../demo-infra/demoMeta'
import { blockquoteCite as demo } from './index'

export const meta = {
  slug: 'blockquote',
  group: 'content',
  order: 2,
  en: 'Blockquote',
  zh: '引用',
  demo,
} satisfies DemoMeta
