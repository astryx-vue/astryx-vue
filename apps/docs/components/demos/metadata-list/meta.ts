import type { DemoMeta } from '../../demo-infra/demoMeta'
import { metadataListOverview as demo } from './index'

export const meta = {
  slug: 'metadata-list',
  group: 'Table & List',
  order: 1,
  en: 'Metadata List',
  zh: '元数据列表',
  demo,
} satisfies DemoMeta
