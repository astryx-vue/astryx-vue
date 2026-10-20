/**
 * 生成站点给 AI agent 读的纯文本产物：
 *
 * - `llms.txt` / `llms-zh.txt`：按分组列出全部页面的 Markdown 地址和一句话说明。
 * - `llms-full.txt` / `llms-full-zh.txt`：全部正文合成一个文件。
 * - 每页一份 `.md`：英文在 `/en/<path>.md`，中文在 `/<path>.md`（中文没有语言前缀）。
 *
 * 组件页在源文件里拆成 `index.md`、`props.md`、`accessibility.md` 三份，这里合并成一篇文章，
 * 只输出总览那一份 Markdown。
 */
import type { CatalogEntry } from '../components/demo-infra/demoMeta'
import type { DocsLocale } from '../components/demo-infra/docs-i18n'
import type { CustomProperty } from '../components/theme-tokens/parseTokens'
import type { BlockExpander, BlockTag } from './llms-markdown'
import { Buffer } from 'node:buffer'
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { guideSidebar, themeSidebar } from '../.vitepress/sidebar'
import { assembleCatalog, parseDemoMetaFields } from '../components/demo-infra/demoMeta'
import { componentDocsCopy } from '../components/demo-infra/docs-i18n'
import { COMPONENT_GROUPS, GROUP_TITLES } from '../components/demo-infra/groups'
import { accessibilityFor, anatomyFor } from '../components/demo-infra/reference/loadReference'
import { parseCustomProperties, sectionId, splitLightDark, TOKEN_SECTION_ORDER } from '../components/theme-tokens/parseTokens'
import { fenceBlock, firstParagraph, mergeSections, parseStringArray, stripFrontmatter, toPlainMarkdown, truncate } from './llms-markdown'

/** 线上站点地址。`llms.txt` 里的链接用绝对网址，方便别的机器直接抓。 */
export const SITE_URL = 'https://astryx-vue.pages.dev'

/** 组件页的分页文件名。这些文件会并进总览那一篇。 */
const COMPONENT_TABS = ['props', 'accessibility'] as const

type ComponentTab = (typeof COMPONENT_TABS)[number]

const LOCALES = ['en', 'zh'] as const

/** 汇总文件超过这个体积，就把演示源码从全文里去掉。 */
const FULL_TEXT_BUDGET = 2_000_000

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

export interface LlmsPageEntry {
  page: LlmsPage
  title: string
  description: string
  markdown: string
}

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

