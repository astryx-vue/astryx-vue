/** 媒体区的明暗：叠在媒体上的关闭按钮按它换成对比够的颜色。 */
export type DialogHeroHeaderMediaMode = 'light' | 'dark'

export interface DialogHeroHeaderProps {
  /**
   * 对话框标题，包成二级标题，同时作为对话框的无障碍名称。看得见的标题是对话框打开后的默认焦点。
   * 要自定义标题样式，用 `title` 插槽传一个标题元素。
   */
  title?: string
  /**
   * 媒体区的明暗。设了就在关闭按钮外面套一层 MediaTheme：暗色媒体上按钮变浅，亮色媒体上变深。
   * 不设就沿用周围主题的颜色。
   */
  mediaMode?: DialogHeroHeaderMediaMode
  /**
   * 视觉上隐藏标题行，读屏软件仍然读得到，对话框仍由标题命名。
   * @default false
   */
  isTitleHidden?: boolean
  /** 字符串标题最多显示几行，超出用省略号截断。 */
  maxLines?: number
  /** 底边加一条分隔线。不设时用外层 Layout 的默认值。 */
  hasDivider?: boolean
}

export interface DialogHeroHeaderSlots {
  /** 标题上方铺满对话框边缘的媒体（图片、插画或图标）。媒体自己设宽度（比如 100%）来填满。 */
  media?: () => unknown
  /** 标题前的内容（比如图标），和标题同一行，不算进对话框名称。 */
  startContent?: () => unknown
  /** 自定义标题。对话框的标题 id 和默认焦点会加到它渲染出来的标题元素本身上。 */
  title?: () => unknown
}
