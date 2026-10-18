import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatComposerOverview as demo } from './index'

export const meta = {
  slug: 'chat-composer',
  group: 'Chat',
  order: 10,
  en: 'Chat Composer',
  zh: '对话输入区',
  demo,
} satisfies DemoMeta
