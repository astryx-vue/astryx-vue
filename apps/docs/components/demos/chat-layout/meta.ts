import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatLayoutOverview as demo } from './index'

export const meta = {
  slug: 'chat-layout',
  group: 'Chat',
  order: 1,
  en: 'Chat Layout',
  zh: '对话布局',
  demo,
} satisfies DemoMeta
