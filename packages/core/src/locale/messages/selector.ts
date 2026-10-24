import type { AstryxLocale } from '../types.js'
import { clearLabel, englishPlural, formatCount } from './shared.js'

export interface SelectorMessages {
  placeholder: string
  search: string
  /** 搜索框的无障碍名。 */
  searchOptions: string
  clear: string
  clearField: (label?: string) => string
  /** 没有任何选项时面板里的文字。 */
  empty: string
  /** 搜索没有匹配项时面板里的文字。 */
  emptySearch: string
  resultCount: (count: number) => string
  readOnly: string
  loading: string
}

export const selectorMessages: Record<AstryxLocale, SelectorMessages> = {
  'en': {
    placeholder: 'Select…',
    search: 'Search…',
    searchOptions: 'Search options',
    clear: 'Clear',
    clearField: label => clearLabel(label, 'Clear', 'Clear '),
    empty: 'No options',
    emptySearch: 'No results found',
    resultCount: count => `${formatCount(count, 'en')} ${englishPlural(count, 'result', 'results')}`,
    readOnly: 'Read only',
    loading: 'Loading',
  },
  'zh-CN': {
    placeholder: '请选择',
    search: '搜索…',
    searchOptions: '搜索选项',
    clear: '清除',
    clearField: label => clearLabel(label, '清除', '清除'),
    empty: '暂无选项',
    emptySearch: '未找到结果',
    resultCount: count => `${formatCount(count, 'zh-CN')} 个结果`,
    readOnly: '只读',
    loading: '正在加载',
  },
}
