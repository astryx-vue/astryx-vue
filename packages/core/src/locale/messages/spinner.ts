import type { AstryxLocale } from '../types.js'

export interface SpinnerMessages {
  /** 使用者没给 `label` 也没给 `aria-label` 时，读屏念的默认状态。 */
  loading: string
}

export const spinnerMessages: Record<AstryxLocale, SpinnerMessages> = {
  'en': { loading: 'Loading' },
  'zh-CN': { loading: '加载中' },
}
