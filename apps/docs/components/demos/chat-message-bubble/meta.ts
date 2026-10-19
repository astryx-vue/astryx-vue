import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatMessageBubbleOverview as demo } from './index'

export const meta = {
  slug: 'chat-message-bubble',
  group: 'Chat',
  family: 'Chat',
  order: 6,
  en: 'Chat Message Bubble',
  zh: '对话消息气泡',
  demo,
} satisfies DemoMeta
