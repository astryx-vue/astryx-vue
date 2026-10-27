import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

export interface CommandPaletteMessages {
  label: string
  emptySearch: string
  emptyBootstrap: string
  placeholder: string
  listLabel: string
  inputLabel: string
  loading: string
  noResultsFor: (query: string) => string
  resultCount: (count: number) => string
  navigate: string
  select: string
  close: string
}

export const commandPaletteMessages: Record<AstryxLocale, CommandPaletteMessages> = {
  'en': {
    label: 'Command palette',
    emptySearch: 'No results',
    emptyBootstrap: 'Type to search',
    placeholder: 'Search…',
    listLabel: 'Commands',
    inputLabel: 'Search commands',
    loading: 'Loading',
    noResultsFor: query => `No results for ${query}`,
    resultCount: count => `${formatCount(count, 'en')} ${englishPlural(count, 'result', 'results')}`,
    navigate: 'Navigate',
    select: 'Select',
    close: 'Close',
  },
  'zh-CN': {
    label: '命令面板',
    emptySearch: '没有结果',
    emptyBootstrap: '输入以搜索',
    placeholder: '搜索…',
    listLabel: '命令',
    inputLabel: '搜索命令',
    loading: '正在加载',
    noResultsFor: query => `没有与 ${query} 匹配的结果`,
    resultCount: count => `${formatCount(count, 'zh-CN')} 个结果`,
    navigate: '移动',
    select: '选择',
    close: '关闭',
  },
}
