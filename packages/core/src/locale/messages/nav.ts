import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

export interface NavMessages {
  sideNav: string
  topNav: string
  mobileNav: string
  collapseSidebar: string
  expandSidebar: string
  openMenu: string
  /** SideNav 标题旁菜单按钮的名字，带上看得见的标题文字。 */
  headingOpenMenu: (heading: string) => string
  /**
   * TopNav 标题旁菜单按钮的名字，和 SideNav 的分开写。
   * `hasHeading` 是 `'true'` 时带上标题文字，否则只说「打开菜单」。
   */
  topNavOpenMenu: (hasHeading: string, heading: string) => string
  /** SideNav 标题下拉弹层的无障碍名。 */
  headingDialog: string
  /** TopNav 标题下拉弹层的无障碍名，和 SideNav 的分开写。 */
  topNavHeadingDialog: string
  openNavigation: string
  /** 移动端抽屉里关闭按钮的名字。 */
  close: string
  more: string
  moreItems: (count: number) => string
  avatarOverflow: (count: number) => string
  avatarNameWithStatus: (name: string, status: string) => string
  expandItem: (label: string) => string
  collapseItem: (label: string) => string
  submenu: (label: string) => string
  resizeSidebar: string
  opensInNewTab: string
}

export const navMessages: Record<AstryxLocale, NavMessages> = {
  'en': {
    sideNav: 'Side navigation',
    topNav: 'Top navigation',
    mobileNav: 'Navigation',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    openMenu: 'Open menu',
    headingOpenMenu: heading => `${heading}, Open menu`,
    topNavOpenMenu: (hasHeading, heading) => hasHeading === 'true' ? `${heading}, Open menu` : 'Open menu',
    headingDialog: 'Navigation menu',
    topNavHeadingDialog: 'Navigation menu',
    openNavigation: 'Open navigation',
    close: 'Close navigation',
    more: 'More',
    moreItems: count => `${count} more`,
    avatarOverflow: count => `${formatCount(count, 'en')} more`,
    avatarNameWithStatus: (name, status) => `${name}, ${status}`,
    expandItem: label => `Expand ${label}`,
    collapseItem: label => `Collapse ${label}`,
    submenu: label => `${label} submenu`,
    resizeSidebar: 'Resize sidebar',
    opensInNewTab: '(opens in new tab)',
  },
  'zh-CN': {
    sideNav: '侧边导航',
    topNav: '顶部导航',
    mobileNav: '导航',
    collapseSidebar: '收起侧边栏',
    expandSidebar: '展开侧边栏',
    openMenu: '打开菜单',
    headingOpenMenu: heading => `${heading}，打开菜单`,
    topNavOpenMenu: (hasHeading, heading) => hasHeading === 'true' ? `${heading}，打开菜单` : '打开菜单',
    headingDialog: '导航菜单',
    topNavHeadingDialog: '导航菜单',
    openNavigation: '打开导航',
    close: '关闭导航',
    more: '更多',
    moreItems: count => `还有 ${count} 项`,
    avatarOverflow: count => `还有 ${formatCount(count, 'zh-CN')} 个`,
    avatarNameWithStatus: (name, status) => `${name}，${status}`,
    expandItem: label => `展开${label}`,
    collapseItem: label => `收起${label}`,
    submenu: label => `${label}子菜单`,
    resizeSidebar: '调整侧边栏宽度',
    opensInNewTab: '（在新标签页中打开）',
  },
}
