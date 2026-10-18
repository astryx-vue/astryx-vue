import type { LayerAlignment, LayerPlacement } from '../layer/position.js'

export type PopoverPlacement = LayerPlacement
export type PopoverAlignment = LayerAlignment
export type PopoverRole = 'dialog' | 'none'
/** 内边距步进，对应 `--astryx-spacing-*` 令牌。 */
export type PopoverPadding = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10

export interface PopoverProps {
  /** 浮层相对触发元素的位置。空间不足时自动翻转。 */
  placement?: PopoverPlacement
  /** 沿位置方向的对齐方式。 */
  alignment?: PopoverAlignment
  /** 受控显示状态。未提供时由触发按钮管理。 */
  isOpen?: boolean
  /** 为 false 时禁止通过触发按钮打开。 */
  isEnabled?: boolean
  /** 浮层宽度。未提供时与触发元素等宽。 */
  width?: number | string
  /** 浮层内边距步进。 */
  padding?: PopoverPadding
  /** 对话框的无障碍名称。`role` 为 `dialog` 时应提供。 */
  label?: string
  /** `dialog` 为对话框，适用于包含交互内容的浮层；`none` 适用于内容自带角色的弹出列表或菜单。 */
  role?: PopoverRole
  /** 为 true 时焦点保持在浮层内，直到浮层关闭。 */
  isModal?: boolean
  /** 是否显示关闭按钮。关闭按钮默认隐藏，聚焦时显示。 */
  hasCloseButton?: boolean
  /** 关闭按钮的文字，同时作为其无障碍名称。 */
  closeButtonLabel?: string
  /** 打开时是否把焦点移入浮层。 */
  hasAutoFocus?: boolean
  /** 点击浮层与触发元素以外的区域时是否关闭。 */
  hasLightDismiss?: boolean
  /** 按下 Escape 时是否关闭。 */
  hasEscapeDismiss?: boolean
  /**
   * 外部元素当锚点。传了它就不再包一层触发容器，默认插槽可以不写；
   * 点击、`aria-haspopup` 等会直接挂到这个元素里的按钮上。
   */
  anchor?: HTMLElement | null
}
