import type { DemoMeta } from '../../demo-infra/demoMeta'
import { avatarOverview as demo } from './index'

export const meta = {
  slug: 'avatar',
  group: 'Content',
  order: 0,
  en: 'Avatar',
  zh: '头像',
  demo,
} satisfies DemoMeta
