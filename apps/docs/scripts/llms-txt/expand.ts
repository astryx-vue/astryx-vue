/**
 * 把文档页里的 Vue 块组件展开成纯 Markdown：演示、结构说明、无障碍要求、
 * 令牌表和组件目录。不认识的块交还给 `toPlainMarkdown` 处理。
 */
import type { CatalogEntry } from '../../components/demo-infra/demoMeta.ts'
import type { DocsLocale } from '../../components/demo-infra/docs-i18n.ts'
import type { CustomProperty } from '../../components/theme-tokens/parseTokens.ts'
import type { BlockExpander, BlockTag } from '../llms-markdown.ts'
import { COMPONENT_GROUPS, GROUP_TITLES } from '../../components/demo-infra/groups.ts'
import { accessibilityFor, anatomyFor } from '../../components/demo-infra/reference/loadReference.ts'
import { sectionId, splitLightDark, TOKEN_SECTION_ORDER } from '../../components/theme-tokens/parseTokens.ts'
import { fenceBlock, parseStringArray } from '../llms-markdown.ts'

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
