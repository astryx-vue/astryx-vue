import type { AstryxLocale } from '../types.js'

export interface ButtonMessages {
  /** 按钮处在加载状态时，读屏念的文字。 */
  loading: string
}

export const buttonMessages: Record<AstryxLocale, ButtonMessages> = {
  'en': { loading: 'Loading' },
  'zh-CN': { loading: '加载中' },
}
