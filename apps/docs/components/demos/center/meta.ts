import type { DemoMeta } from '../../demo-infra/demoMeta'
import { centerOverview as demo } from './index'

export const meta = {
  slug: 'center',
  group: 'Layout',
  order: 0,
  en: 'Center',
  zh: '居中容器',
  demo,
} satisfies DemoMeta
