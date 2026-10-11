import type { AstryxLocale } from '../types.js'

export interface TokenMessages {
  remove: (label: string) => string
}

export const tokenMessages: Record<AstryxLocale, TokenMessages> = {
  'en': {
    remove: label => `Remove ${label}`,
  },
  'zh-CN': {
    remove: label => `移除${label}`,
  },
}
