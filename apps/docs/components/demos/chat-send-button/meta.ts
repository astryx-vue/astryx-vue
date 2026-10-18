import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatSendButtonOverview as demo } from './index'

export const meta = {
  slug: 'chat-send-button',
  group: 'Chat',
  order: 11,
  en: 'Chat Send Button',
  zh: '发送按钮',
  demo,
} satisfies DemoMeta
