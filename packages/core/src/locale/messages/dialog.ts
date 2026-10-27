import type { AstryxLocale } from '../types.js'

export interface DialogMessages {
  /** 对话框右上角关闭按钮的名字和提示。 */
  close: string
}

export const dialogMessages: Record<AstryxLocale, DialogMessages> = {
  'en': { close: 'Close' },
  'zh-CN': { close: '关闭' },
}
