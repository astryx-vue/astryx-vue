import type { Component, VNode, VNodeChild } from 'vue'
import type { MarkdownMessages } from '../locale/messages/markdown.js'
import type { MdNode } from './ast.js'
import type { MarkdownExtensionNode, MarkdownExtensionRenderer } from './plugin-protocol/protocol.js'
import type { MarkdownInlinePlugin, MarkdownPlugin, MarkdownPluginRenderContext } from './plugins.js'
import type { MarkdownCitationStyle, MarkdownComponents, MarkdownHeadingLevel } from './types.js'
import { Fragment, h } from 'vue'
import Blockquote from '../Blockquote/Blockquote.vue'
import CheckboxIndicator from '../CheckboxIndicator/CheckboxIndicator.vue'
import Code from '../Code/Code.vue'
import CodeBlock from '../Code/CodeBlock.vue'
import { parseFenceLanguage } from '../Code/diff.js'
import Heading from '../Heading/Heading.vue'
import Link from '../Link/Link.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { plainText } from './ast.js'
import { fadeClass, renderLink, renderText } from './renderInline.js'
import { assignHeadingSlugs, collectDefinitions, measureNode, slotText } from './renderTree.js'
import { slugify, uniqueSlug } from './slug.js'
import { sanitizeMarkdownImageUrl, sanitizeMarkdownLinkUrl } from './url.js'

export { assignHeadingSlugs, collectDefinitions, measureNode, slotText }

export interface FadeCursor {
  active: boolean
  boundaries: number[]
  offset: number
}

export interface RenderContext {
  components?: MarkdownComponents
  fade: FadeCursor
  definitions: Map<string, { url: string, title?: string | null }>
  density: 'default' | 'compact'
  headingLevelStart: number
  inline: boolean
  /** How many lists enclose the block being rendered. Markers cycle every third level. */
  listDepth: number
  messages: MarkdownMessages
  onLinkClick?: (href: string, event: MouseEvent) => void | false
  slugs: Map<MdNode, string>
  sources?: Record<string, { title?: string, url?: string, icon?: string }>
  /** First-seen order of citation ids, so chips number stably in one render. */
  citationOrder: Map<string, number>
  citationStyle: MarkdownCitationStyle
  citationLabel: (number: number, title: string) => string
  plugins?: readonly MarkdownPlugin[]
  inlinePlugins?: readonly MarkdownInlinePlugin[]
  /** Checkbox graphic from the nearest theme. Falls back to the built-in box. */
  checkboxIndicator?: Component
  /** Set when `markdownSourceLinesPlugin` is in the plugin list. */
  sourceLines?: boolean
  protocolRenderers?: ReadonlyMap<string, MarkdownExtensionRenderer<MarkdownExtensionNode>>
}

function headingLevel(depth: number, start: number): MarkdownHeadingLevel {
  return Math.min(6, Math.max(1, depth + start - 1)) as MarkdownHeadingLevel
}

function sourceSpan(node: MdNode, ctx: RenderContext): { start: number, end: number } | null {
  if (ctx.sourceLines !== true)
    return null
  const start = node.position?.start?.line
  if (start == null)
    return null
  return { start, end: node.position?.end?.line ?? start }
}

function sourceLineAttrs(node: MdNode, ctx: RenderContext): Record<string, string> {
  const span = sourceSpan(node, ctx)
  if (span == null)
    return {}
  return {
    'data-source-line': String(span.start),
    'data-source-line-end': String(span.end),
  }
}

function sourceLineFields(node: MdNode, ctx: RenderContext): { sourceLines?: { start: number, end: number } } {
  const span = sourceSpan(node, ctx)
  return span == null ? {} : { sourceLines: span }
}

