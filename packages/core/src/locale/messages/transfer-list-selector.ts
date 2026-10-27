import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

export interface TransferListSelectorMessages {
  /** 分段提交模式下确认按钮的文字。 */
  apply: string
  /** 分段提交模式下放弃按钮的文字。 */
  cancel: string
  /** 收起时触发器上默认的选择摘要。 */
  triggerLabel: (count: number) => string
}

export const transferListSelectorMessages: Record<AstryxLocale, TransferListSelectorMessages> = {
  'en': {
    apply: 'Apply',
    cancel: 'Cancel',
    triggerLabel: count => `${formatCount(count, 'en')} selected`,
  },
  'zh-CN': {
    apply: '应用',
    cancel: '取消',
    triggerLabel: count => `已选 ${formatCount(count, 'zh-CN')} 项`,
  },
}
