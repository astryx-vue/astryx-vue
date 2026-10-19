import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatTokenizedTextOverview as demo } from './index'

export const meta = {
  slug: 'chat-tokenized-text',
  group: 'Chat',
  family: 'Chat',
  order: 8,
  en: 'Chat Tokenized Text',
  zh: '对话标记文本',
  demo,
} satisfies DemoMeta