function renderProtocol(node: MdNode, ctx: RenderContext): VNodeChild | undefined {
  if (node.plugin == null || node.name == null)
    return undefined
  const renderer = ctx.protocolRenderers?.get(`${node.plugin}\0${node.name}`)
  if (renderer == null)
    return undefined
  const extension = node as MarkdownExtensionNode
  try {
    const rendered = renderer.render({ node: extension })
    if (typeof rendered === 'string' || typeof rendered === 'number')
      return rendered
    if (rendered != null && typeof rendered === 'object')
      return rendered as VNodeChild
  }
  catch {
    // A renderer that throws still leaves the source text in the document.
  }
  try {
    return renderer.toText(extension)
  }
  catch {
    return node.source ?? node.value ?? ''
  }
}

function extensionRenderer(node: MdNode, ctx: RenderContext): MarkdownPlugin['render'] | MarkdownInlinePlugin['render'] | null {
  const owner = node.plugin
  if (owner == null)
    return null
  const block = ctx.plugins?.find(plugin => plugin.name === owner && plugin.render != null)
  if (block?.render != null)
    return block.render
  const inline = ctx.inlinePlugins?.find(plugin => plugin.name === owner && plugin.render != null)
  return inline?.render ?? null
}

function renderExtension(node: MdNode, key: string, ctx: RenderContext): VNodeChild | null {
  const protocol = renderProtocol(node, ctx)
  if (protocol !== undefined)
    return protocol
  const render = extensionRenderer(node, ctx)
  if (render != null) {
    const context: MarkdownPluginRenderContext = {
      renderChildren: () => renderChildren(node.children, key, ctx),
    }
    const rendered = render(node, context)
    if (rendered != null)
      return rendered
  }
  if (node.source != null && node.source !== '')
    return renderText(node.source, key, ctx)
  if (node.value != null && node.value !== '')
    return renderText(node.value, key, ctx)
  if (node.children != null && node.children.length > 0)
    return h(Fragment, { key }, renderChildren(node.children, key, ctx))
  return null
}

function renderChildren(nodes: MdNode[] | undefined, key: string, ctx: RenderContext): VNodeChild[] {
  return (nodes ?? []).flatMap((node, index) => {
    const rendered = renderNode(node, `${key}-${index}`, ctx)
    return rendered == null ? [] : [rendered]
  })
}

function renderInline(node: MdNode, key: string, ctx: RenderContext): VNodeChild | null {
  switch (node.type) {
    case 'text':
      return renderText(node.value ?? '', key, ctx)
    case 'html':
      return renderText(node.value ?? '', key, ctx)
    case 'emphasis':
      return h('em', { key }, renderChildren(node.children, key, ctx))
    case 'strong':
      return h('strong', { key }, renderChildren(node.children, key, ctx))
    case 'delete':
      return h('del', { key }, renderChildren(node.children, key, ctx))
    case 'inlineCode': {
      const value = node.value ?? ''
      const start = ctx.fade.offset
      ctx.fade.offset += value.length
      const override = ctx.components?.inlineCode
      if (override != null)
        return h(override, { key, value }, () => value)
      return h(Code, { key, class: fadeClass(start, ctx.fade) }, () => value)
    }
    case 'break':
      ctx.fade.offset += 1
      return h('br', { key })
    case 'link': {
      const children = renderChildren(node.children, key, ctx)
      const href = node.url == null ? null : sanitizeMarkdownLinkUrl(node.url)
      if (href == null)
        return h(Fragment, { key }, children)
      return renderLink(href, key, children, node.title, ctx)
    }
    case 'linkReference': {
      const children = renderChildren(node.children, key, ctx)
      const definition = node.identifier == null ? undefined : ctx.definitions.get(node.identifier)
      const href = definition == null ? null : sanitizeMarkdownLinkUrl(definition.url)
      if (href == null)
        return h(Fragment, { key }, children)
      return renderLink(href, key, children, definition?.title, ctx)
    }
    case 'image':
    case 'imageReference': {
      const alt = node.alt ?? node.label ?? plainText(node)
      const rawUrl = node.type === 'image'
        ? node.url
        : (node.identifier == null ? undefined : ctx.definitions.get(node.identifier)?.url)
      const src = rawUrl == null ? null : sanitizeMarkdownImageUrl(rawUrl)
      ctx.fade.offset += alt.length
      if (src == null)
        return alt === '' ? null : h('span', { key }, alt)
      const override = ctx.components?.image
      if (override != null)
        return h(override, { key, src, alt })
      return h('img', { key, src, alt, class: 'astryx-markdown__image', loading: 'lazy' })
    }
    case 'footnoteReference': {
      const label = node.label ?? node.identifier ?? ''
      const id = node.identifier ?? label
      const labelNode = renderText(label, `${key}-label`, ctx)
      return h('sup', { key, class: 'astryx-markdown__fn' }, [
        h(Link, { href: `#astryx-fn-${id}` }, () => labelNode),
      ])
    }
    case 'extension':
      return renderExtension(node, key, ctx)
    default:
      if (node.children != null)
        return h(Fragment, { key }, renderChildren(node.children, key, ctx))
      return null
  }
}

