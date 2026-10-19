import type { DemoMeta } from '../../demo-infra/demoMeta'
import { metadataListItemOverview as demo } from './index'

export const meta = {
  slug: 'metadata-list-item',
  group: 'Table & List',
  family: 'Metadata List',
  order: 3,
  en: 'Metadata List Item',
  zh: '元数据列表项',
  demo,
} satisfies DemoMeta
