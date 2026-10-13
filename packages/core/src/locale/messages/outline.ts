import type { AstryxLocale } from '../types.js'

export interface OutlineMessages {
  label: string
}

export const outlineMessages: Record<AstryxLocale, OutlineMessages> = {
  'en': {
    label: 'Table of contents',
  },
  'zh-CN': {
    label: '目录',
  },
}
