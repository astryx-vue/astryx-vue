import type { AstryxLocale } from '../types.js'

export interface PopoverMessages {
  /** 弹出框里关闭按钮的无障碍名。 */
  close: string
}

export const popoverMessages: Record<AstryxLocale, PopoverMessages> = {
  'en': { close: 'Close popover' },
  'zh-CN': { close: '关闭弹出框' },
}
