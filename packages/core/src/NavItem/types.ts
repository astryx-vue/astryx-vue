import type { Component } from 'vue'

/** 导航链接使用的根组件。默认是 `a`，也可以传入 `RouterLink`。 */
export type NavLinkComponent = string | Component

export type NavItemSize = 'sm' | 'md' | 'lg'

export interface NavItemProps {
  /** 可见文字，也是图标模式下的无障碍名称。 */
  label: string
  /** 有地址且未禁用时渲染成链接。 */
  href?: string
  /** 链接根组件。只在有 `href` 且未禁用时使用。 @default 'a' */
  as?: NavLinkComponent
  /** 链接的 target。 */
  target?: string
  /** 链接的 rel。 */
  rel?: string
  /** 当前页。 @default false */
  isSelected?: boolean
  /** 禁用后渲染成按钮，不进入 Tab 顺序。 @default false */
  isDisabled?: boolean
  /** 高度和内边距。 @default 'md' */
  size?: NavItemSize
  /** 图标的 CSS class，例如 `i-carbon-home`。 */
  iconClass?: string
  /** 选中时替换 `iconClass`。 */
  selectedIconClass?: string
  /** 只显示图标，文字留给读屏。 @default false */
  isIconOnly?: boolean
  /** 占满所在行的宽度。侧边导航项会打开它。 @default false */
  block?: boolean
  /**
   * 去掉自己的底色和尺寸，只保留图标和文字的排列。
   * 外层已经画了导航项的外观时使用。
   * @default false
   */
  plain?: boolean
  /** 这一项是否展开了下级。不传则不设置 aria-expanded。 */
  expanded?: boolean
  /** 展开内容的 id，写到 aria-controls。 */
  controls?: string
  /** 打开的弹出层类型。 */
  hasPopup?: 'menu' | 'dialog' | 'true' | 'listbox' | 'tree' | 'grid'
}

export interface NavItemSlots {
  default?: () => unknown
  icon?: () => unknown
  selectedIcon?: () => unknown
  end?: () => unknown
}

export interface NavItemEmits {
  click: [event: MouseEvent]
}

export interface NavIconProps {
  /** 圆形底上的 CSS 图标 class。 */
  iconClass?: string
  /** 圆形的直径。 @default 'md' */
  size?: NavItemSize
  /** 有文字时作为图片的无障碍名称；不传则对读屏隐藏。 */
  label?: string
}

export interface NavIconSlots {
  default?: () => unknown
}
