import type { AstryxLocale } from '../types.js'

export interface SelectorMessages {
  placeholder: string
  search: string
  clear: string
  empty: string
}

export const selectorMessages: Record<AstryxLocale, SelectorMessages> = {
  'en': {
    placeholder: 'Select…',
    search: 'Search…',
    clear: 'Clear',
    empty: 'No matches',
  },
  'zh-CN': {
    placeholder: '请选择',
    search: '搜索…',
    clear: '清除',
    empty: '无匹配项',
  },
}
