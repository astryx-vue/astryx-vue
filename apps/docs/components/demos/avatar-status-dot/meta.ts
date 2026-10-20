import type { DemoMeta } from '../../demo-infra/demoMeta'
import { avatarStatusDotOverview as demo } from './index'

export const meta = {
  slug: 'avatar-status-dot',
  group: 'Content',
  family: 'Avatar',
  order: 1,
  en: 'Avatar Status Dot',
  zh: '头像状态点',
  demo,
} satisfies DemoMeta
