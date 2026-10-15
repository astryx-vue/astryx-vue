import type { AstryxLocale } from '../types.js'

export interface KeyboardHintMessages {
  /** 方向键提示里，按键后面的那句说明。 */
  navigate: string
}

export const keyboardHintMessages: Record<AstryxLocale, KeyboardHintMessages> = {
  'en': {
    navigate: 'to navigate',
  },
  'zh-CN': {
    navigate: '移动',
  },
}
