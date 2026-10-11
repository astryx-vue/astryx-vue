export const navEn = {
  sideNav: 'Sidebar',
  topNav: 'Top navigation',
  mobileNav: 'Navigation',
  collapseSidebar: 'Collapse sidebar',
  expandSidebar: 'Expand sidebar',
  openMenu: 'Open menu',
  close: 'Close',
  more: 'More',
  moreItems: (count: number) => `${count} more`,
  expandItem: (label: string) => `Expand ${label}`,
  collapseItem: (label: string) => `Collapse ${label}`,
  submenu: (label: string) => `${label} submenu`,
}

export const navZh = {
  sideNav: '侧边导航',
  topNav: '顶部导航',
  mobileNav: '导航',
  collapseSidebar: '收起侧边栏',
  expandSidebar: '展开侧边栏',
  openMenu: '打开菜单',
  close: '关闭',
  more: '更多',
  moreItems: (count: number) => `还有 ${count} 项`,
  expandItem: (label: string) => `展开${label}`,
  collapseItem: (label: string) => `收起${label}`,
  submenu: (label: string) => `${label}子菜单`,
}
