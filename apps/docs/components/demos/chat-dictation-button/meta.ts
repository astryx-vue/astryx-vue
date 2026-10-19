import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatDictationButtonOverview as demo } from './index'

export const meta = {
  slug: 'chat-dictation-button',
  group: 'Chat',
  family: 'Chat',
  order: 14,
  en: 'Chat Dictation Button',
  zh: '语音输入按钮',
  demo,
} satisfies DemoMeta
