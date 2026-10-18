import type { AstryxLocale } from '../types.js'

export interface TokenizerMessages {
  placeholder: string
  empty: string
  loading: string
  error: string
  clear: string
  results: string
  more: (count: number) => string
  added: (label: string) => string
  removed: (label: string) => string
  create: (query: string) => string
}

export const tokenizerMessages: Record<AstryxLocale, TokenizerMessages> = {
  'en': {
    placeholder: 'Add…',
    empty: 'No results found',
    loading: 'Loading results',
    error: 'Couldn\'t load results',
    clear: 'Clear all',
    results: 'Search results',
    more: count => `+${count} more`,
    added: label => `Added ${label}`,
    removed: label => `Removed ${label}`,
    create: query => `Create "${query}"`,
  },
  'zh-CN': {
    placeholder: '添加…',
    empty: '未找到结果',
    loading: '正在加载',
    error: '加载失败',
    clear: '全部清除',
    results: '搜索结果',
    more: count => `另外 ${count} 个`,
    added: label => `已添加${label}`,
    removed: label => `已移除${label}`,
    create: query => `创建「${query}」`,
  },
}
