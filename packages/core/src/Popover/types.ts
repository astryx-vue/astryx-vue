import type { AdaptivePresentation } from '../composables/internal/presentation.js'
import type { LayerAlignment, LayerPlacement } from '../layer/position.js'

export type PopoverPlacement = LayerPlacement
export type PopoverAlignment = LayerAlignment
export type PopoverRole = 'dialog' | 'none'
/**
 * 内容放在哪：锚定在触发器上、底部弹层，或自适应（紧凑触屏上用底部弹层，
 * 其余用浮层）。
 */
export type PopoverPresentation = AdaptivePresentation
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
  /** 对话框的无障碍名称。`role` 为 `dialog` 时应提供。没写时，底部弹层用触发器的文字命名。 */
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
  /**
   * 承载内容的界面。`'popover'` 锚定在触发器上；`'bottom-sheet'` 放进模态
   * BottomSheet，由 `label` 命名；`'adaptive'` 在紧凑触屏（粗指针，并且屏幕按主题
   * 算紧凑：窄于 `md` 宽度点或矮于 500px，横竖屏的手机都算）上用 BottomSheet，
   * 其余用锚定浮层，和 iOS 在手机上呈现 popover 一样。
   *
   * 在底部弹层里，`placement`、`alignment`、`width`、`role`、`isModal`、
   * `hasAutoFocus` 不生效，`padding` 是弹层内容的内边距；弹层总能轻点外面或向下
   * 轻扫关闭（不管 `hasLightDismiss`），Escape 跟着 `hasEscapeDismiss`，后备关闭
   * 按钮照样聚焦时才出现。界面在打开时选定，保持到关闭。
   * @default 'popover'
   */
  presentation?: PopoverPresentation
}
