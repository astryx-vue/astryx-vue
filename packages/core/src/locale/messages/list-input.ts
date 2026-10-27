import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

export interface ListInputMessages {
  /** 空列表标题。`itemName` 是调用方给的单数名词，英文直接在后面加 `s`。 */
  emptyTitle: (itemName: string) => string
  emptyDescription: (itemName: string) => string
  addItem: (itemName: string) => string
  removeItem: (itemName: string, position: number) => string
  /** 列表禁用或加载中时，删除按钮的说明。 */
  removeUnavailable: string
  reorderItem: (itemName: string, position: number) => string
  /** 第二行起的字段名，带上这一行是第几条，避免读屏重复同一个列名。 */
  fieldLabelWithPosition: (header: string, itemName: string, position: number, total: number) => string
  reorderInstructions: string
  announceAdded: (itemName: string, position: number) => string
  announceRemoved: (itemName: string, position: number) => string
  announceGrabbed: (itemName: string, position: number) => string
  announceMovedToPosition: (itemName: string, position: number, total: number) => string
  announceReorderCancelled: string
  announceReturnedToPosition: (itemName: string, position: number) => string
  announceDropped: (itemName: string, position: number, total: number) => string
  /** 已经在这一端，再按方向键也没用。`boundary` 只会是 `first` 或 `last`。 */
  alreadyAtBoundary: (itemName: string, boundary: 'first' | 'last') => string
}

export const listInputMessages: Record<AstryxLocale, ListInputMessages> = {
  'en': {
    emptyTitle: itemName => `No ${itemName}s yet`,
    emptyDescription: itemName => `Add a ${itemName} to get started.`,
    addItem: itemName => `Add ${itemName}`,
    removeItem: (itemName, position) => `Remove ${itemName} ${formatCount(position, 'en')}`,
    removeUnavailable: 'Remove is unavailable while the list is disabled',
    reorderItem: (itemName, position) => `Reorder ${itemName} ${formatCount(position, 'en')}`,
    fieldLabelWithPosition: (header, itemName, position, total) =>
      `${header}, ${itemName} ${formatCount(position, 'en')} of ${formatCount(total, 'en')}`,
    reorderInstructions:
      'Use Arrow Up or Arrow Down to move this item one position. Press Space or Enter to pick it up for extended keyboard reordering.',
    announceAdded: (itemName, position) => `Added ${itemName} ${formatCount(position, 'en')}.`,
    announceRemoved: (itemName, position) => `Removed ${itemName} ${formatCount(position, 'en')}.`,
    announceGrabbed: (itemName, position) =>
      `${itemName} ${formatCount(position, 'en')} grabbed. Use arrow keys to move, Space or Enter to drop, and Escape to cancel.`,
    announceMovedToPosition: (itemName, position, total) =>
      `${itemName} moved to position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}.`,
    announceReorderCancelled: 'Reordering cancelled.',
    announceReturnedToPosition: (itemName, position) =>
      `${itemName} returned to position ${formatCount(position, 'en')}.`,
    announceDropped: (itemName, position, total) =>
      `${itemName} dropped at position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}.`,
    alreadyAtBoundary: (itemName, boundary) =>
      `This ${itemName} is already ${boundary === 'first' ? 'first' : boundary === 'last' ? 'last' : ''}.`,
  },
  'zh-CN': {
    emptyTitle: itemName => `还没有${itemName}`,
    emptyDescription: itemName => `添加一个${itemName}就可以开始了。`,
    addItem: itemName => `添加${itemName}`,
    removeItem: (itemName, position) => `删除第 ${formatCount(position, 'zh-CN')} 个${itemName}`,
    removeUnavailable: '列表禁用时不能删除',
    reorderItem: (itemName, position) => `调整第 ${formatCount(position, 'zh-CN')} 个${itemName}的顺序`,
    fieldLabelWithPosition: (header, itemName, position, total) =>
      `${header}，${itemName}第 ${formatCount(position, 'zh-CN')} 个，共 ${formatCount(total, 'zh-CN')} 个`,
    reorderInstructions:
      '按上方向键或下方向键把这个条目挪一位。按空格键或回车键可以拿起它，用键盘继续调整顺序。',
    announceAdded: (itemName, position) => `已添加第 ${formatCount(position, 'zh-CN')} 个${itemName}。`,
    announceRemoved: (itemName, position) => `已删除第 ${formatCount(position, 'zh-CN')} 个${itemName}。`,
    announceGrabbed: (itemName, position) =>
      `已拿起${itemName}第 ${formatCount(position, 'zh-CN')} 个。用方向键移动，按空格键或回车键放下，按 Escape 取消。`,
    announceMovedToPosition: (itemName, position, total) =>
      `${itemName}已移动到第 ${formatCount(position, 'zh-CN')} 个，共 ${formatCount(total, 'zh-CN')} 个。`,
    announceReorderCancelled: '已取消调整顺序。',
    announceReturnedToPosition: (itemName, position) =>
      `${itemName}回到了第 ${formatCount(position, 'zh-CN')} 个。`,
    announceDropped: (itemName, position, total) =>
      `${itemName}已放在第 ${formatCount(position, 'zh-CN')} 个，共 ${formatCount(total, 'zh-CN')} 个。`,
    alreadyAtBoundary: (itemName, boundary) =>
      `这个${itemName}已经在${boundary === 'first' ? '最前' : boundary === 'last' ? '最后' : ''}了。`,
  },
}
