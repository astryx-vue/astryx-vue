/**
 * 渲染两个汇总文件：`llms.txt`（页面目录）和 `llms-full.txt`（全部正文）。
 * 两者的页面顺序都来自 `collectSections`，和站点侧栏一致。
 */
import type { CatalogEntry } from '../../components/demo-infra/demoMeta.ts'
import type { DocsLocale } from '../../components/demo-infra/docs-i18n.ts'
import type { LlmsPageEntry } from './render-page.ts'
import { guideSidebar, themeSidebar } from '../../.vitepress/sidebar.ts'
import { markdownPathForUrl } from './paths.ts'

/** 线上站点地址。`llms.txt` 里的链接用绝对网址，方便别的机器直接抓。 */
export const SITE_URL = 'https://astryx-vue.pages.dev'

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

export function renderIndex(locale: DocsLocale, rendered: readonly LlmsPageEntry[], catalog: readonly CatalogEntry[]): string {
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
export function renderFullText(locale: DocsLocale, rendered: readonly LlmsPageEntry[], catalog: readonly CatalogEntry[]): string {
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
