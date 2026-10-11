import type { DemoMeta } from '../../demo-infra/demoMeta'
import { avatarGroupBasic as demo } from './index'

export const meta = {
  slug: 'avatar-group',
  group: 'content',
  order: 1,
  en: 'Avatar Group',
  zh: '头像组',
  demo,
} satisfies DemoMeta
