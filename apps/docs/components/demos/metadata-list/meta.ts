import type { DemoMeta } from '../../demo-infra/demoMeta'
import { metadataListOverview as demo } from './index'

export const meta = {
  slug: 'metadata-list',
  group: 'Table & List',
  family: 'Metadata List',
  order: 2,
  en: 'Metadata List',
  zh: '元数据列表',
  demo,
} satisfies DemoMeta
