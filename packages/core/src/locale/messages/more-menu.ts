import type { AstryxLocale } from '../types.js'

export interface MoreMenuMessages {
  /** 「⋯」更多按钮的默认无障碍名。 */
  label: string
}

export const moreMenuMessages: Record<AstryxLocale, MoreMenuMessages> = {
  'en': { label: 'More options' },
  'zh-CN': { label: '更多选项' },
}
