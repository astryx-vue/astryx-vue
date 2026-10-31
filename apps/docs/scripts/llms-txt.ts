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
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCustomProperties } from '../components/theme-tokens/parseTokens.ts'
import { describePage } from './llms-txt/paths.ts'
import { renderFullText, renderIndex } from './llms-txt/render-index.ts'
import { renderPage } from './llms-txt/render-page.ts'
import { listMarkdown, loadCatalog, loadDemoContents, loadDemoSources, loadStandaloneDemoSources, resolveHtmlPath } from './llms-txt/sources.ts'

export type { ExpandContext } from './llms-txt/expand.ts'
export { createExpander } from './llms-txt/expand.ts'
export type { LlmsPage } from './llms-txt/paths.ts'
export { classifyPage, localizeSourcePath, markdownPathFor, markdownPathForUrl, urlForMarkdownPath } from './llms-txt/paths.ts'
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

export interface LlmsBuildOptions {
  /** VitePress 的 `srcDir`。 */
  docsDir: string
  /** VitePress 的 `outDir`，产物写到这里。 */
  outDir: string
  /** `apps/docs` 目录，默认按脚本位置推断。 */
  appDir?: string
}

async function writeArtifact(outDir: string, name: string, content: string): Promise<{ name: string, bytes: number }> {
  const path = join(outDir, name)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content, 'utf8')
  return { name, bytes: Buffer.byteLength(content) }
}

/**
 * 写出全部产物。`dist` 里每个页面都有对应的 Markdown，页面 `<head>` 里的链接
 * 用同一个 `markdownPathFor` 算出来，两边不会走偏。
 */
export async function generateLlmsArtifacts(options: LlmsBuildOptions): Promise<LlmsArtifacts> {
  const appDir = options.appDir ?? fileURLToPath(new URL('..', import.meta.url))
  const demosDir = join(appDir, 'components/demos')
  const [pages, componentDemoSources, standaloneDemoSources, catalog, tokens] = await Promise.all([
    listMarkdown(options.docsDir).then(files => files.map(describePage)),
    loadDemoSources(demosDir),
    loadStandaloneDemoSources(join(appDir, 'components/charts-demos')),
    loadCatalog(demosDir),
    readFile(join(appDir, '../../packages/themes/neutral/base.css'), 'utf8').then(parseCustomProperties),
  ])
  const demos = await loadDemoContents(new Map([...componentDemoSources, ...standaloneDemoSources]))
  const unresolvedDemos = new Set<string>()

  const missing: string[] = []
  for (const page of pages) {
    if (await resolveHtmlPath(options.outDir, page.sitePath) === null)
      missing.push(page.sourcePath)
  }
  if (missing.length > 0) {
    throw new Error(`llms: 这些页面没有对应的 HTML，Markdown 网址会指向不存在的页面：\n${missing.join('\n')}`)
  }

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
    files.push(await writeArtifact(options.outDir, entry.page.markdownPath, entry.markdown))

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
    files.push(await writeArtifact(options.outDir, locale === 'en' ? 'llms.txt' : 'llms-zh.txt', renderIndex(locale, rendered.filter(entry => entry.page.locale === locale), catalog)))
    files.push(await writeArtifact(options.outDir, locale === 'en' ? 'llms-full.txt' : 'llms-full-zh.txt', fullTexts[locale]))
  }

  return { pages: rendered.length, files, unresolvedDemos: [...unresolvedDemos].sort() }
}
