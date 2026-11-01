import type { DemoMeta } from '../../demo-infra/demoMeta'
import { richtextToolbar as demo } from './index'

export const meta = {
  slug: 'rich-text-editor',
  group: 'Form Controls',
  order: 32,
  en: 'Rich Text Editor',
  zh: '富文本编辑器',
  demo,
} satisfies DemoMeta
