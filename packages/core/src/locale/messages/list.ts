import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

/** List 拖动重排（`createReorderable`）的手柄名、说明和读屏播报。 */
export interface ListMessages {
  /** 手柄的名字：「重排」加上这一行的名字。 */
  reorderHandle: (label: string) => string
  /** 手柄借行的标签元素命名时，自己那半句：只有动词。 */
  reorderHandleVerb: string
  /** 行没有能读的名字时，手柄按位置命名。`position` 从 1 数。 */
  reorderHandleAt: (position: number) => string
  /** 每个手柄的说明：怎么拖，怎么用键盘一格一格挪。 */
  reorderHint: string
  /** 重排模式里每挪一次的播报：名字、位置、总数，前后两行的名字。 */
  reorderPlace: (label: string, position: number, total: number, previous: string, next: string) => string
  /** 挪到第一位时的播报。 */
  reorderPlaceTop: (label: string, position: number, total: number, next: string) => string
  /** 挪到最后一位时的播报。 */
  reorderPlaceEnd: (label: string, position: number, total: number, previous: string) => string
  /** 方向键想越过一行固定不动的行，被拒时的播报。 */
  reorderRefused: (label: string) => string
  /** 行没有文字时，播报里怎么称呼它。 */
  reorderItemAt: (position: number) => string
  /** 重排模式提示里「上移」按钮的名字。 */
  reorderMoveUp: string
  /** 重排模式提示里「下移」按钮的名字。 */
  reorderMoveDown: string
  /** 重排模式提示里结束模式的按钮。 */
  reorderDone: string
  /** 重排模式结束时的播报。 */
  reorderModeDone: (label: string, position: number, total: number) => string
  /** 拖动拿起一行时的播报。 */
  reorderPickedUp: (position: number, total: number) => string
  /** 放下时的播报。 */
  reorderDropped: (position: number, total: number) => string
  /** 拖动取消、行回到原位时的播报。 */
  reorderCancelled: (position: number, total: number) => string
}

export const listMessages: Record<AstryxLocale, ListMessages> = {
  'en': {
    reorderHandle: label => `Reorder ${label}`,
    reorderHandleVerb: 'Reorder',
    reorderHandleAt: position => `Reorder item ${formatCount(position, 'en')}`,
    reorderHint:
      'Drag to move this item, or press Space or Enter, then the arrow keys to move it one place at a time. Press Escape when you are done.',
    reorderPlace: (label, position, total, previous, next) =>
      `${label}, position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}, after ${previous}, before ${next}`,
    reorderPlaceTop: (label, position, total, next) =>
      `${label}, position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}, at the top, before ${next}`,
    reorderPlaceEnd: (label, position, total, previous) =>
      `${label}, position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}, after ${previous}, at the end`,
    reorderRefused: label => `Can't move past ${label}`,
    reorderItemAt: position => `Item ${formatCount(position, 'en')}`,
    reorderMoveUp: 'Move up',
    reorderMoveDown: 'Move down',
    reorderDone: 'Done',
    reorderModeDone: (label, position, total) =>
      `Done, ${label} at position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}`,
    reorderPickedUp: (position, total) =>
      `Picked up, position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}.`,
    reorderDropped: (position, total) =>
      `Dropped, position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}`,
    reorderCancelled: (position, total) =>
      `Reorder cancelled, back to position ${formatCount(position, 'en')} of ${formatCount(total, 'en')}`,
  },
  'zh-CN': {
    reorderHandle: label => `调整「${label}」的顺序`,
    reorderHandleVerb: '调整顺序',
    reorderHandleAt: position => `调整第 ${formatCount(position, 'zh-CN')} 项的顺序`,
    reorderHint: '拖动可以移动这一项；也可以按空格键或回车键，再用方向键一次挪一格。挪好后按 Escape 结束。',
    reorderPlace: (label, position, total, previous, next) =>
      `${label}，第 ${formatCount(position, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项，在${previous}之后，${next}之前`,
    reorderPlaceTop: (label, position, total, next) =>
      `${label}，第 ${formatCount(position, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项，在最前面，${next}之前`,
    reorderPlaceEnd: (label, position, total, previous) =>
      `${label}，第 ${formatCount(position, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项，在${previous}之后，在最后面`,
    reorderRefused: label => `不能越过${label}`,
    reorderItemAt: position => `第 ${formatCount(position, 'zh-CN')} 项`,
    reorderMoveUp: '上移',
    reorderMoveDown: '下移',
    reorderDone: '完成',
    reorderModeDone: (label, position, total) =>
      `完成，${label}在第 ${formatCount(position, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项`,
    reorderPickedUp: (position, total) =>
      `已拿起，第 ${formatCount(position, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项。`,
    reorderDropped: (position, total) =>
      `已放下，第 ${formatCount(position, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项`,
    reorderCancelled: (position, total) =>
      `已取消调整，回到第 ${formatCount(position, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项`,
  },
}
