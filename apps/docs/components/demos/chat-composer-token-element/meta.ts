import type { DemoMeta } from '../../demo-infra/demoMeta'
import { chatComposerTokenElementOverview as demo } from './index'

export const meta = {
  slug: 'chat-composer-token-element',
  group: 'Chat',
  family: 'Chat',
  order: 15,
  en: 'Chat Composer Token Element',
  zh: '对话标签元素',
  // 原版这个组件页没有顶部预览，只在总览卡片里用。
  cardDemo: demo,
} satisfies DemoMeta