function describePage(sourcePath: string): LlmsPage {
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

async function listMarkdown(dir: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(join(dir, prefix), { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`
    if (entry.isDirectory()) {
      files.push(...await listMarkdown(dir, relative))
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.md'))
      files.push(relative)
  }
  return files.sort()
}

async function listFolders(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort()
}

const DEMO_IMPORT = /import[ \t]+(\w+)[ \t]+from[ \t]+'(\.[^']*?)\.vue\?raw&highlighted'/g
const DEMO_EXPORT = /export\s+const\s+(\w+)\s*=\s*defineDemo\(\s*(\w+)\s*,\s*(\w+)/g

/**
 * 演示组件的导出名 → `.vue` 源码。
 * 页面里只写 `<DemoExample :demo="buttonFloating" />`，靠这张表找回源码。
 */
async function loadDemoSources(demosDir: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  for (const folder of await listFolders(demosDir)) {
    const index = await readFile(join(demosDir, folder, 'index.ts'), 'utf8').catch(() => null)
    if (index === null)
      continue
    const imports = new Map(Array.from(index.matchAll(DEMO_IMPORT), match => [match[1], match[2]]))
    for (const match of index.matchAll(DEMO_EXPORT)) {
      const file = imports.get(match[3])
      if (file !== undefined)
        map.set(match[1], join(demosDir, folder, `${file}.vue`))
    }
  }
  return map
}

async function loadDemoContents(sources: Map<string, string>): Promise<Map<string, string>> {
  const entries = await Promise.all(Array.from(sources, async ([name, path]) => {
    const source = await readFile(path, 'utf8').catch(() => null)
    return source === null ? null : [name, source] as const
  }))
  return new Map(entries.filter(entry => entry !== null))
}

async function loadCatalog(demosDir: string): Promise<CatalogEntry[]> {
  const metas = await Promise.all((await listFolders(demosDir)).map(async (folder) => {
    const source = await readFile(join(demosDir, folder, 'meta.ts'), 'utf8').catch(() => null)
    return source === null ? null : parseDemoMetaFields(source)
  }))
  return assembleCatalog(metas.filter(meta => meta !== null))
}

const ACCESSIBILITY_LABELS: Record<DocsLocale, { criterion: string, check: string, states: string }> = {
  en: { criterion: 'Criterion', check: 'Check', states: 'States' },
  zh: { criterion: '准则', check: '要求', states: '适用状态' },
}

export interface ExpandContext {
  locale: DocsLocale
  slug?: string
  includeDemoSource: boolean
  demos: ReadonlyMap<string, string>
  tokens: readonly CustomProperty[]
  catalog: readonly CatalogEntry[]
  unresolvedDemos: Set<string>
}

/** `<DemoExample>` → 小标题 + 说明 + 演示源码，源码取自 demos 目录里的 `.vue`。 */
function expandDemo(tag: BlockTag, context: ExpandContext): string {
  const name = tag.attrs.demo ?? ''
  const source = context.demos.get(name)
  if (source === undefined && name !== '')
    context.unresolvedDemos.add(name)

  const parts: string[] = []
  if (tag.attrs.title !== undefined)
    parts.push(`### ${tag.attrs.title}`)
  if (tag.attrs.description !== undefined)
    parts.push(tag.attrs.description)
  if (source !== undefined && context.includeDemoSource)
    parts.push(fenceBlock(source, 'vue'))
  return parts.join('\n\n')
}

function expandAnatomy(context: ExpandContext): string {
  const parts = context.slug === undefined ? null : anatomyFor(context.slug, context.locale)
  if (parts === null || parts.length === 0)
    return ''
  const heading = context.locale === 'en' ? 'Anatomy' : '结构'
  const list = parts.map(part => `- **${part.name}**: ${part.description}`).join('\n')
  return `### ${heading}\n\n${list}`
}

function expandAccessibility(context: ExpandContext): string {
  const items = context.slug === undefined ? null : accessibilityFor(context.slug, context.locale)
  if (items === null || items.length === 0)
    return ''
  const labels = ACCESSIBILITY_LABELS[context.locale]
  return items.map(item => [
    `### ${item.name}`,
    [
      `- ${labels.criterion}: ${item.criterion}`,
      `- ${labels.check}: ${item.requirement}`,
      `- ${labels.states}: ${item.states.join(', ')}`,
    ].join('\n'),
    item.description,
  ].join('\n\n')).join('\n\n')
}

function tokenValue(value: string): string {
  const stops = splitLightDark(value)
  return (stops === null ? value : `${stops.light} / ${stops.dark}`).replace(/\|/g, '\\|')
}

/** `<TokenReference>` 的表格按 `neutral/base.css` 现算，这里用同一份源码生成。 */
function expandTokenReference(tag: BlockTag, context: ExpandContext): string {
  const wanted = parseStringArray(tag.attrs.sections)
  const blocks: string[] = []

  for (const id of TOKEN_SECTION_ORDER) {
    if (wanted !== null && !wanted.includes(id))
      continue
    const items = context.tokens.filter(token => sectionId(token.name) === id)
    if (items.length === 0)
      continue
    const rows = items.map(token => `| \`${token.name}\` | ${tokenValue(token.value)} |`)
    blocks.push([`### ${id}`, ['| Token | Value |', '| --- | --- |', ...rows].join('\n')].join('\n\n'))
  }

  return blocks.join('\n\n')
}

/** 组件总览页的目录，按分组列出每个组件。 */
function expandCatalog(context: ExpandContext): string {
  const prefix = context.locale === 'en' ? '/en' : ''
  return COMPONENT_GROUPS.flatMap((group) => {
    const entries = context.catalog.filter(entry => entry.group === group)
    if (entries.length === 0)
      return []
    const list = entries.map(entry => `- [${entry[context.locale]}](${prefix}/components/${entry.slug}.md)`).join('\n')
    return [`### ${GROUP_TITLES[context.locale][group]}\n\n${list}`]
  }).join('\n\n')
}

export function createExpander(context: ExpandContext): BlockExpander {
  return (tag) => {
    switch (tag.name) {
      case 'DemoExample': return expandDemo(tag, context)
      case 'ComponentAnatomy': return expandAnatomy(context)
      case 'ComponentAccessibility': return expandAccessibility(context)
      case 'TokenReference': return expandTokenReference(tag, context)
      case 'ComponentsOverview': return expandCatalog(context)
      default: return undefined
    }
  }
}

function titleFromSource(source: string): string | undefined {
  const { data, body } = stripFrontmatter(source)
  if (data.title !== undefined && data.title !== '')
    return data.title
  const heading = /^#[ \t]+(\S[^\n]*)$/m.exec(body)
  return heading?.[1].trim()
}

interface RenderOptions {
  includeDemoSource: boolean
  demos: ReadonlyMap<string, string>
  tokens: readonly CustomProperty[]
  catalog: readonly CatalogEntry[]
  unresolvedDemos: Set<string>
}

/** 一个组件或一个普通页面共用这段：读各分页、转纯文本、合并成一篇。 */
async function renderPage(
  group: readonly LlmsPage[],
  options: RenderOptions,
  docsDir: string,
): Promise<LlmsPageEntry> {
  const primary = group.find(item => item.tab === undefined) ?? group[0]
  const read = async (page: LlmsPage): Promise<string> => readFile(join(docsDir, page.sourcePath), 'utf8')
  const convert = async (page: LlmsPage): Promise<string> => toPlainMarkdown(
    await read(page),
    createExpander({ ...options, locale: page.locale, slug: page.slug }),
  )

  const source = await read(primary)
  const overview = await convert(primary)
  const tabs = await Promise.all(group
    .filter(item => item.tab !== undefined)
    .sort((a, b) => COMPONENT_TABS.indexOf(a.tab as ComponentTab) - COMPONENT_TABS.indexOf(b.tab as ComponentTab))
    .map(async item => ({
      heading: componentDocsCopy[item.locale][item.tab as ComponentTab],
      markdown: await convert(item),
    })))

  const catalogName = options.catalog.find(entry => entry.slug === primary.slug)?.[primary.locale]
  const title = titleFromSource(source) ?? catalogName ?? primary.slug ?? 'astryx-vue'
  // 首页整页都是组件，转成纯文本后什么都不剩，用 frontmatter 里的一句话补上。
  const { data } = stripFrontmatter(source)
  const body = overview === '' ? data.description ?? '' : overview
  const markdown = mergeSections(title, [{ markdown: body }, ...tabs])

  return { page: primary, title, description: truncate(firstParagraph(markdown), 160), markdown }
}

interface LlmsEntry {
  title: string
  markdownPath: string
  description: string
}

interface LlmsSection {
  title: string
  entries: LlmsEntry[]
}

interface SidebarLike {
  text?: string
  link?: string
  items?: SidebarLike[]
}

function flattenSidebar(items: readonly SidebarLike[]): Array<{ title: string, link: string }> {
  return items.flatMap((item) => {
    const children = flattenSidebar(item.items ?? [])
    if (item.link === undefined || item.text === undefined)
      return children
    return [{ title: item.text, link: item.link }, ...children]
  })
}

/**
 * 顺序沿用侧栏：先 Guide，再 Themes，最后按组件分组。
 * 每条都指向 Markdown 版，说明取对应页面的第一段。
 */
export function collectSections(
  locale: DocsLocale,
  rendered: readonly LlmsPageEntry[],
  catalog: readonly CatalogEntry[],
): LlmsSection[] {
  const english = locale === 'en'
  const byPath = new Map(rendered.map(entry => [entry.page.markdownPath, entry]))
  const pick = (title: string, link: string): LlmsEntry => {
    const markdownPath = markdownPathForUrl(link)
    return { title, markdownPath, description: byPath.get(markdownPath)?.description ?? '' }
  }
  const components = catalog.map((entry) => {
    const markdownPath = `${english ? 'en/' : ''}components/${entry.slug}.md`
    return { title: entry[locale], markdownPath, description: byPath.get(markdownPath)?.description ?? '' }
  })

  return [
    { title: 'Guide', entries: flattenSidebar(guideSidebar(english)).map(item => pick(item.title, item.link)) },
    { title: 'Themes', entries: flattenSidebar(themeSidebar(english)).map(item => pick(item.title, item.link)) },
    { title: 'Components', entries: components },
  ]
}

function renderEntry(entry: LlmsEntry): string {
  const url = `${SITE_URL}/${entry.markdownPath}`
  return entry.description === ''
    ? `- [${entry.title}](${url})`
    : `- [${entry.title}](${url}): ${entry.description}`
}

function renderIndex(locale: DocsLocale, rendered: readonly LlmsPageEntry[], catalog: readonly CatalogEntry[]): string {
  const english = locale === 'en'
  const summary = english
    ? `A community Vue 3 implementation of the Astryx design system: ${catalog.length} documented components, themes, and an agent-friendly CLI.`
    : `面向 Vue 3 的 Astryx 设计系统社区实现：${catalog.length} 个组件、多套主题，还有一个给 agent 用的命令行工具。`
  const intro = english
    ? [
        'Every link below is the plain Markdown version of a page. Add `.md` to any page URL to get the same text.',
        `The whole documentation in one file: [llms-full.txt](${SITE_URL}/llms-full.txt).`,
      ].join('\n\n')
    : [
        '下面每条链接都是页面的 Markdown 纯文本版。任意页面网址后面加 `.md` 也能拿到同样的正文。',
        `全部文档合成一个文件：[llms-full-zh.txt](${SITE_URL}/llms-full-zh.txt)。`,
      ].join('\n\n')

  const sections = collectSections(locale, rendered, catalog)
    .map(section => [`## ${section.title}`, section.entries.map(renderEntry).join('\n')].join('\n\n'))
  const other = english
    ? `## Chinese\n\n- [中文文档](${SITE_URL}/llms-zh.txt): 同结构的简体中文版。`
    : `## English\n\n- [English docs](${SITE_URL}/llms.txt): the same list in English.`

  return `${['# astryx-vue', `> ${summary}`, intro, ...sections, other].join('\n\n')}\n`
}

function stripLeadingHeading(markdown: string): string {
  return markdown.replace(/^#\s+(?:\S[^\n]*)?\n/, '').trim()
}

/** 全文拼接：每篇先给标题和来源网址，再接正文。顺序和 `llms.txt` 一致。 */
function renderFullText(locale: DocsLocale, rendered: readonly LlmsPageEntry[], catalog: readonly CatalogEntry[]): string {
  const english = locale === 'en'
  const byPath = new Map(rendered.map(entry => [entry.page.markdownPath, entry]))
  const head = english
    ? `# astryx-vue — full documentation\n\n> Every English page in one file. Index: ${SITE_URL}/llms.txt`
    : `# astryx-vue — 完整文档\n\n> 简体中文页面全部合在这里。目录：${SITE_URL}/llms-zh.txt`
  const bodies = collectSections(locale, rendered, catalog)
    .flatMap(section => section.entries)
    .flatMap((entry) => {
      const page = byPath.get(entry.markdownPath)
      if (page === undefined)
        return []
      return [[
        `# ${page.title}`,
        `Source: ${SITE_URL}/${page.page.markdownPath}`,
        stripLeadingHeading(page.markdown),
      ].join('\n\n')]
    })

  return `${[head, ...bodies].join('\n\n---\n\n')}\n`
}

async function writeArtifact(outDir: string, name: string, content: string): Promise<{ name: string, bytes: number }> {
  const path = join(outDir, name)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content, 'utf8')
  return { name, bytes: Buffer.byteLength(content) }
}

async function exists(path: string): Promise<boolean> {
  return access(path).then(() => true, () => false)
}

/**
 * 页面在 `dist` 里的 HTML 位置。组件页的 `index.md` 被 rewrite 成同级 `.html`，
 * 所以两种写法都要试一下。
 */
async function resolveHtmlPath(outDir: string, sitePath: string): Promise<string | null> {
  const withoutExt = sitePath.replace(/\.md$/, '')
  const candidates = withoutExt.endsWith('/index')
    ? [`${withoutExt.slice(0, -'/index'.length)}.html`, `${withoutExt}.html`]
    : [`${withoutExt}.html`, `${withoutExt}/index.html`]
  for (const candidate of candidates) {
    if (await exists(join(outDir, candidate)))
      return candidate
  }
  return null
}

/**
 * 写出全部产物。`dist` 里每个页面都有对应的 Markdown，页面 `<head>` 里的链接
 * 用同一个 `markdownPathFor` 算出来，两边不会走偏。
 */
export async function generateLlmsArtifacts(options: LlmsBuildOptions): Promise<LlmsArtifacts> {
  const appDir = options.appDir ?? fileURLToPath(new URL('..', import.meta.url))
  const demosDir = join(appDir, 'components/demos')
  const [pages, demoSources, catalog, tokens] = await Promise.all([
    listMarkdown(options.docsDir).then(files => files.map(describePage)),
    loadDemoSources(demosDir),
    loadCatalog(demosDir),
    readFile(join(appDir, '../../packages/themes/neutral/base.css'), 'utf8').then(parseCustomProperties),
  ])
  const demos = await loadDemoContents(demoSources)
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
