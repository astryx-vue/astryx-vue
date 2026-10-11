import type { ComponentSlug } from './componentCatalog'
import type { DocsLocale } from './docs-i18n'
import { componentName, isComponentSlug } from './componentCatalog'

export { COMPONENT_SLUGS, isComponentSlug } from './componentCatalog'
export type { ComponentGroup, ComponentSlug } from './componentCatalog'

export type ComponentDocsRoute
  = | {
    kind: 'catalog'
    locale: DocsLocale
  }
  | {
    kind: 'detail'
    locale: DocsLocale
    name: string
    slug: ComponentSlug
    tab: 'overview' | 'props'
  }

export const componentDocsCopy = {
  en: {
    catalogTitle: 'Components',
    closeNavigation: 'Close navigation',
    documentation: 'documentation',
    menu: 'Menu',
    navigation: 'Component navigation',
    overview: 'Overview',
    props: 'Props',
    returnToTop: 'Return to top',
  },
  zh: {
    catalogTitle: '组件',
    closeNavigation: '关闭导航',
    documentation: '文档',
    menu: '菜单',
    navigation: '组件导航',
    overview: '总览',
    props: '属性',
    returnToTop: '返回顶部',
  },
} as const

function normalizeDocsPathname(pathname: string): string {
  const withoutHtml = pathname.replace(/\.html$/i, '')
  const withoutIndex = withoutHtml.replace(/\/index$/i, '')
  return withoutIndex.replace(/\/+$/, '') || '/'
}

export function parseComponentDocsRoute(pathname: string): ComponentDocsRoute | null {
  const trimmed = normalizeDocsPathname(pathname)

  let locale: DocsLocale = 'zh'
  let path = trimmed
  if (path === '/en' || path.startsWith('/en/')) {
    locale = 'en'
    path = path.slice('/en'.length) || '/'
  }

  if (path === '/components') {
    return { kind: 'catalog', locale }
  }

  const segments = path.split('/').filter(Boolean)
  if (segments[0] !== 'components' || segments.length < 2 || segments.length > 3) {
    return null
  }

  const slug = segments[1]
  if (!isComponentSlug(slug)) {
    return null
  }

  if (segments.length === 3 && segments[2] !== 'props') {
    return null
  }

  return {
    kind: 'detail',
    locale,
    name: componentName(locale, slug),
    slug,
    tab: segments.length === 3 ? 'props' : 'overview',
  }
}
