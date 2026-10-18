import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatToolCallsOverview as demo } from './index'

export const meta = {
  slug: 'chat-tool-calls',
  group: 'Chat',
  order: 4,
  en: 'Chat Tool Calls',
  zh: '对话工具调用',
  demo,
} satisfies DemoMeta
