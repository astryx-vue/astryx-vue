export type DocsLocale = 'en' | 'zh'

export function localePath(locale: DocsLocale, path: string): string {
  return locale === 'en' ? `/en${path}` : path
}

/**
 * 组件页的界面文案。放在这里而不是组件目录里，
 * 是为了让构建期脚本也能读到同一份标题（那边不能走 Vite 的 glob）。
 */
export const componentDocsCopy = {
  en: {
    catalogTitle: 'Components',
    closeNavigation: 'Close navigation',
    documentation: 'documentation',
    menu: 'Menu',
    navigation: 'Component navigation',
    accessibility: 'Accessibility',
    overview: 'Overview',
    props: 'Properties',
    returnToTop: 'Return to top',
  },
  zh: {
    catalogTitle: '组件',
    closeNavigation: '关闭导航',
    documentation: '文档',
    menu: '菜单',
    navigation: '组件导航',
    accessibility: '无障碍',
    overview: '总览',
    props: '属性',
    returnToTop: '返回顶部',
  },
} as const
