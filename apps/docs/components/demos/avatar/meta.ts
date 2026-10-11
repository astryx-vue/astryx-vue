import type { DemoMeta } from '../../demo-infra/demoMeta'
import { avatarSizes as demo } from './index'

export const meta = {
  slug: 'avatar',
  group: 'content',
  order: 0,
  en: 'Avatar',
  zh: '头像',
  demo,
} satisfies DemoMeta
