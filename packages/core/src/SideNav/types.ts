import type { NavItemSize, NavLinkComponent } from '../NavItem/types.js'

export interface SideNavCollapsible {
  /** 非受控时的初始收起状态。 @default false */
  defaultIsCollapsed?: boolean
  /** 受控的收起状态。也可以用 `v-model:isCollapsed`。 */
  isCollapsed?: boolean
  /** 是否渲染内置的收起按钮。 @default true */
  hasButton?: boolean
  /** 内置收起按钮的无障碍名称。不传则随状态切换。 */
  buttonLabel?: string
  /**
   * 收起和展开的快捷键，例如 `mod+\\`。
   * 只在可收起时生效，焦点在输入框里不会触发。
   */
  hotkey?: string
}

export interface SideNavItemCollapsible {
  defaultIsCollapsed?: boolean
  isCollapsed?: boolean
}

export interface SideNavProps {
  /** 导航地标的无障碍名称。默认走当前语言的「侧边导航」。 */
  label?: string
  /**
   * 允许收成只剩图标的窄栏。
   * `true` 使用默认按钮和非受控状态；对象可受控、关掉内置按钮或加快捷键。
   * @default false
   */
  collapsible?: boolean | SideNavCollapsible
  /** 受控收起状态，配合 `v-model:isCollapsed`。 */
  isCollapsed?: boolean
}

export interface SideNavEmits {
  'update:isCollapsed': [isCollapsed: boolean]
  'collapsedChange': [isCollapsed: boolean]
}

export interface SideNavSlots {
  default?: () => unknown
  header?: () => unknown
  top?: () => unknown
  footer?: () => unknown
  footerIcons?: () => unknown
}

export interface SideNavSectionProps {
  /** 分组标题。收起后仍留给读屏。 */
  title: string
  /** 标题下面的一行辅助文字。 */
  subtitle?: string
  /** 视觉上隐藏标题，读屏仍能读到。 @default false */
  isHeaderHidden?: boolean
}

export interface SideNavSectionSlots {
  default?: () => unknown
  end?: () => unknown
}

export interface SideNavHeadingProps {
  /** 产品或应用名称。 */
  heading: string
  headingHref?: string
  superheading?: string
  superheadingHref?: string
  subheading?: string
  subheadingHref?: string
  as?: NavLinkComponent
}

export interface SideNavHeadingSlots {
  icon?: () => unknown
  menu?: () => unknown
  end?: () => unknown
}

export interface SideNavItemProps {
  label: string
  href?: string
  as?: NavLinkComponent
  target?: string
  rel?: string
  iconClass?: string
  selectedIconClass?: string
  isSelected?: boolean
  isDisabled?: boolean
  size?: NavItemSize
  /**
   * 有下级时是否可以收起。
   * 不传时，有下级就会收起；传 `false` 则下级一直展开。
   * 同时有 `href` 时，点文字会跳转，点箭头才收起。
   */
  collapsible?: boolean | SideNavItemCollapsible
}

export interface SideNavItemEmits {
  click: [event: MouseEvent]
}

export interface SideNavItemSlots {
  default?: () => unknown
  icon?: () => unknown
  selectedIcon?: () => unknown
  end?: () => unknown
}

export interface SideNavCollapseButtonProps {
  /** 覆盖默认的「收起侧边栏 / 展开侧边栏」。 */
  label?: string
  /**
   * 按钮不在 SideNav 里面时，用 `v-model:isCollapsed` 和侧栏连到同一个状态。
   */
  isCollapsed?: boolean
}

export interface SideNavCollapseButtonEmits {
  'update:isCollapsed': [isCollapsed: boolean]
}
