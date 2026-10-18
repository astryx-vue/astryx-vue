import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatMessageListOverview as demo } from './index'

export const meta = {
  slug: 'chat-message-list',
  group: 'Chat',
  order: 5,
  en: 'Chat Message List',
  zh: '对话消息列表',
  demo,
} satisfies DemoMeta
