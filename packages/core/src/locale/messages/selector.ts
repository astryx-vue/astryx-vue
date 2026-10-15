import type { AstryxLocale } from '../types.js'

export interface SelectorMessages {
  placeholder: string
  search: string
  clear: string
  empty: string
  emptySearch: string
  resultCount: (count: number) => string
  readOnly: string
  loading: string
}

export const selectorMessages: Record<AstryxLocale, SelectorMessages> = {
  'en': {
    placeholder: 'Select…',
    search: 'Search…',
    clear: 'Clear',
    empty: 'No matches',
    emptySearch: 'No results found',
    resultCount: count => count === 1 ? '1 result' : `${count} results`,
    readOnly: 'Read-only',
    loading: 'Loading',
  },
  'zh-CN': {
    placeholder: '请选择',
    search: '搜索…',
    clear: '清除',
    empty: '无匹配项',
    emptySearch: '未找到结果',
    resultCount: count => `${count} 个结果`,
    readOnly: '只读',
    loading: '正在加载',
  },
}
