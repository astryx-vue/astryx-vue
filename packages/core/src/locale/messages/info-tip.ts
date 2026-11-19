import type { AstryxLocale } from '../types.js'

export interface InfoTipMessages {
  /** `InfoTip` 按钮默认的无障碍名称。 */
  label: string
}

export const infoTipMessages: Record<AstryxLocale, InfoTipMessages> = {
  'en': { label: 'More information' },
  'zh-CN': { label: '更多信息' },
}
