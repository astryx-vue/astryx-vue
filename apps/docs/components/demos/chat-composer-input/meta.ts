import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatComposerInputOverview as demo } from './index'

export const meta = {
  slug: 'chat-composer-input',
  group: 'Chat',
  family: 'Chat',
  order: 12,
  en: 'Chat Composer Input',
  zh: '对话输入框',
  demo,
} satisfies DemoMeta
