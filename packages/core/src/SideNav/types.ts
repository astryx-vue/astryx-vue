import type { HandleRef } from '../composables/useHandleRef.js'
import type { NavItemSize, NavLinkComponent } from '../NavItem/types.js'
import type { NavMenuFocusRequest } from '../NavMenu/context.js'

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

export interface SideNavResizable {
  /** 初始宽度，像素。 @default 260 */
  defaultWidth?: number
  /** 最小宽度，像素。 @default 180 */
  minWidth?: number
  /** 最大宽度，像素。 @default 480 */
  maxWidth?: number
  /** 把宽度和收起状态记在 localStorage，键名以 `astryx-resizable:` 开头。 */
  autoSaveId?: string
  onWidthChange?: (width: number) => void
  /** 由拖拽配置拥有收起状态。和 `collapsible` 同时写时，以这里为准。 */
  defaultIsCollapsed?: boolean
  isCollapsed?: boolean
  onCollapseChange?: (isCollapsed: boolean) => void
}

export interface SideNavHandle {
  readonly isCollapsed: boolean
  toggle: () => void
  collapse: () => void
  expand: () => void
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
  /**
   * 在结束边拖宽度。`true` 使用 260px 初始、180–480px 范围。
   * 收起后把手隐藏。拖到 160px 以下会收起（需要同时可收起）。
   * @default false
   */
  resizable?: boolean | SideNavResizable
  /**
   * 侧栏外面的收起按钮可以拿这个句柄。
   * 和根元素的模板 ref 分开。更常见的做法是两边共用 `v-model:is-collapsed`。
   */
  handleRef?: HandleRef<SideNavHandle>
}

export interface SideNavEmits {
  'update:isCollapsed': [isCollapsed: boolean]
  'collapsedChange': [isCollapsed: boolean]
  'widthChange': [width: number]
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

export interface SideNavHeadingMenuScope {
  close: () => void
  focusRequest: NavMenuFocusRequest
}

export interface SideNavHeadingProps {
  /** 产品或应用名称。 */
  heading: string
  headingHref?: string
  superheading?: string
  superheadingHref?: string
  subheading?: string
  subheadingHref?: string
  /**
   * 标志单独成链接、旁边没有可读文字时的无障碍名称。
   * 不传则用 `heading`。
   */
  logoLabel?: string
  as?: NavLinkComponent
}

export interface SideNavHeadingSlots {
  icon?: () => unknown
  menu?: (props: SideNavHeadingMenuScope) => unknown
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
  /**
   * 和主控件并列的行内操作，例如图标按钮或菜单。
   * 不放进链接或按钮里面。侧栏收起后不渲染。
   */
  actions?: () => unknown
}

export type SideNavCollapseButtonSize = 'sm' | 'md' | 'lg'

/**
 * 受控的收起配置。同一份对象可以同时交给 `SideNav` 的 `collapsible`
 * 和侧栏外面那个按钮的 `collapsible`，两边就共用一个状态。
 */
export interface SideNavControlledCollapsible extends SideNavCollapsible {
  /** 当前是否收起。 */
  isCollapsed: boolean
  /** 按钮被点时回调，参数是想要的新状态。 */
  onCollapsedChange: (isCollapsed: boolean) => void
}

export interface SideNavCollapseButtonProps {
  /**
   * 自定义按钮文字。给了就渲染成「箭头 + 文字」的按钮；不给就只显示箭头图标。
   */
  label?: string
  /**
   * 和 `SideNav` 收到的同一个受控 `collapsible` 对象。
   * 只在按钮渲染在侧栏外面、读不到侧栏上下文时需要。它优先于 `isCollapsed`。
   */
  collapsible?: SideNavControlledCollapsible
  /**
   * 按钮不在 SideNav 里面时，用 `v-model:isCollapsed` 和侧栏连到同一个状态。
   */
  isCollapsed?: boolean
  /**
   * 按钮尺寸。默认跟着容器走：SideNav 里面是 `sm`，外面是 `md`。
   */
  size?: SideNavCollapseButtonSize
}

export interface SideNavCollapseButtonEmits {
  'update:isCollapsed': [isCollapsed: boolean]
}

export interface SideNavCollapseButtonSlots {
  /** 自定义按钮内容。替换默认的箭头图标；文字仍然由 `label` 控制。 */
  default?: () => unknown
}
