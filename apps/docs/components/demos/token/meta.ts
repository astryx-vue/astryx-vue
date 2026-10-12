import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tokenOverview as demo } from './index'

export const meta = {
  slug: 'token',
  group: 'Content',
  order: 10,
  en: 'Token',
  zh: '标签',
  demo,
} satisfies DemoMeta
