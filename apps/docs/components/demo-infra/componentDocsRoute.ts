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
    tab: 'overview' | 'props' | 'accessibility'
  }
  | {
    kind: 'lab'
    locale: DocsLocale
    /** 概览页没有具体组件。 */
    slug: string | null
  }

/** 本站文档对齐的上游包名和版本，显示在组件页标题下面。 */
export const UPSTREAM_PACKAGE = '@astryxdesign/core'
export const UPSTREAM_VERSION = '0.7.1'

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

  const tab = segments[2]
  if (segments.length === 3 && tab !== 'props' && tab !== 'accessibility') {
    return null
  }

  return {
    kind: 'detail',
    locale,
    name: componentName(locale, slug),
    slug,
    tab: tab === 'props' || tab === 'accessibility' ? tab : 'overview',
  }
}
