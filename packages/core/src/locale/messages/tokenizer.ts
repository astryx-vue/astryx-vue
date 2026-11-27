import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

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
  /** 全部清除之后播报一次。 */
  allRemoved: string
  resultCount: (count: number) => string
  create: (query: string) => string
  /** 底部弹层：搜索框的读屏名字。 */
  search: (label: string) => string
  searchPlaceholder: string
  noResultsDescription: string
  /** 底部弹层新建行末尾的按钮。 */
  add: string
  addValue: (value: string) => string
  save: string
  /** 草稿超过上限时「保存」的提示。 */
  selectionLimit: (count: number) => string
  discardChangesTitle: string
  discardChangesDescription: (label: string) => string
  keepEditing: string
  discardChanges: string
  clearAllTitle: string
  clearAllDescription: (label: string) => string
  /** 一项都没选时「全部清除」的提示。 */
  nothingToClear: string
  /** 底部弹层触发器的读屏描述开头。 */
  selectedCount: (count: number) => string
  clearSelection: string
}

export const tokenizerMessages: Record<AstryxLocale, TokenizerMessages> = {
  'en': {
    placeholder: 'Add…',
    empty: 'No results found',
    loading: 'Loading',
    error: 'Couldn\'t load results',
    clear: 'Clear all',
    results: 'Search results',
    more: count => `+${formatCount(count, 'en')} more`,
    added: label => `Added ${label}`,
    removed: label => `Removed ${label}`,
    allRemoved: 'All items removed',
    resultCount: count => `${formatCount(count, 'en')} ${englishPlural(count, 'result', 'results')}`,
    create: query => `Create "${query}"`,
    search: label => `Search ${label}`,
    searchPlaceholder: 'Search…',
    noResultsDescription: 'Try a different search.',
    add: 'Add',
    addValue: value => `Add ${value}`,
    save: 'Save',
    selectionLimit: count => `Select up to ${formatCount(count, 'en')} ${englishPlural(count, 'item', 'items')}`,
    discardChangesTitle: 'Discard changes?',
    discardChangesDescription: label => `Your changes to ${label} haven't been saved.`,
    keepEditing: 'Keep editing',
    discardChanges: 'Discard changes',
    clearAllTitle: 'Clear all selected items?',
    clearAllDescription: label => `This removes all selected items from ${label}.`,
    nothingToClear: 'Nothing selected',
    selectedCount: count => `${formatCount(count, 'en')} selected`,
    clearSelection: 'Clear selection',
  },
  'zh-CN': {
    placeholder: '添加…',
    empty: '未找到结果',
    loading: '正在加载',
    error: '加载失败',
    clear: '全部清除',
    results: '搜索结果',
    more: count => `另外 ${formatCount(count, 'zh-CN')} 个`,
    added: label => `已添加${label}`,
    removed: label => `已移除${label}`,
    allRemoved: '已移除全部',
    resultCount: count => `找到 ${formatCount(count, 'zh-CN')} 个结果`,
    create: query => `创建「${query}」`,
    search: label => `搜索${label}`,
    searchPlaceholder: '搜索…',
    noResultsDescription: '换个关键词试试。',
    add: '添加',
    addValue: value => `添加${value}`,
    save: '保存',
    selectionLimit: count => `最多选择 ${formatCount(count, 'zh-CN')} 项`,
    discardChangesTitle: '放弃改动？',
    discardChangesDescription: label => `对${label}的改动还没有保存。`,
    keepEditing: '继续编辑',
    discardChanges: '放弃改动',
    clearAllTitle: '清除全部已选项？',
    clearAllDescription: label => `这会移除${label}里的全部已选项。`,
    nothingToClear: '还没有选择',
    selectedCount: count => `已选 ${formatCount(count, 'zh-CN')} 项`,
    clearSelection: '清除选择',
  },
}
