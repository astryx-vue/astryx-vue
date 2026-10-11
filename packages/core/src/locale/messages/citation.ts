import type { AstryxLocale } from '../types.js'

export interface CitationMessages {
  label: (number: number, title: string) => string
}

export const citationMessages: Record<AstryxLocale, CitationMessages> = {
  'en': {
    label: (number, title) => `Citation ${number}: ${title}`,
  },
  'zh-CN': {
    label: (number, title) => `引用 ${number}：${title}`,
  },
}