function renderNode(node: MdNode, key: string, ctx: RenderContext): VNodeChild | null {
  if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'tableCell' || node.type === 'tableRow')
    return renderBlock(node, key, ctx)
  return renderInline(node, key, ctx)
}

function isTaskItem(node: MdNode): boolean {
  return node.checked === true || node.checked === false
}

const TABLE_COLUMN_MIN_CH = 4
const TABLE_COLUMN_MAX_CH = 24
const TABLE_HEADER_ONE_LINE_MAX_CH = 20

function columnMinCh(node: MdNode): number[] {
  const rows = node.children ?? []
  const header = rows[0]
  if (header == null)
    return []
  return (header.children ?? []).map((cell, index) => {
    const headerLen = measureNode(cell)
    let maxLen = headerLen
    for (const row of rows.slice(1)) {
      const body = row.children?.[index]
      if (body != null)
        maxLen = Math.max(maxLen, measureNode(body))
    }
    const bodyFloor = Math.ceil(maxLen / 2)
    const headerFloor = Math.min(headerLen, TABLE_HEADER_ONE_LINE_MAX_CH)
    return Math.min(TABLE_COLUMN_MAX_CH, Math.max(TABLE_COLUMN_MIN_CH, bodyFloor, headerFloor))
  })
}

const BULLET_MARKERS = ['disc', 'circle', 'square'] as const
const NUMBER_MARKERS = ['decimal', 'lower-alpha', 'lower-roman'] as const
type ListMarker = typeof BULLET_MARKERS[number] | typeof NUMBER_MARKERS[number]

function renderList(node: MdNode, key: string, ctx: RenderContext): VNode {
  const items = node.children ?? []
  const taskList = items.length > 0 && items.every(isTaskItem)
  const ordered = node.ordered === true && !taskList
  const nested: RenderContext = { ...ctx, listDepth: ctx.listDepth + 1 }
  const marker = (ordered ? NUMBER_MARKERS : BULLET_MARKERS)[ctx.listDepth % 3] ?? 'disc'
  const renderedItems = items.map((item, index) => renderListItem(item, `${key}-item-${index}`, taskList, marker, nested))
  const override = ctx.components?.list
  const start = ordered && node.start != null && node.start !== 1 ? node.start : undefined
  if (override != null) {
    return h(override, {
      key,
      ordered,
      start,
      ...sourceLineFields(node, ctx),
    }, () => renderedItems)
  }

  return h(ordered ? 'ol' : 'ul', {
    key,
    'role': 'list',
    'class': ['astryx-markdown__list', 'astryx-markdown__prose', taskList ? 'astryx-markdown__tasks' : null],
    'data-depth': taskList ? undefined : ctx.listDepth % 3,
    'data-marker': taskList ? undefined : marker,
    'data-tight': node.spread === false || undefined,
    'start': start,
    'style': start == null ? undefined : { counterReset: `astryx-md-list ${start - 1}` },
    'aria-label': taskList ? ctx.messages.taskList : undefined,
  }, renderedItems)
}

