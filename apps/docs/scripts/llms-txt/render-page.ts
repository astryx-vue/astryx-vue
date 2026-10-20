/**
 * 把一组源文件渲染成一篇纯 Markdown。组件页的 `index.md`、`props.md`、
 * `accessibility.md` 在这里合并；普通页面一组只有一个文件。
 */
import type { ExpandContext } from './expand.ts'
import type { ComponentTab, LlmsPage } from './paths.ts'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { componentDocsCopy } from '../../components/demo-infra/docs-i18n.ts'
import { firstParagraph, mergeSections, stripFrontmatter, toPlainMarkdown, truncate } from '../llms-markdown.ts'
import { createExpander } from './expand.ts'
import { COMPONENT_TABS } from './paths.ts'

export interface LlmsPageEntry {
  page: LlmsPage
  title: string
  description: string
  markdown: string
}

/** 渲染所有页面时共用的素材。语言和组件 slug 按页面各自补上。 */
export type RenderOptions = Omit<ExpandContext, 'locale' | 'slug'>

function titleFromSource(source: string): string | undefined {
  const { data, body } = stripFrontmatter(source)
  if (data.title !== undefined && data.title !== '')
    return data.title
  const heading = /^#[ \t]+(\S[^\n]*)$/m.exec(body)
  return heading?.[1].trim()
}

/** 一个组件或一个普通页面共用这段：读各分页、转纯文本、合并成一篇。 */
export async function renderPage(
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
