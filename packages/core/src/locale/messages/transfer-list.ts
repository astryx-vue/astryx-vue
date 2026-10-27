import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

export interface TransferListMessages {
  /** 右侧面板（已选）的标题。 */
  selectedLabel: string
  /** 左侧面板（可选）的标题。 */
  availableLabel: string
  /** 左边既有分组的、也有没分组的条目时，没分组那一段的标题。 */
  ungroupedLabel: string
  searchPlaceholder: string
  searchLabel: (label: string) => string
  selectedEmpty: string
  availableEmpty: string
  noResults: string
  /** 已选面板表头的批量移除。锁住的条目会留下。 */
  clear: string
  /** 可选面板表头的批量添加。 */
  addAll: string
  addOption: (label: string) => string
  removeOption: (label: string) => string
  reorderOption: (label: string) => string
  transferDisabled: (label: string) => string
  reorderDisabled: (label: string) => string
  reorderInstructions: string
  announceAdded: (label: string, count: number) => string
  announceRemoved: (label: string, count: number) => string
  announceBulkAdded: (count: number) => string
  announceBulkRemoved: (count: number) => string
  announceGrabbed: (label: string, position: number, total: number) => string
  announceMoveCancelled: (label: string) => string
  announceDropped: (label: string, position: number, total: number) => string
  announceReturned: (label: string, position: number) => string
  announceMovedToPosition: (label: string, position: number, total: number) => string
  announceSearchResults: (count: number) => string
}

export const transferListMessages: Record<AstryxLocale, TransferListMessages> = {
  'en': {
    selectedLabel: 'Selected',
    availableLabel: 'Available',
    ungroupedLabel: 'Other',
    searchPlaceholder: 'Search…',
    searchLabel: label => `Search ${label}`,
    selectedEmpty: 'No selected options',
    availableEmpty: 'No available options',
    noResults: 'No results',
    clear: 'Clear',
    addAll: 'Add all',
    addOption: label => `Add ${label}`,
    removeOption: label => `Remove ${label}`,
    reorderOption: label => `Reorder ${label}`,
    transferDisabled: label => `${label} cannot be moved`,
    reorderDisabled: label => `${label} cannot be reordered`,
    reorderInstructions:
      'Press Space or Enter to pick up an item. Use Arrow Up, Arrow Down, Home, or End to move it. Press Space or Enter to drop, or Escape to cancel.',
    announceAdded: (label, count) =>
      `${label} added. ${formatCount(count, 'en')} ${englishPlural(count, 'item', 'items')} selected.`,
    announceRemoved: (label, count) =>
      `${label} removed. ${formatCount(count, 'en')} ${englishPlural(count, 'item', 'items')} selected.`,
    announceBulkAdded: count => `${formatCount(count, 'en')} ${englishPlural(count, 'item', 'items')} added.`,
    announceBulkRemoved: count => `${formatCount(count, 'en')} ${englishPlural(count, 'item', 'items')} removed.`,
    announceGrabbed: (label, position, total) =>
      `${label} picked up, position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}. Use arrow keys to move, Space or Enter to drop, or Escape to cancel.`,
    announceMoveCancelled: label => `${label} move cancelled.`,
    announceDropped: (label, position, total) =>
      `${label} dropped at position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}.`,
    announceReturned: (label, position) => `${label} returned to position ${formatCount(position, 'en')}.`,
    announceMovedToPosition: (label, position, total) =>
      `${label}, position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}.`,
    announceSearchResults: count => `${formatCount(count, 'en')} ${englishPlural(count, 'item', 'items')} found.`,
  },
  'zh-CN': {
    selectedLabel: '已选',
    availableLabel: '可选',
    ungroupedLabel: '其它',
    searchPlaceholder: '搜索…',
    searchLabel: label => `搜索${label}`,
    selectedEmpty: '还没有选中任何选项',
    availableEmpty: '没有可选的选项了',
    noResults: '没有匹配结果',
    clear: '清空',
    addAll: '全部添加',
    addOption: label => `添加${label}`,
    removeOption: label => `移除${label}`,
    reorderOption: label => `调整${label}的顺序`,
    transferDisabled: label => `${label}不能移动`,
    reorderDisabled: label => `${label}不能调整顺序`,
    reorderInstructions:
      '按空格键或回车键拿起一项。用上方向键、下方向键、Home 或 End 移动它。按空格键或回车键放下，按 Escape 取消。',
    announceAdded: (label, count) => `已添加${label}。当前已选 ${formatCount(count, 'zh-CN')} 项。`,
    announceRemoved: (label, count) => `已移除${label}。当前已选 ${formatCount(count, 'zh-CN')} 项。`,
    announceBulkAdded: count => `已添加 ${formatCount(count, 'zh-CN')} 项。`,
    announceBulkRemoved: count => `已移除 ${formatCount(count, 'zh-CN')} 项。`,
    announceGrabbed: (label, position, total) =>
      `已拿起${label}，第 ${formatCount(position, 'zh-CN')} 个，共 ${formatCount(total, 'zh-CN')} 个。用方向键移动，按空格键或回车键放下，按 Escape 取消。`,
    announceMoveCancelled: label => `已取消移动${label}。`,
    announceDropped: (label, position, total) =>
      `${label}已放在第 ${formatCount(position, 'zh-CN')} 个，共 ${formatCount(total, 'zh-CN')} 个。`,
    announceReturned: (label, position) => `${label}回到了第 ${formatCount(position, 'zh-CN')} 个。`,
    announceMovedToPosition: (label, position, total) =>
      `${label}，第 ${formatCount(position, 'zh-CN')} 个，共 ${formatCount(total, 'zh-CN')} 个。`,
    announceSearchResults: count => `找到 ${formatCount(count, 'zh-CN')} 项。`,
  },
}