function renderMarker(marker: ListMarker): VNode {
  const numbered = marker === 'decimal' || marker === 'lower-alpha' || marker === 'lower-roman'
  return h('span', {
    'class': 'astryx-markdown__marker',
    'data-marker': marker,
    'aria-hidden': 'true',
  }, numbered
    ? undefined
    : [h('span', { 'class': 'astryx-markdown__marker-shape', 'data-shape': marker })])
}

function renderItemBody(node: MdNode, key: string, ctx: RenderContext): VNodeChild[] {
  const children = node.children ?? []
  const onlyParagraph = children.length === 1 && children[0]?.type === 'paragraph'
  if (onlyParagraph)
    return renderChildren(children[0]?.children, `${key}-label`, ctx)
  return children.map((child, index) => renderBlock(child, `${key}-${index}`, ctx)).filter(child => child != null)
}

function renderListItem(node: MdNode, key: string, taskList: boolean, marker: ListMarker, ctx: RenderContext): VNode {
  const body = renderItemBody(node, key, ctx)
  if (!taskList && !isTaskItem(node)) {
    return h('li', { key, class: 'astryx-markdown__item', ...sourceLineAttrs(node, ctx) }, [
      renderMarker(marker),
      h('div', { class: 'astryx-markdown__item-body' }, body),
    ])
  }

  const checked = node.checked === true
  return h('li', { key, class: 'astryx-markdown__task', ...sourceLineAttrs(node, ctx) }, [
    h('span', { class: 'astryx-markdown__task-check' }, [
      h(ctx.checkboxIndicator ?? CheckboxIndicator, { state: checked ? 'checked' : 'unchecked', size: 'sm' }),
      h(VisuallyHidden, () => checked ? ctx.messages.taskDone : ctx.messages.taskPending),
    ]),
    h('div', { class: 'astryx-markdown__task-body' }, body),
  ])
}

