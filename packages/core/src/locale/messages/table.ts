import type { AstryxLocale } from '../types.js'

export interface TableMessages {
  label: string
  noData: string
  filterAll: string
  reset: string
  apply: string
  selectAllRows: string
  selectRow: string
  selectRowNamed: (label: string) => string
  sortAscending: string
  sortDescending: string
  clearSort: string
  sortedAscending: string
  sortedDescending: string
  sortBy: (label: string) => string
  bulkActionsLabel: string
  clearAll: string
  selectedCount: (count: number) => string
  paginationLabel: string
}

export const tableMessages: Record<AstryxLocale, TableMessages> = {
  'en': {
    label: 'Table',
    noData: 'No data',
    filterAll: 'All',
    reset: 'Reset',
    apply: 'Apply',
    selectAllRows: 'Select all rows',
    selectRow: 'Select row',
    selectRowNamed: label => `Select ${label}`,
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    clearSort: 'Clear sort',
    sortedAscending: 'Ascending',
    sortedDescending: 'Descending',
    sortBy: label => `Sort by ${label}`,
    bulkActionsLabel: 'Bulk actions',
    clearAll: 'Unselect All',
    selectedCount: count => `${count} selected`,
    paginationLabel: 'Table pagination',
  },
  'zh-CN': {
    label: '表格',
    noData: '暂无数据',
    filterAll: '全部',
    reset: '重置',
    apply: '应用',
    selectAllRows: '选择所有行',
    selectRow: '选择行',
    selectRowNamed: label => `选择 ${label}`,
    sortAscending: '升序排序',
    sortDescending: '降序排序',
    clearSort: '清除排序',
    sortedAscending: '升序',
    sortedDescending: '降序',
    sortBy: label => `按 ${label} 排序`,
    bulkActionsLabel: '批量操作',
    clearAll: '取消全选',
    selectedCount: count => `已选择 ${count} 项`,
    paginationLabel: '表格分页',
  },
}
