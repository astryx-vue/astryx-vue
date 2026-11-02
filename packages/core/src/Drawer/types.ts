import type { DialogPadding, DialogPurpose } from '../Dialog/types.js'

/** 抽屉贴哪一边：逻辑行首或行尾，RTL 下自动镜像。 */
export type DrawerPlacement = 'start' | 'end'

export interface DrawerProps {
  /** 抽屉是否打开。打开状态由调用方持有。 */
  isOpen: boolean
  /** 抽屉的无障碍名称。 */
  label: string
  /** 贴哪一边。@default 'end' */
  placement?: DrawerPlacement
  /** 首选宽度。数字为像素，字符串原样使用。@default 400 */
  width?: number | string
  /** 内容区的内边距。未设置时用主题默认值。 */
  padding?: DialogPadding
  /**
   * 关闭方式，规则和对话框一致：
   * `required` 禁用 Escape 与遮罩点击，`form` 只允许 Escape，`info` 两者都允许。
   * @default 'info'
   */
  purpose?: DialogPurpose
}

export interface DrawerHeaderProps {
  /** 标题。它会命名抽屉。 */
  title: string
  /** 标题下方的副标题。为空字符串时不渲染。 */
  subtitle?: string
  /** 是否显示关闭按钮。默认跟随是否监听 `close`。 */
  hasCloseButton?: boolean
  /** 关闭按钮的无障碍名称。不传时跟界面语言走。 */
  closeButtonLabel?: string
}

export interface DrawerEmits {
  /** 请求改变打开状态。 */
  openChange: [isOpen: boolean]
}

export interface DrawerHeaderEmits {
  /** 点击关闭按钮时的关闭请求，和 `DialogHeader` 保持一致。 */
  openChange: [isOpen: boolean]
}

export interface DrawerSlots {
  /** 抽屉主体。 */
  default?: () => unknown
  /** 底部内容，例如操作按钮。 */
  footer?: () => unknown
}

export interface DrawerHeaderSlots {
  title?: () => unknown
  subtitle?: () => unknown
  startContent?: () => unknown
  endContent?: () => unknown
}
