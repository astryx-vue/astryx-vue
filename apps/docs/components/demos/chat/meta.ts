import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatConversation as demo } from './index'

export const meta = {
  slug: 'chat',
  group: 'content',
  order: 9,
  en: 'Chat',
  zh: '对话',
  demo,
} satisfies DemoMeta