export function renderBlock(node: MdNode, key: string, ctx: RenderContext): VNode | null {
  switch (node.type) {
    case 'heading': {
      const level = headingLevel(node.depth ?? 1, ctx.headingLevelStart)
      const id = ctx.slugs.get(node) ?? uniqueSlug(slugify(plainText(node)), new Map())
      const children = renderChildren(node.children, key, ctx)
      const anchor = h('a', {
        'class': 'astryx-markdown__anchor',
        'href': `#${id}`,
        'aria-label': ctx.messages.headingLink(plainText(node)),
      }, '#')
      const override = ctx.components?.heading
      if (override != null)
        return h(override, { key, level, id, ...sourceLineFields(node, ctx) }, () => [...children, anchor])
      return h(Heading, {
        key,
        level,
        id,
        'class': 'astryx-markdown__heading astryx-markdown__prose',
        'data-depth': node.depth ?? 1,
        'tabindex': -1,
        ...sourceLineAttrs(node, ctx),
      }, () => [...children, anchor])
    }
    case 'paragraph': {
      const children = renderChildren(node.children, key, ctx)
      const imageOnly = (node.children ?? []).length === 1 && node.children?.[0]?.type === 'image'
      const override = ctx.components?.paragraph
      if (override != null)
        return h(override, { key, ...sourceLineFields(node, ctx) }, () => children)
      if (ctx.inline)
        return h('span', { key, class: 'astryx-markdown__paragraph', ...sourceLineAttrs(node, ctx) }, children)
      return h('div', {
        key,
        role: 'paragraph',
        class: ['astryx-markdown__paragraph', 'astryx-markdown__prose', imageOnly ? 'astryx-markdown__paragraph--image' : null],
        ...sourceLineAttrs(node, ctx),
      }, children)
    }
    case 'code': {
      const value = node.value ?? ''
      const start = ctx.fade.offset
      ctx.fade.offset += value.length
      const language = node.lang == null || node.lang === '' ? undefined : node.lang
      const override = ctx.components?.code
      if (override != null)
        return h(override, { key, code: value, language, ...sourceLineFields(node, ctx) }, () => value)
      const fence = parseFenceLanguage(language)
      return h('div', {
        key,
        class: ['astryx-markdown__code', fadeClass(start, ctx.fade)],
        ...sourceLineAttrs(node, ctx),
      }, [
        h(CodeBlock, {
          code: value,
          language: fence.language,
          isDiff: fence.isDiff,
          width: '100%',
          isCollapsible: true,
          isWrapped: true,
        }),
      ])
    }
    case 'blockquote': {
      const children = (node.children ?? []).map((child, index) => renderBlock(child, `${key}-${index}`, ctx)).filter(child => child != null)
      const override = ctx.components?.blockquote
      if (override != null)
        return h(override, { key, ...sourceLineFields(node, ctx) }, () => children)
      return h(Blockquote, {
        key,
        class: 'astryx-markdown__blockquote astryx-markdown__prose',
        ...sourceLineAttrs(node, ctx),
      }, () => children)
    }
    case 'list':
      return renderList(node, key, ctx)
    case 'table': {
      const rows = node.children ?? []
      const header = rows[0]
      const body = rows.slice(1)
      const align = node.align ?? []
      const floors = columnMinCh(node)
      const renderRow = (row: MdNode, rowKey: string, cellTag: 'th' | 'td'): VNode => h('tr', { key: rowKey }, (row.children ?? []).map((cell, index) => {
        const alignment = align[index]
        const marked = alignment === 'center' || alignment === 'right' ? alignment : undefined
        const floor = floors[index]
        return h(cellTag, {
          'key': `${rowKey}-${index}`,
          'class': 'astryx-markdown__cell',
          'scope': cellTag === 'th' ? 'col' : undefined,
          'data-align': marked,
          'style': floor == null ? undefined : { minWidth: `${floor}ch` },
        }, renderChildren(cell.children, `${rowKey}-${index}`, ctx))
      }))
      const content = [
        header == null ? null : h('thead', { key: `${key}-head` }, [renderRow(header, `${key}-head-row`, 'th')]),
        body.length === 0 ? null : h('tbody', { key: `${key}-body` }, body.map((row, index) => renderRow(row, `${key}-body-${index}`, 'td'))),
      ].filter(child => child != null)
      const override = ctx.components?.table
      if (override != null)
        return h(override, { key, ...sourceLineFields(node, ctx) }, () => content)
      return h('div', { key, class: 'astryx-markdown__table-wrap', ...sourceLineAttrs(node, ctx) }, [
        h('table', { class: 'astryx-markdown__table' }, content),
      ])
    }
    case 'thematicBreak': {
      const override = ctx.components?.hr
      if (override != null)
        return h(override, { key, ...sourceLineFields(node, ctx) })
      return h('hr', { key, class: 'astryx-markdown__hr', ...sourceLineAttrs(node, ctx) })
    }
    case 'footnoteDefinition': {
      const id = node.identifier ?? ''
      const children = (node.children ?? []).map((child, index) => renderBlock(child, `${key}-${index}`, ctx)).filter(child => child != null)
      return h('section', { key, id: `astryx-fn-${id}`, class: 'astryx-markdown__footnote astryx-markdown__prose' }, children)
    }
    case 'definition':
      return null
    case 'image':
      return renderInline(node, key, ctx) as VNode | null
    case 'extension':
      return renderExtension(node, key, ctx) as VNode | null
    default:
      return renderInline(node, key, ctx) as VNode | null
  }
}

export function renderMarkdownBlocks(
  nodes: MdNode[],
  settledCount: number,
  ctx: RenderContext,
  cache: Map<MdNode, VNode>,
): VNode[] {
  const vnodes: VNode[] = []
  const alive = new Set<MdNode>()

  nodes.forEach((node, index) => {
    if (index < settledCount) {
      alive.add(node)
      const cached = cache.get(node)
      if (cached != null) {
        ctx.fade.offset += measureNode(node)
        vnodes.push(cached)
        return
      }
    }
    const vnode = renderBlock(node, `block-${index}`, ctx)
    if (vnode == null)
      return
    if (index < settledCount)
      cache.set(node, vnode)
    vnodes.push(vnode)
  })

  for (const node of cache.keys()) {
    if (!alive.has(node))
      cache.delete(node)
  }
  return vnodes
}
