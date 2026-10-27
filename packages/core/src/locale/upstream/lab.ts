import type { UpstreamMapPart } from './types.js'

/** lab 包里的记录编辑器与两栏选择器。文案由 lab 组件自己取，core 只负责保存。 */
export const labUpstreamMap: UpstreamMapPart = {
  '@astryx.listInput.emptyTitle': [{ path: 'listInput.emptyTitle', args: ['itemName'] }],
  '@astryx.listInput.emptyDescription': [{ path: 'listInput.emptyDescription', args: ['itemName'] }],
  '@astryx.listInput.addItem': [{ path: 'listInput.addItem', args: ['itemName'] }],
  '@astryx.listInput.removeItem': [{ path: 'listInput.removeItem', args: ['itemName', 'position'] }],
  '@astryx.listInput.removeUnavailable': [{ path: 'listInput.removeUnavailable' }],
  '@astryx.listInput.reorderItem': [{ path: 'listInput.reorderItem', args: ['itemName', 'position'] }],
  '@astryx.listInput.fieldLabelWithPosition': [
    { path: 'listInput.fieldLabelWithPosition', args: ['header', 'itemName', 'position', 'total'] },
  ],
  '@astryx.listInput.reorderInstructions': [{ path: 'listInput.reorderInstructions' }],
  '@astryx.listInput.announceAdded': [{ path: 'listInput.announceAdded', args: ['itemName', 'position'] }],
  '@astryx.listInput.announceRemoved': [{ path: 'listInput.announceRemoved', args: ['itemName', 'position'] }],
  '@astryx.listInput.announceGrabbed': [{ path: 'listInput.announceGrabbed', args: ['itemName', 'position'] }],
  '@astryx.listInput.announceMovedToPosition': [
    { path: 'listInput.announceMovedToPosition', args: ['itemName', 'position', 'total'] },
  ],
  '@astryx.listInput.announceReorderCancelled': [{ path: 'listInput.announceReorderCancelled' }],
  '@astryx.listInput.announceReturnedToPosition': [
    { path: 'listInput.announceReturnedToPosition', args: ['itemName', 'position'] },
  ],
  '@astryx.listInput.announceDropped': [
    { path: 'listInput.announceDropped', args: ['itemName', 'position', 'total'] },
  ],

  '@astryx.transferList.selectedLabel': [{ path: 'transferList.selectedLabel' }],
  '@astryx.transferList.availableLabel': [{ path: 'transferList.availableLabel' }],
  '@astryx.transferList.ungroupedLabel': [{ path: 'transferList.ungroupedLabel' }],
  '@astryx.transferList.searchPlaceholder': [{ path: 'transferList.searchPlaceholder' }],
  '@astryx.transferList.searchLabel': [{ path: 'transferList.searchLabel', args: ['label'] }],
  '@astryx.transferList.selectedEmpty': [{ path: 'transferList.selectedEmpty' }],
  '@astryx.transferList.availableEmpty': [{ path: 'transferList.availableEmpty' }],
  '@astryx.transferList.noResults': [{ path: 'transferList.noResults' }],
  '@astryx.transferList.clear': [{ path: 'transferList.clear' }],
  '@astryx.transferList.addAll': [{ path: 'transferList.addAll' }],
  '@astryx.transferList.addOption': [{ path: 'transferList.addOption', args: ['label'] }],
  '@astryx.transferList.removeOption': [{ path: 'transferList.removeOption', args: ['label'] }],
  '@astryx.transferList.reorderOption': [{ path: 'transferList.reorderOption', args: ['label'] }],
  '@astryx.transferList.transferDisabled': [{ path: 'transferList.transferDisabled', args: ['label'] }],
  '@astryx.transferList.reorderDisabled': [{ path: 'transferList.reorderDisabled', args: ['label'] }],
  '@astryx.transferList.reorderInstructions': [{ path: 'transferList.reorderInstructions' }],
  '@astryx.transferList.announceAdded': [
    { path: 'transferList.announceAdded', args: ['label', 'count'] },
  ],
  '@astryx.transferList.announceRemoved': [
    { path: 'transferList.announceRemoved', args: ['label', 'count'] },
  ],
  '@astryx.transferList.announceBulkAdded': [
    { path: 'transferList.announceBulkAdded', args: ['count'] },
  ],
  '@astryx.transferList.announceBulkRemoved': [
    { path: 'transferList.announceBulkRemoved', args: ['count'] },
  ],
  '@astryx.transferList.announceGrabbed': [
    { path: 'transferList.announceGrabbed', args: ['label', 'position', 'total'] },
  ],
  '@astryx.transferList.announceMoveCancelled': [
    { path: 'transferList.announceMoveCancelled', args: ['label'] },
  ],
  '@astryx.transferList.announceDropped': [
    { path: 'transferList.announceDropped', args: ['label', 'position', 'total'] },
  ],
  '@astryx.transferList.announceReturned': [
    { path: 'transferList.announceReturned', args: ['label', 'position'] },
  ],
  '@astryx.transferList.announceMovedToPosition': [
    { path: 'transferList.announceMovedToPosition', args: ['label', 'position', 'total'] },
  ],
  '@astryx.transferList.announceSearchResults': [
    { path: 'transferList.announceSearchResults', args: ['count'] },
  ],

  '@astryx.transferListSelector.apply': [{ path: 'transferListSelector.apply' }],
  '@astryx.transferListSelector.cancel': [{ path: 'transferListSelector.cancel' }],
  '@astryx.transferListSelector.triggerLabel': [
    { path: 'transferListSelector.triggerLabel', args: ['count'] },
  ],
}
