import type { AstryxLocale } from '../types.js'

export interface SwitchMessages {
  /** 开关处在忙碌状态时，播报区念的文字。 */
  loading: string
}

export const switchMessages: Record<AstryxLocale, SwitchMessages> = {
  'en': { loading: 'Loading' },
  'zh-CN': { loading: '加载中' },
}
