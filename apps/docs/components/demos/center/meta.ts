import type { DemoMeta } from '../../demo-infra/demoMeta'
import { centerBasic as demo } from './index'

export const meta = {
  slug: 'center',
  group: 'layout',
  order: 2,
  en: 'Center',
  zh: '居中容器',
  demo,
} satisfies DemoMeta
