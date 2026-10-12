import type { DemoMeta } from '../../demo-infra/demoMeta'
import { thumbnailOverview as demo } from './index'

export const meta = {
  slug: 'thumbnail',
  group: 'Content',
  order: 10,
  en: 'Thumbnail',
  zh: '缩略图',
  demo,
} satisfies DemoMeta
