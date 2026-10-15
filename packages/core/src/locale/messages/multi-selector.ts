import type { AstryxLocale } from '../types.js'

export interface MultiSelectorMessages {
  placeholder: string
  search: string
  clear: string
  empty: string
  emptySearch: string
  selectAll: string
  selected: (count: number) => string
  more: (count: number) => string
  resultCount: (count: number) => string
  create: (query: string) => string
  created: (label: string) => string
  readOnly: string
  loading: string
}

export const multiSelectorMessages: Record<AstryxLocale, MultiSelectorMessages> = {
  'en': {
    placeholder: 'Select…',
    search: 'Search…',
    clear: 'Clear',
    empty: 'No matches',
    emptySearch: 'No results found',
    selectAll: 'Select all',
    selected: count => `${count} selected`,
    more: count => `+${count}`,
    resultCount: count => count === 1 ? '1 result' : `${count} results`,
    create: query => `Create "${query}"`,
    created: label => `${label} created`,
    readOnly: 'Read-only',
    loading: 'Loading',
  },
  'zh-CN': {
    placeholder: '请选择',
    search: '搜索…',
    clear: '清除',
    empty: '无匹配项',
    emptySearch: '未找到结果',
    selectAll: '全选',
    selected: count => `已选 ${count} 项`,
    more: count => `+${count}`,
    resultCount: count => `${count} 个结果`,
    create: query => `创建“${query}”`,
    created: label => `已创建 ${label}`,
    readOnly: '只读',
    loading: '正在加载',
  },
}
