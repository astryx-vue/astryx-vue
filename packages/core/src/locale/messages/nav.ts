import type { AstryxLocale } from '../types.js'

export interface NavMessages {
  sideNav: string
  topNav: string
  mobileNav: string
  collapseSidebar: string
  expandSidebar: string
  openMenu: string
  close: string
  more: string
  moreItems: (count: number) => string
  expandItem: (label: string) => string
  collapseItem: (label: string) => string
  submenu: (label: string) => string
}

export const navMessages: Record<AstryxLocale, NavMessages> = {
  'en': {
    sideNav: 'Sidebar',
    topNav: 'Top navigation',
    mobileNav: 'Navigation',
    collapseSidebar: 'Collapse sidebar',
    expandSidebar: 'Expand sidebar',
    openMenu: 'Open menu',
    close: 'Close',
    more: 'More',
    moreItems: count => `${count} more`,
    expandItem: label => `Expand ${label}`,
    collapseItem: label => `Collapse ${label}`,
    submenu: label => `${label} submenu`,
  },
  'zh-CN': {
    sideNav: '侧边导航',
    topNav: '顶部导航',
    mobileNav: '导航',
    collapseSidebar: '收起侧边栏',
    expandSidebar: '展开侧边栏',
    openMenu: '打开菜单',
    close: '关闭',
    more: '更多',
    moreItems: count => `还有 ${count} 项`,
    expandItem: label => `展开${label}`,
    collapseItem: label => `收起${label}`,
    submenu: label => `${label}子菜单`,
  },
}
