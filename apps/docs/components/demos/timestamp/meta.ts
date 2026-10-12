import type { DemoMeta } from '../../demo-infra/demoMeta'
import { timestampOverview as demo } from './index'

export const meta = {
  slug: 'timestamp',
  group: 'Content',
  order: 11,
  en: 'Timestamp',
  zh: '时间戳',
  demo,
} satisfies DemoMeta
