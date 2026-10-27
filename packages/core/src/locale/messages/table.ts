import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

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
  /** 排序方向词，会填进 `sortedBy` 那句话里。 */
  sortedAscending: string
  sortedDescending: string
  sortBy: (label: string) => string
  /** 已排序列的表头按钮名。 */
  sortedBy: (label: string, direction: string) => string
  /** 多列排序时，已排序列的表头按钮名，带上它排第几。 */
  sortedByWithPriority: (label: string, direction: string, rank: number, total: number) => string
  /** 列筛选控件的名字、占位文字和无障碍名。 */
  filterByColumn: (header: string) => string
  bulkActionsLabel: string
  clearAll: string
  selectedCount: (count: number) => string
  paginationLabel: string
  paginationLabelAbove: (label: string) => string
  paginationLabelBelow: (label: string) => string
  resizeColumn: (label: string) => string
  expandGroup: (groupKey: string) => string
  collapseGroup: (groupKey: string) => string
  expandRow: string
  collapseRow: string
  expandAllRows: string
  collapseAllRows: string
  rowExpansion: string
  rowStatus: string
  /** 树形数据里，行展开箭头的名字。 */
  treeExpandRow: string
  treeCollapseRow: string
  /** 树形数据表头那个「全部展开 / 全部收起」开关的名字。 */
  treeExpandAllRows: string
  treeCollapseAllRows: string
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
    sortedAscending: 'ascending',
    sortedDescending: 'descending',
    sortBy: label => `Sort by ${label}`,
    sortedBy: (label, direction) => `Sort by ${label}, sorted ${direction}`,
    sortedByWithPriority: (label, direction, rank, total) => `Sort by ${label}, sorted ${direction}, priority ${formatCount(rank, 'en')} of ${formatCount(total, 'en')}`,
    filterByColumn: header => `Filter ${header}`,
    bulkActionsLabel: 'Bulk actions',
    clearAll: 'Unselect All',
    selectedCount: count => `${formatCount(count, 'en')} selected`,
    paginationLabel: 'Table pagination',
    paginationLabelAbove: label => `${label} (top)`,
    paginationLabelBelow: label => `${label} (bottom)`,
    resizeColumn: label => `Resize column ${label}`,
    expandGroup: groupKey => `Expand group ${groupKey}`,
    collapseGroup: groupKey => `Collapse group ${groupKey}`,
    expandRow: 'Expand row',
    collapseRow: 'Collapse row',
    expandAllRows: 'Expand all rows',
    collapseAllRows: 'Collapse all rows',
    rowExpansion: 'Row expansion',
    rowStatus: 'Row status',
    treeExpandRow: 'Expand row',
    treeCollapseRow: 'Collapse row',
    treeExpandAllRows: 'Expand all rows',
    treeCollapseAllRows: 'Collapse all rows',
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
    sortBy: label => `按${label}排序`,
    sortedBy: (label, direction) => `按${label}排序，当前为${direction}`,
    sortedByWithPriority: (label, direction, rank, total) => `按${label}排序，当前为${direction}，优先级 ${formatCount(rank, 'zh-CN')}/${formatCount(total, 'zh-CN')}`,
    filterByColumn: header => `筛选${header}`,
    bulkActionsLabel: '批量操作',
    clearAll: '取消全选',
    selectedCount: count => `已选择 ${formatCount(count, 'zh-CN')} 项`,
    paginationLabel: '表格分页',
    paginationLabelAbove: label => `${label}（顶部）`,
    paginationLabelBelow: label => `${label}（底部）`,
    resizeColumn: label => `调整列宽 ${label}`,
    expandGroup: groupKey => `展开分组 ${groupKey}`,
    collapseGroup: groupKey => `折叠分组 ${groupKey}`,
    expandRow: '展开行',
    collapseRow: '折叠行',
    expandAllRows: '展开所有行',
    collapseAllRows: '折叠所有行',
    rowExpansion: '行展开',
    rowStatus: '行状态',
    treeExpandRow: '展开行',
    treeCollapseRow: '折叠行',
    treeExpandAllRows: '展开所有行',
    treeCollapseAllRows: '折叠所有行',
  },
}
