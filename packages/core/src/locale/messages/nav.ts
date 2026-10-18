import type { AstryxLocale } from '../types.js'

export interface NavMessages {
  sideNav: string
  topNav: string
  mobileNav: string
  collapseSidebar: string
  expandSidebar: string
  openMenu: string
  openNavigation: string
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
    sideNav: 'Sidebar',
    topNav: 'Top navigation',
    mobileNav: 'Navigation',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    openMenu: 'Open menu',
    openNavigation: 'Open navigation',
    close: 'Close',
    more: 'More',
    moreItems: count => `${count} more`,
    avatarOverflow: count => `${count} more`,
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
    openNavigation: '打开导航',
    close: '关闭',
    more: '更多',
    moreItems: count => `还有 ${count} 项`,
    avatarOverflow: count => `还有 ${count} 个`,
    avatarNameWithStatus: (name, status) => `${name}，${status}`,
    expandItem: label => `展开${label}`,
    collapseItem: label => `收起${label}`,
    submenu: label => `${label}子菜单`,
    resizeSidebar: '调整侧栏宽度',
    opensInNewTab: '（在新标签页打开）',
  },
}
