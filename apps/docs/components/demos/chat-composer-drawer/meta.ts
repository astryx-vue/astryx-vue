import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatComposerDrawerOverview as demo } from './index'

export const meta = {
  slug: 'chat-composer-drawer',
  group: 'Chat',
  order: 13,
  en: 'Chat Composer Drawer',
  zh: '对话输入抽屉',
  demo,
} satisfies DemoMeta
