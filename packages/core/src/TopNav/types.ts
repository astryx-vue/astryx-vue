import type { NavItemSize, NavLinkComponent } from '../NavItem/types.js'
import type { NavMenuFocusRequest } from '../NavMenu/context.js'

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
  /** 产品或应用名称。只有标志、没有文字时可以不传。 */
  heading?: string
  /**
   * 主标题的链接。只有这一处有链接、且没有菜单时，整段标题是一个链接。
   * `headingHref` 优先。
   */
  href?: string
  /** 和 `href` 相同，写出来是为了和侧栏标题对齐。 */
  headingHref?: string
  /** 标题上方的小字，例如套件名。 */
  superheading?: string
  superheadingHref?: string
  /** 标题下方的小字，例如当前账户。 */
  subheading?: string
  subheadingHref?: string
  /**
   * 标志单独成链接、旁边没有可读文字时的无障碍名称。
   * 不传则用 `heading`。标志不是链接时忽略。
   */
  logoLabel?: string
  /** 链接根组件。只在有地址时使用。 */
  as?: NavLinkComponent
}

export interface TopNavHeadingMenuScope {
  close: () => void
  focusRequest: NavMenuFocusRequest
}

export interface TopNavHeadingSlots {
  /** 标题前的标志。和 `icon` 是同一个位置，`logo` 优先。 */
  logo?: () => unknown
  icon?: () => unknown
  /** 标题行末尾，例如徽章。 */
  end?: () => unknown
  /** 弹出菜单。没有链接时整段标题打开它；有链接时只有箭头打开它。 */
  menu?: (props: TopNavHeadingMenuScope) => unknown
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
  /** 触发按钮上的文字。 */
  label: string
  /** 悬停打开前的等待。 @default 150 */
  showDelay?: number
  /** 指针离开后的关闭等待。 @default 250 */
  hideDelay?: number
}

export interface TopNavMegaMenuEmits {
  openChange: [isOpen: boolean]
}

export interface TopNavMegaMenuSlots {
  /** 菜单项。通常写 `TopNavMegaMenuItem`。 */
  default?: () => unknown
  /** 特色内容。桌面端在右侧栏，抽屉里排在本项下面。 */
  featured?: () => unknown
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
  /**
   * 整张卡片的链接。同时写了 `linkLabel` 时，链接改到卡片底部的行动文字上。
   */
  href?: string
  /** 正文上方的图片地址。 */
  image?: string
  /**
   * 图片的替代文本。不传时图片是装饰，读屏会跳过。
   * 卡片已经有标题，通常不用写。
   */
  imageAlt?: string
  /** 卡片底部的行动文字。和 `linkHref` 或 `href` 一起出现。 */
  linkLabel?: string
  /** 行动文字的地址。不传则用 `href`。 */
  linkHref?: string
  as?: NavLinkComponent
}

export interface TopNavMegaMenuFeaturedCardSlots {
  default?: () => unknown
}
