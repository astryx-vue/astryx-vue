import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatSystemMessageOverview as demo } from './index'

export const meta = {
  slug: 'chat-system-message',
  group: 'Chat',
  order: 7,
  en: 'Chat System Message',
  zh: '对话系统消息',
  demo,
} satisfies DemoMeta
