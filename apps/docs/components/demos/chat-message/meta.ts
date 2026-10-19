import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatMessageOverview as demo } from './index'

export const meta = {
  slug: 'chat-message',
  group: 'Chat',
  family: 'Chat',
  order: 3,
  en: 'Chat Message',
  zh: '对话消息',
  demo,
} satisfies DemoMeta
