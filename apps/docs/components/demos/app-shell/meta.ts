import type { DemoMeta } from '../../demo-infra/demoMeta'
import { appShellOverview as demo } from './index'

export const meta = {
  slug: 'app-shell',
  group: 'Layout',
  order: 4,
  en: 'App Shell',
  zh: '应用外壳',
  demo,
} satisfies DemoMeta
