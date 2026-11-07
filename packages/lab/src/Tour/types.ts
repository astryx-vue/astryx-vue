import type { PopoverAlignment, PopoverPlacement } from '@astryx-vue/core'
import type { MaybeRef } from 'vue'
import type { TourDismissSource } from './context.js'

export interface TourProps {
  /** 是否运行。关闭后步骤重置；调用方负责在 dismiss 后把它设为 false。 */
  isActive: boolean
  /** 在目标周围压暗页面，保留目标亮区。 */
  hasBackdrop?: boolean
  /** 显示“第几步 / 总步数”。 */
  isStepCountShown?: boolean
}

export interface TourEmits {
  dismiss: [source: TourDismissSource]
}

export interface TourSlots {
  default?: () => unknown
}

export interface TourStepProps {
  /** 指向步骤目标元素的模板 ref。 */
  'targetRef': MaybeRef<HTMLElement | null>
  /** 步骤标题，同时作为弹层名称。 */
  'heading': string
  'placement'?: PopoverPlacement
  'alignment'?: PopoverAlignment
  'data-testid'?: string
}

export interface TourStepSlots {
  default?: () => unknown
}

export interface TargetRect {
  top: number
  left: number
  width: number
  height: number
  radius: string
}
