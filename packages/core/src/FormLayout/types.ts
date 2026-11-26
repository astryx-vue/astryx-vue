import type { VNodeChild } from 'vue'
import type { EntryErrorBehavior, FormLayoutDirection, FormOptionality } from './context.js'

export type { EntryErrorBehavior, FormLayoutDirection, FormOptionality } from './context.js'

export interface FormLayoutProps {
  /**
   * 字段的排列方向。
   * vertical 从上到下，horizontal 等宽横排，horizontal-labels 标签在左、窄于 480px 时改回竖排。
   * @default 'vertical'
   */
  direction?: FormLayoutDirection
  /**
   * 这份表单默认是选填还是必填。只影响例外项的标记和 aria-required，不写原生 required。
   */
  defaultOptionality?: FormOptionality
  /**
   * 表单里日期字段（DateInput、DateTimeInput）打字被拒时默认什么时候亮出来。
   * 字段自己传了 `entryErrorBehavior` 时以字段为准。不传时是 `complete`。
   */
  defaultEntryErrorBehavior?: EntryErrorBehavior
}

export interface FormLayoutSlots {
  default?: () => VNodeChild
}
