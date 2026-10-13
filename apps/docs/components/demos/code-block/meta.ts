import type { DemoMeta } from '../../demo-infra/demoMeta'
import { codeBlockOverview as demo } from './index'

export const meta = {
  slug: 'code-block',
  group: 'Content',
  order: 13,
  en: 'Code Block',
  zh: '代码块',
  demo,
} satisfies DemoMeta
