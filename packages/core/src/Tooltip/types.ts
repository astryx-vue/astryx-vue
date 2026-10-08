export type TooltipPlacement = 'above' | 'below' | 'start' | 'end'
export type TooltipAlignment = 'start' | 'center' | 'end'
export type TooltipFocusTrigger = 'auto' | 'always' | 'never'
export type TooltipTouchTrigger = 'auto' | 'tap' | 'none'

export interface TooltipProps {
  /** 提示内容。需要富文本时使用 `content` 插槽。 */
  content?: string
  /** 气泡相对触发元素的位置。空间不足时自动翻转。 */
  placement?: TooltipPlacement
  /** 沿位置方向的对齐方式。 */
  alignment?: TooltipAlignment
  /** 悬停或聚焦后，显示前的等待时间（毫秒）。 */
  delay?: number
  /** 鼠标或焦点离开后，隐藏前的等待时间（毫秒）。0 时使用 100 毫秒。 */
  hideDelay?: number
  /**
   * 何时监听聚焦：
   * - `auto`：仅当触发元素本身可聚焦时
   * - `always`：始终监听
   * - `never`：从不监听
   */
  focusTrigger?: TooltipFocusTrigger
  /**
   * 触摸设备上点击触发元素时的行为：
   * - `auto`：点击打开，但按钮、链接和表单控件自己的点击不触发
   * - `tap`：点击总是切换显示
   * - `none`：触摸不打开
   */
  touchTrigger?: TooltipTouchTrigger
  /** 为 false 时禁用悬停与聚焦触发。 */
  isEnabled?: boolean
  /** 是否在纯文字触发元素上显示虚线下划线。 */
  hasHoverIndication?: 'auto' | boolean
  /** 受控显示状态。未提供时由悬停与聚焦控制。 */
  isOpen?: boolean
  /** 挂载时是否默认显示。 */
  isDefaultOpen?: boolean
}
