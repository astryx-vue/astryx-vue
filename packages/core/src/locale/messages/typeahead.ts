import type { AstryxLocale } from '../types.js'

export interface TypeaheadMessages {
  placeholder: string
  empty: string
  loading: string
  error: string
  clear: string
  results: string
}

export const typeaheadMessages: Record<AstryxLocale, TypeaheadMessages> = {
  'en': {
    placeholder: 'Search…',
    empty: 'No results found',
    loading: 'Loading results',
    error: 'Couldn\'t load results',
    clear: 'Clear',
    results: 'Search results',
  },
  'zh-CN': {
    placeholder: '搜索…',
    empty: '未找到结果',
    loading: '正在加载',
    error: '加载失败',
    clear: '清除',
    results: '搜索结果',
  },
}
