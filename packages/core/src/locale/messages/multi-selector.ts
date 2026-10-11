import type { AstryxLocale } from '../types.js'

export interface MultiSelectorMessages {
  placeholder: string
  search: string
  clear: string
  empty: string
  selectAll: string
  selected: (count: number) => string
  more: (count: number) => string
}

export const multiSelectorMessages: Record<AstryxLocale, MultiSelectorMessages> = {
  'en': {
    placeholder: 'Select…',
    search: 'Search…',
    clear: 'Clear',
    empty: 'No matches',
    selectAll: 'Select all',
    selected: count => `${count} selected`,
    more: count => `+${count}`,
  },
  'zh-CN': {
    placeholder: '请选择',
    search: '搜索…',
    clear: '清除',
    empty: '无匹配项',
    selectAll: '全选',
    selected: count => `已选 ${count} 项`,
    more: count => `+${count}`,
  },
}
