import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

export interface TypeaheadMessages {
  placeholder: string
  empty: string
  loading: string
  error: string
  clear: string
  results: string
  /** 用退格或删除键清掉已选值后播报；`label` 是被清掉的值。 */
  selectionCleared: (label: string) => string
  /** 搜索返回后，播报找到了多少条建议。 */
  resultCount: (count: number) => string
}

export const typeaheadMessages: Record<AstryxLocale, TypeaheadMessages> = {
  'en': {
    placeholder: 'Search…',
    empty: 'No results found',
    loading: 'Loading',
    error: 'Couldn\'t load results',
    clear: 'Clear selection',
    results: 'Search results',
    selectionCleared: label => `Cleared ${label}`,
    resultCount: count => `${formatCount(count, 'en')} ${englishPlural(count, 'result', 'results')}`,
  },
  'zh-CN': {
    placeholder: '搜索…',
    empty: '未找到结果',
    loading: '正在加载',
    error: '加载失败',
    clear: '清除所选',
    results: '搜索结果',
    selectionCleared: label => `已清除 ${label}`,
    resultCount: count => `找到 ${formatCount(count, 'zh-CN')} 个结果`,
  },
}
