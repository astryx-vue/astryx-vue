import type { DemoMeta } from '../../demo-infra/demoMeta'
import { infoTipOverview as demo } from './index'

export const meta = {
  slug: 'info-tip',
  group: 'Overlay',
  family: 'InfoTip',
  order: 18,
  en: 'InfoTip',
  zh: '信息提示',
  demo,
} satisfies DemoMeta
