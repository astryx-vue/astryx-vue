/**
 * 生成站点给 AI agent 读的纯文本产物：
 *
 * - `llms.txt` / `llms-zh.txt`：按分组列出全部页面的 Markdown 地址和一句话说明。
 * - `llms-full.txt` / `llms-full-zh.txt`：全部正文合成一个文件。
 * - 每页一份 `.md`：英文在 `/en/<path>.md`，中文在 `/<path>.md`（中文没有语言前缀）。
 *
 * 组件页在源文件里拆成 `index.md`、`props.md`、`accessibility.md` 三份，这里合并成一篇文章，
 * 只输出总览那一份 Markdown。
 *
 * 各步骤的实现在 `llms-txt/` 目录：`paths` 管路径换算，`sources` 读素材，
 * `expand` 展开 Vue 块，`render-page` 渲染单页，`render-index` 渲染两个汇总文件。
 * 这个文件负责把它们串起来并写盘。
 */
import type { DocsLocale } from '../components/demo-infra/docs-i18n.ts'
import type { LlmsPage } from './llms-txt/paths.ts'
import type { LlmsPageEntry, RenderOptions } from './llms-txt/render-page.ts'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCustomProperties } from '../components/theme-tokens/parseTokens.ts'
import { describePage, routeForSourcePath } from './llms-txt/paths.ts'
import { renderFullText, renderIndex } from './llms-txt/render-index.ts'
import { renderPage } from './llms-txt/render-page.ts'
import { loadCatalog, loadDemoContents, loadDemoSources, loadStandaloneDemoSources } from './llms-txt/sources.ts'

export type { ExpandContext } from './llms-txt/expand.ts'
export { createExpander } from './llms-txt/expand.ts'
export type { LlmsPage } from './llms-txt/paths.ts'
export { classifyPage, localizeSourcePath, markdownPathFor, markdownPathForUrl, routeForSourcePath, urlForMarkdownPath } from './llms-txt/paths.ts'
export { collectSections, SITE_URL } from './llms-txt/render-index.ts'
export type { LlmsPageEntry } from './llms-txt/render-page.ts'

const LOCALES = ['en', 'zh'] as const

/** 汇总文件超过这个体积，就把演示源码从全文里去掉。 */
const FULL_TEXT_BUDGET = 2_000_000

export interface LlmsArtifacts {
  pages: number
  files: Array<{ name: string, bytes: number }>
  /** 页面引用了、但没找到源码的演示，出现时说明 demos 目录的命名变了。 */
  unresolvedDemos: string[]
}

/** 站点上的一个页面：源文件和它实际发布到的路由。 */
export interface LlmsSitePage {
  /** 相对 `srcDir` 的源文件路径，例如 `en/components/button/index.md`。 */
  sourcePath: string
  /** 站点生成器给出的页面路由，例如 `/en/components/button`。 */
  routePath: string
}

export interface LlmsBuildOptions {
  /** 站点的 `srcDir`，从这里读页面源文件。 */
  docsDir: string
  /** 站点全部页面。 */
  pages: readonly LlmsSitePage[]
  /** 把一个产物写到构建输出目录，`name` 相对输出目录。 */
  write: (name: string, content: string) => Promise<void>
  /** `apps/docs` 目录，默认按脚本位置推断。 */
  appDir?: string
}

/** 末尾的 `/` 只是目录页的写法，比较路由时去掉。 */
function normalizeRoute(route: string): string {
  return route.length > 1 && route.endsWith('/') ? route.slice(0, -1) : route
}

/**
 * 写出全部产物。每个页面都有对应的 Markdown，页面 `<head>` 里的链接
 * 用同一个 `markdownPathFor` 算出来，两边不会走偏。
 */
export async function generateLlmsArtifacts(options: LlmsBuildOptions): Promise<LlmsArtifacts> {
  const appDir = options.appDir ?? fileURLToPath(new URL('..', import.meta.url))
  const demosDir = join(appDir, 'components/demos')

  // Markdown 的网址按 `paths.ts` 里的规则算，这里核对它和站点实际路由一致，
  // 否则 `llms.txt` 会指向不存在的页面。
  const mismatched = options.pages
    .filter(page => normalizeRoute(page.routePath) !== routeForSourcePath(page.sourcePath))
    .map(page => `${page.sourcePath} → ${page.routePath}（预期 ${routeForSourcePath(page.sourcePath)}）`)
  if (mismatched.length > 0)
    throw new Error(`llms: 这些页面的路由和 Markdown 网址规则对不上，Markdown 网址会指向不存在的页面：\n${mismatched.join('\n')}`)

  const writeArtifact = async (name: string, content: string): Promise<{ name: string, bytes: number }> => {
    await options.write(name, content)
    return { name, bytes: Buffer.byteLength(content) }
  }

  const [componentDemoSources, standaloneDemoSources, catalog, tokens] = await Promise.all([
    loadDemoSources(demosDir),
    loadStandaloneDemoSources(join(appDir, 'components')),
    loadCatalog(demosDir),
    readFile(join(appDir, '../../packages/themes/neutral/base.css'), 'utf8').then(parseCustomProperties),
  ])
  const demos = await loadDemoContents(new Map([...componentDemoSources, ...standaloneDemoSources]))
  const unresolvedDemos = new Set<string>()
  const pages = options.pages.map(page => page.sourcePath).sort().map(describePage)

  const groups = new Map<string, LlmsPage[]>()
  for (const page of pages) {
    const group = groups.get(page.markdownPath)
    if (group === undefined)
      groups.set(page.markdownPath, [page])
    else
      group.push(page)
  }

  const renderAll = async (includeDemoSource: boolean): Promise<LlmsPageEntry[]> => {
    const renderOptions: RenderOptions = { includeDemoSource, demos, tokens, catalog, unresolvedDemos }
    const result: LlmsPageEntry[] = []
    for (const group of groups.values())
      result.push(await renderPage(group, renderOptions, options.docsDir))
    return result
  }

  const rendered = await renderAll(true)
  const files: Array<{ name: string, bytes: number }> = []
  for (const entry of rendered)
    files.push(await writeArtifact(entry.page.markdownPath, entry.markdown))

  const fullTexts = {} as Record<DocsLocale, string>
  for (const locale of LOCALES)
    fullTexts[locale] = renderFullText(locale, rendered.filter(entry => entry.page.locale === locale), catalog)

  const overBudget = LOCALES.some(locale => Buffer.byteLength(fullTexts[locale]) > FULL_TEXT_BUDGET)
  if (overBudget) {
    const lean = await renderAll(false)
    for (const locale of LOCALES)
      fullTexts[locale] = renderFullText(locale, lean.filter(entry => entry.page.locale === locale), catalog)
  }

  for (const locale of LOCALES) {
    files.push(await writeArtifact(locale === 'en' ? 'llms.txt' : 'llms-zh.txt', renderIndex(locale, rendered.filter(entry => entry.page.locale === locale), catalog)))
    files.push(await writeArtifact(locale === 'en' ? 'llms-full.txt' : 'llms-full-zh.txt', fullTexts[locale]))
  }

  return { pages: rendered.length, files, unresolvedDemos: [...unresolvedDemos].sort() }
}
