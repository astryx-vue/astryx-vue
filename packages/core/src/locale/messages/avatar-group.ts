import type { AstryxLocale } from '../types.js'

export interface AvatarGroupMessages {
  /** 一排头像的默认无障碍名，使用者通常换成「团队成员」这类说法。 */
  label: string
  /** 可点的头像共用一个 Tab 停靠点时，读屏额外念的操作提示。 */
  keyboardHint: string
}

export const avatarGroupMessages: Record<AstryxLocale, AvatarGroupMessages> = {
  'en': {
    label: 'Avatars',
    keyboardHint: 'Use arrow keys to move between avatars',
  },
  'zh-CN': {
    label: '头像组',
    keyboardHint: '用方向键在头像之间切换',
  },
}
