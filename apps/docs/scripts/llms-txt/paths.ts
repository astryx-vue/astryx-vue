/**
 * 源文件路径和产物路径之间的换算，以及页面归属的判断。
 * 页面 `<head>` 里的链接和写出的 Markdown 都按这里的规则算，两边不会走偏。
 */
import type { DocsLocale } from '../../components/demo-infra/docs-i18n.ts'

/** 组件页的分页文件名。这些文件会并进总览那一篇。 */
export const COMPONENT_TABS = ['props', 'accessibility'] as const

export type ComponentTab = (typeof COMPONENT_TABS)[number]

export interface LlmsPage {
  /** 相对 `srcDir` 的源文件路径，例如 `en/components/button/index.md`。 */
  sourcePath: string
  /** 去掉语言前缀后的路径，例如 `en/components/button/index.md`。 */
  sitePath: string
  locale: DocsLocale
  /** 输出到 `dist` 的 Markdown 路径，例如 `en/components/button.md`。 */
  markdownPath: string
  /** 站点上的页面路径，例如 `/en/components/button`。 */
  url: string
  kind: 'home' | 'catalog' | 'component' | 'other'
  slug?: string
  tab?: ComponentTab
}

/**
 * 中文页面没有语言前缀，英文页面有 `en/`。
 * 这里和 `.vitepress/config.ts` 里的 `rewrites` 是同一套规则。
 */
export function localizeSourcePath(sourcePath: string): string {
  return sourcePath.startsWith('zh/') ? sourcePath.slice('zh/'.length) : sourcePath
}

/**
 * 源文件对应的 Markdown 产物路径。目录的 `index.md` 收成同级文件，
 * 组件页的 `props.md` / `accessibility.md` 并到总览那一份。
 */
export function markdownPathFor(sourcePath: string): string {
  const parts = localizeSourcePath(sourcePath).split('/')
  const file = parts.pop()?.replace(/\.md$/, '') ?? 'index'
  const dir = parts.join('/')
  if (file === 'index')
    return dir === '' ? 'index.md' : `${dir}.md`
  if (isComponentTab(parts, file))
    return `${dir}.md`
  return `${dir}/${file}.md`
}

/** 组件页的分页才有资格并进总览，别的地方也可能有同名文件。 */
function isComponentTab(dirParts: readonly string[], file: string): boolean {
  if (!(COMPONENT_TABS as readonly string[]).includes(file))
    return false
  const [first, second] = dirParts
  return first === 'components'
    ? dirParts.length === 2
    : first === 'en' && second === 'components' && dirParts.length === 3
}

/** Markdown 产物对应的站点路径，末尾不带 `/`。 */
export function urlForMarkdownPath(markdownPath: string): string {
  const withoutExt = markdownPath.replace(/\.md$/, '')
  return withoutExt === 'index' ? '/' : `/${withoutExt}`
}

/** 侧栏链接（可能带尾斜杠）对应的 Markdown 产物路径。 */
export function markdownPathForUrl(url: string): string {
  const path = url.replace(/^\//, '').replace(/\/$/, '')
  return path === '' ? 'index.md' : `${path}.md`
}

/** 页面归属：首页、组件总览、组件页（含分页）、其它。 */
export function classifyPage(sourcePath: string): Pick<LlmsPage, 'kind' | 'slug' | 'tab'> {
  const sitePath = localizeSourcePath(sourcePath).replace(/\.md$/, '')
  const path = sitePath.startsWith('en/') ? sitePath.slice('en/'.length) : sitePath
  const parts = path.split('/')

  if (path === 'index')
    return { kind: 'home' }
  if (parts.length !== 3 || parts[0] !== 'components')
    return { kind: parts.length === 2 && parts[0] === 'components' && parts[1] === 'index' ? 'catalog' : 'other' }
  if (parts[2] === 'index')
    return { kind: 'component', slug: parts[1] }
  if ((COMPONENT_TABS as readonly string[]).includes(parts[2]))
    return { kind: 'component', slug: parts[1], tab: parts[2] as ComponentTab }
  return { kind: 'other' }
}

export function describePage(sourcePath: string): LlmsPage {
  const markdownPath = markdownPathFor(sourcePath)
  return {
    sourcePath,
    sitePath: localizeSourcePath(sourcePath),
    locale: sourcePath.startsWith('en/') ? 'en' : 'zh',
    markdownPath,
    url: urlForMarkdownPath(markdownPath),
    ...classifyPage(sourcePath),
  }
}
