import type { DemoMeta } from '../../demo-infra/demoMeta'
import { avatarGroupOverview as demo } from './index'

export const meta = {
  slug: 'avatar-group',
  group: 'Content',
  order: 2,
  en: 'Avatar Group',
  zh: '头像组',
  demo,
} satisfies DemoMeta
