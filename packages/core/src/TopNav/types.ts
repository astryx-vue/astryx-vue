import type { NavItemSize, NavLinkComponent } from '../NavItem/types.js'

export interface TopNavProps {
  /** 导航地标的无障碍名称。默认走当前语言的「顶部导航」。 */
  label?: string
  /**
   * 命中这条媒体查询时，起始和中间的内容收进移动导航抽屉，栏上只留标题、结束内容和开关。
   * 不传则始终展示完整顶栏。
   */
  mobileQuery?: string
}

export interface TopNavSlots {
  default?: () => unknown
  heading?: () => unknown
  start?: () => unknown
  center?: () => unknown
  end?: () => unknown
}

export interface TopNavHeadingProps {
  heading: string
  href?: string
  as?: NavLinkComponent
}

export interface TopNavHeadingSlots {
  icon?: () => unknown
}

export interface TopNavItemProps {
  label: string
  href?: string
  as?: NavLinkComponent
  target?: string
  rel?: string
  iconClass?: string
  /** 只显示图标。抽屉里仍显示文字。 @default false */
  isIconOnly?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  size?: NavItemSize
}

export interface TopNavItemEmits {
  click: [event: MouseEvent]
}

export interface TopNavMenuItem {
  id?: string
  label: string
  description?: string
  href?: string
  iconClass?: string
  isDisabled?: boolean
}

export interface TopNavMenuProps {
  /** 触发按钮上的文字。 */
  label: string
  /** 数据项。也可以用默认插槽写 `NavMenuItem`。 */
  items?: readonly TopNavMenuItem[]
  /** 悬停打开前的等待。 @default 150 */
  showDelay?: number
  /** 指针离开后的关闭等待。 @default 200 */
  hideDelay?: number
}

export interface TopNavMenuEmits {
  openChange: [isOpen: boolean]
}

export interface TopNavMegaMenuProps {
  label: string
  showDelay?: number
  hideDelay?: number
}

export interface TopNavMegaMenuEmits {
  openChange: [isOpen: boolean]
}

export interface TopNavMegaMenuItemProps {
  /** 项的标题。 */
  title: string
  description?: string
  href?: string
  as?: NavLinkComponent
  iconClass?: string
}

export interface TopNavMegaMenuItemSlots {
  icon?: () => unknown
}

export interface TopNavMegaMenuFeaturedCardProps {
  title: string
  description?: string
  href?: string
  as?: NavLinkComponent
}

export interface TopNavMegaMenuFeaturedCardSlots {
  default?: () => unknown
}
