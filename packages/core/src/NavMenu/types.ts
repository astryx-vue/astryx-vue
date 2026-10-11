import type { NavLinkComponent } from '../NavItem/types.js'
import type { NavMenuFocusRequest, NavMenuSize } from './context.js'

export interface NavMenuProps {
  /** 菜单的无障碍名称。 */
  label?: string
  /** 菜单宽度档。 @default 'md' */
  size?: NavMenuSize
  /** 打开后把焦点放到第一项或最后一项。指针打开时保持 null。 */
  focusRequest?: NavMenuFocusRequest
}

export interface NavMenuEmits {
  close: []
}

export interface NavMenuItemProps {
  /** 菜单项文字。 */
  label: string
  /** 辅助说明，显示在文字下面。 */
  description?: string
  /** 有地址时渲染成链接。 */
  href?: string
  /** 链接根组件。 */
  as?: NavLinkComponent
  /** 图标 CSS class。 */
  iconClass?: string
  /** 禁用。 @default false */
  isDisabled?: boolean
  /** 选中后不关闭菜单。 @default false */
  keepOpen?: boolean
  /**
   * 放在 `role="menu"` 里时为菜单项。
   * 抽屉里的同一条内容改成普通链接，避免菜单项脱离菜单。
   * @default true
   */
  isMenuItem?: boolean
}

export interface NavMenuItemEmits {
  click: [event: MouseEvent]
}

export interface NavMenuItemSlots {
  icon?: () => unknown
  end?: () => unknown
}

export interface NavDisclosureProps {
  /** 弹出层的无障碍名称。菜单自己有名称时可以不传。 */
  label?: string
  placement?: 'above' | 'below' | 'start' | 'end'
  alignment?: 'start' | 'center' | 'end'
  /** 悬停一段时间后打开，离开后关闭。 @default false */
  hover?: boolean
  /** 悬停打开前的等待，毫秒。 @default 150 */
  showDelay?: number
  /** 指针离开后的关闭等待，毫秒。 @default 200 */
  hideDelay?: number
  /** 加在弹出层上的 class。 */
  panelClass?: string
}

export interface NavDisclosureSlots {
  trigger?: (props: { isOpen: boolean, panelId: string }) => unknown
  default?: (props: { close: () => void, focusRequest: NavMenuFocusRequest }) => unknown
}
