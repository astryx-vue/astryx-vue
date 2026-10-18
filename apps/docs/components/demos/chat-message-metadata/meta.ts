import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatMessageMetadataOverview as demo } from './index'

export const meta = {
  slug: 'chat-message-metadata',
  group: 'Chat',
  order: 9,
  en: 'Chat Message Metadata',
  zh: '对话消息元信息',
  demo,
} satisfies DemoMeta
