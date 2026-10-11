import type { DemoMeta } from '../../demo-infra/demoMeta'
import { tokenBasic as demo } from './index'

export const meta = {
  slug: 'token',
  group: 'feedback',
  order: 6,
  en: 'Token',
  zh: '词元',
  demo,
} satisfies DemoMeta
