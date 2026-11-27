import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

/** PowerSearch 触屏底部弹层流程（筛选条件列表、添加筛选、取值步骤）的文案。 */
export interface PowerSearchSheetMessages {
  /** 「筛选条件」弹层的标题和无障碍名。 */
  filtersTitle: string
  /** 打开字段列表的按钮；取值步骤里新建条件时也是保存按钮的文字。 */
  addFilter: string
  noFilters: string
  /** 草稿已经清空、但输入框上还有生效条件时的空状态标题。 */
  noFiltersInDraft: string
  noFiltersDescription: string
  clearAll: string
  clearAllTitle: string
  clearAllDescription: string
  clearAllConfirm: string
  clearAllCancel: string
  done: string
  discardTitle: string
  discardDescription: string
  keepEditing: string
  discardConfirm: string
  /** 「添加筛选」弹层顶部内容搜索框的无障碍名。 */
  search: string
  searchResults: string
  searchFields: string
  searchFieldsPlaceholder: string
  /** 不属于任何分组的字段的小标题。 */
  ungroupedFields: string
  noMatchingFields: string
  tryDifferentSearch: string
  noResults: string
  filterUnavailable: string
  removeFilter: (field: string) => string
  relativeDaysAgo: (count: number) => string
  relativeDaysFromNow: (count: number) => string
  relativeWeeksAgo: (count: number) => string
  relativeWeeksFromNow: (count: number) => string
  relativeMonthsAgo: (count: number) => string
  relativeMonthsFromNow: (count: number) => string
  /** 字段和运算符，例如「Status is」：取值步骤的标题、运算符单选项、筛选行的前半段。 */
  fieldOperator: (field: string, operator: string) => string
  /** 「字段 运算符」和值，例如「Status is Open」：移除播报读这一句。 */
  labelValue: (label: string, value: string) => string
}

function englishRelative(count: number, one: string, other: string, suffix: string): string {
  return `${formatCount(count, 'en')} ${englishPlural(count, one, other)} ${suffix}`
}

export const powerSearchSheetMessages: Record<AstryxLocale, PowerSearchSheetMessages> = {
  'en': {
    filtersTitle: 'Filters',
    addFilter: 'Add filter',
    noFilters: 'No filters applied',
    noFiltersInDraft: 'No filters',
    noFiltersDescription: 'Add a filter to narrow your results and find what you need faster.',
    clearAll: 'Clear all',
    clearAllTitle: 'Clear all filters?',
    clearAllDescription: 'This removes all editable filters from this search.',
    clearAllConfirm: 'Clear filters',
    clearAllCancel: 'Keep filters',
    done: 'Done',
    discardTitle: 'Discard changes?',
    discardDescription: 'Your changes to the filters haven\'t been applied.',
    keepEditing: 'Keep editing',
    discardConfirm: 'Discard changes',
    search: 'Search',
    searchResults: 'Search results',
    searchFields: 'Search filters',
    searchFieldsPlaceholder: 'Search filters…',
    ungroupedFields: 'General',
    noMatchingFields: 'No filters match your search',
    tryDifferentSearch: 'Try a different search.',
    noResults: 'No results found',
    filterUnavailable: 'This filter is no longer available',
    removeFilter: field => `Remove ${field} filter`,
    relativeDaysAgo: count => englishRelative(count, 'day', 'days', 'ago'),
    relativeDaysFromNow: count => englishRelative(count, 'day', 'days', 'from now'),
    relativeWeeksAgo: count => englishRelative(count, 'week', 'weeks', 'ago'),
    relativeWeeksFromNow: count => englishRelative(count, 'week', 'weeks', 'from now'),
    relativeMonthsAgo: count => englishRelative(count, 'month', 'months', 'ago'),
    relativeMonthsFromNow: count => englishRelative(count, 'month', 'months', 'from now'),
    fieldOperator: (field, operator) => `${field} ${operator}`,
    labelValue: (label, value) => `${label} ${value}`,
  },
  'zh-CN': {
    filtersTitle: '筛选条件',
    addFilter: '添加筛选条件',
    noFilters: '没有生效的筛选条件',
    noFiltersInDraft: '没有筛选条件',
    noFiltersDescription: '添加筛选条件，缩小结果范围，更快找到想要的内容。',
    clearAll: '全部清除',
    clearAllTitle: '清除全部筛选条件？',
    clearAllDescription: '这会移除这次搜索里所有可编辑的筛选条件。',
    clearAllConfirm: '清除筛选条件',
    clearAllCancel: '保留筛选条件',
    done: '完成',
    discardTitle: '放弃更改？',
    discardDescription: '对筛选条件的更改还没有应用。',
    keepEditing: '继续编辑',
    discardConfirm: '放弃更改',
    search: '搜索',
    searchResults: '搜索结果',
    searchFields: '搜索筛选字段',
    searchFieldsPlaceholder: '搜索筛选字段……',
    ungroupedFields: '常规',
    noMatchingFields: '没有符合搜索的筛选字段',
    tryDifferentSearch: '换个关键词试试。',
    noResults: '没有找到结果',
    filterUnavailable: '这个筛选条件已经不可用',
    removeFilter: field => `移除「${field}」筛选条件`,
    relativeDaysAgo: count => `${formatCount(count, 'zh-CN')} 天前`,
    relativeDaysFromNow: count => `${formatCount(count, 'zh-CN')} 天后`,
    relativeWeeksAgo: count => `${formatCount(count, 'zh-CN')} 周前`,
    relativeWeeksFromNow: count => `${formatCount(count, 'zh-CN')} 周后`,
    relativeMonthsAgo: count => `${formatCount(count, 'zh-CN')} 个月前`,
    relativeMonthsFromNow: count => `${formatCount(count, 'zh-CN')} 个月后`,
    fieldOperator: (field, operator) => `${field} ${operator}`,
    labelValue: (label, value) => `${label} ${value}`,
  },
}
