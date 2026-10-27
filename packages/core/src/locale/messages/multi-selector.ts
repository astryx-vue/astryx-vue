import type { AstryxLocale } from '../types.js'
import { clearLabel, englishPlural, formatCount } from './shared.js'

export interface MultiSelectorMessages {
  placeholder: string
  search: string
  /** 搜索框的无障碍名。 */
  searchOptions: string
  clear: string
  clearAll: (label?: string) => string
  /** 没有任何选项时面板里的文字。 */
  empty: string
  /** 搜索没有匹配项时面板里的文字。 */
  emptySearch: string
  selectAll: string
  /** 只选了一部分时，「全选」那一行的无障碍名。 */
  selectAllPartial: (label: string) => string
  selected: (count: number) => string
  more: (count: number) => string
  resultCount: (count: number) => string
  create: (query: string) => string
  created: (label: string) => string
  /** 最后一个选中项被取消后的播报。 */
  selectionCleared: string
  /** 全部选中后的播报。 */
  allSelected: string
  /** 每次勾选后播报「已选几项，共几项」。 */
  selectionCount: (count: number, total: number) => string
  readOnly: string
  loading: string
}

export const multiSelectorMessages: Record<AstryxLocale, MultiSelectorMessages> = {
  'en': {
    placeholder: 'Select…',
    search: 'Search…',
    searchOptions: 'Search options',
    clear: 'Clear',
    clearAll: label => clearLabel(label, 'Clear all', 'Clear all '),
    empty: 'No options',
    emptySearch: 'No results found',
    selectAll: 'Select all',
    selectAllPartial: label => `${label}, partially selected`,
    selected: count => `${formatCount(count, 'en')} selected`,
    more: count => `+${count}`,
    resultCount: count => `${formatCount(count, 'en')} ${englishPlural(count, 'result', 'results')}`,
    create: query => `Create "${query}"`,
    created: label => `${label} created`,
    selectionCleared: 'Selection cleared',
    allSelected: 'All selected',
    selectionCount: (count, total) => `${formatCount(count, 'en')} of ${formatCount(total, 'en')} selected`,
    readOnly: 'Read only',
    loading: 'Loading',
  },
  'zh-CN': {
    placeholder: '请选择',
    search: '搜索…',
    searchOptions: '搜索选项',
    clear: '清除',
    clearAll: label => clearLabel(label, '清除全部', '清除全部'),
    empty: '暂无选项',
    emptySearch: '未找到结果',
    selectAll: '全选',
    selectAllPartial: label => `${label}，已选部分`,
    selected: count => `已选 ${formatCount(count, 'zh-CN')} 项`,
    more: count => `+${count}`,
    resultCount: count => `${formatCount(count, 'zh-CN')} 个结果`,
    create: query => `创建“${query}”`,
    created: label => `已创建 ${label}`,
    selectionCleared: '已清空选择',
    allSelected: '已全部选中',
    selectionCount: (count, total) => `已选 ${formatCount(count, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项`,
    readOnly: '只读',
    loading: '正在加载',
  },
}
