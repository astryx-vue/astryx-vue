import type { VNodeChild } from 'vue'
import type { FormLayoutDirection, FormOptionality } from './context.js'

export type { FormLayoutDirection, FormOptionality } from './context.js'

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
}

export interface FormLayoutSlots {
  default?: () => VNodeChild
}
