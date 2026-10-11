import type { VNode, VNodeChild } from 'vue'
import type { MarkdownMessages } from '../locale/messages/markdown.js'
import type { MdNode } from './ast.js'
import type { MarkdownComponents, MarkdownHeadingLevel } from './types.js'
import { Fragment, h } from 'vue'
import Blockquote from '../Blockquote/Blockquote.vue'
import CheckboxIndicator from '../CheckboxIndicator/CheckboxIndicator.vue'
import Code from '../Code/Code.vue'
import CodeBlock from '../Code/CodeBlock.vue'
import Heading from '../Heading/Heading.vue'
import Link from '../Link/Link.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { plainText } from './ast.js'
import { slugify, uniqueSlug } from './slug.js'
import { computeSegments } from './streaming.js'
import { linkOpensInNewTab, sanitizeMarkdownImageUrl, sanitizeMarkdownLinkUrl } from './url.js'

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
  messages: MarkdownMessages
  onLinkClick?: (href: string, event: MouseEvent) => void | false
  slugs: Map<MdNode, string>
}

export function measureNode(node: MdNode): number {
  switch (node.type) {
    case 'text':
    case 'inlineCode':
    case 'code':
    case 'html':
      return node.value?.length ?? 0
    case 'image':
    case 'imageReference':
      return (node.alt ?? node.label ?? '').length
    case 'break':
      return 1
    case 'footnoteReference':
      return (node.label ?? node.identifier ?? '').length
    case 'definition':
    case 'thematicBreak':
      return 0
    default:
      return (node.children ?? []).reduce((sum, child) => sum + measureNode(child), 0)
  }
}

export function assignHeadingSlugs(nodes: MdNode[]): Map<MdNode, string> {
  const counts = new Map<string, number>()
  const slugs = new Map<MdNode, string>()
  const visit = (list: MdNode[]): void => {
    for (const node of list) {
      if (node.type === 'heading')
        slugs.set(node, uniqueSlug(slugify(plainText(node)), counts))
      if (node.children != null)
        visit(node.children)
    }
  }
  visit(nodes)
  return slugs
}

export function collectDefinitions(nodes: MdNode[]): Map<string, { url: string, title?: string | null }> {
  const definitions = new Map<string, { url: string, title?: string | null }>()
  const visit = (list: MdNode[]): void => {
    for (const node of list) {
      if (node.type === 'definition' && node.identifier != null && node.url != null)
        definitions.set(node.identifier, { url: node.url, title: node.title })
      if (node.children != null)
        visit(node.children)
    }
  }
  visit(nodes)
  return definitions
}

function headingLevel(depth: number, start: number): MarkdownHeadingLevel {
  return Math.min(6, Math.max(1, depth + start - 1)) as MarkdownHeadingLevel
}

function renderText(value: string, key: string, fade: FadeCursor): VNodeChild {
  const start = fade.offset
  fade.offset += value.length
  if (!fade.active)
    return value
  const segments = computeSegments(value, start, fade.boundaries, key)
  if (segments == null)
    return value
  return h(Fragment, { key }, segments.map(segment => h('span', {
    key: segment.key,
    class: segment.fading ? 'astryx-markdown__fade' : undefined,
  }, segment.text)))
}

function fadeClass(start: number, fade: FadeCursor): string | undefined {
  if (!fade.active || fade.boundaries.length === 0)
    return undefined
  const oldest = fade.boundaries[0]
  return oldest != null && start >= oldest ? 'astryx-markdown__fade' : undefined
}

function renderChildren(nodes: MdNode[] | undefined, key: string, ctx: RenderContext): VNodeChild[] {
  return (nodes ?? []).flatMap((node, index) => {
    const rendered = renderNode(node, `${key}-${index}`, ctx)
    return rendered == null ? [] : [rendered]
  })
}

function renderLink(href: string, key: string, children: VNodeChild[], title: string | null | undefined, ctx: RenderContext): VNode {
  const override = ctx.components?.link
  if (override != null)
    return h(override, { href, title: title ?? undefined, key }, () => children)

  return h(Link, {
    key,
    href,
    hasUnderline: true,
    target: linkOpensInNewTab(href) ? '_blank' : undefined,
    title: title ?? undefined,
    onClick: (event: MouseEvent) => {
      if (ctx.onLinkClick?.(href, event) === false)
        event.preventDefault()
    },
  }, () => children)
}

function renderInline(node: MdNode, key: string, ctx: RenderContext): VNodeChild | null {
  switch (node.type) {
    case 'text':
      return renderText(node.value ?? '', key, ctx.fade)
    case 'html':
      return renderText(node.value ?? '', key, ctx.fade)
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
      const labelNode = renderText(label, `${key}-label`, ctx.fade)
      return h('sup', { key, class: 'astryx-markdown__fn' }, [
        h(Link, { href: `#astryx-fn-${id}` }, () => labelNode),
      ])
    }
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

function renderList(node: MdNode, key: string, ctx: RenderContext): VNode {
  const items = node.children ?? []
  const taskList = items.length > 0 && items.every(isTaskItem)
  const ordered = node.ordered === true && !taskList
  const renderedItems = items.map((item, index) => renderListItem(item, `${key}-item-${index}`, taskList, ctx))
  const override = ctx.components?.list
  if (override != null) {
    return h(override, {
      key,
      ordered,
      start: ordered && node.start != null && node.start !== 1 ? node.start : undefined,
    }, () => renderedItems)
  }

  return h(ordered ? 'ol' : 'ul', {
    key,
    'class': ['astryx-markdown__list', 'astryx-markdown__prose', taskList ? 'astryx-markdown__tasks' : null],
    'data-tight': node.spread === false || undefined,
    'start': ordered && node.start != null && node.start !== 1 ? node.start : undefined,
    'aria-label': taskList ? ctx.messages.taskList : undefined,
  }, renderedItems)
}

function renderListItem(node: MdNode, key: string, taskList: boolean, ctx: RenderContext): VNode {
  const children = (node.children ?? []).map((child, index) => renderBlock(child, `${key}-${index}`, ctx)).filter(child => child != null)
  if (!taskList && !isTaskItem(node))
    return h('li', { key, class: 'astryx-markdown__item' }, children)

  const checked = node.checked === true
  return h('li', { key, class: 'astryx-markdown__task' }, [
    h('span', { class: 'astryx-markdown__task-check' }, [
      h(CheckboxIndicator, { state: checked ? 'checked' : 'unchecked', size: 'sm' }),
      h(VisuallyHidden, () => checked ? ctx.messages.taskDone : ctx.messages.taskPending),
    ]),
    h('div', { class: 'astryx-markdown__task-body' }, children),
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
        return h(override, { key, level, id }, () => [...children, anchor])
      return h(Heading, {
        key,
        level,
        id,
        class: 'astryx-markdown__heading astryx-markdown__prose',
        tabindex: -1,
      }, () => [...children, anchor])
    }
    case 'paragraph': {
      const children = renderChildren(node.children, key, ctx)
      const imageOnly = (node.children ?? []).length === 1 && node.children?.[0]?.type === 'image'
      const override = ctx.components?.paragraph
      if (override != null)
        return h(override, { key }, () => children)
      if (ctx.inline)
        return h('span', { key, class: 'astryx-markdown__paragraph' }, children)
      return h('div', {
        key,
        role: 'paragraph',
        class: ['astryx-markdown__paragraph', 'astryx-markdown__prose', imageOnly ? 'astryx-markdown__paragraph--image' : null],
      }, children)
    }
    case 'code': {
      const value = node.value ?? ''
      const start = ctx.fade.offset
      ctx.fade.offset += value.length
      const language = node.lang == null || node.lang === '' ? undefined : node.lang
      const override = ctx.components?.code
      if (override != null)
        return h(override, { key, code: value, language }, () => value)
      return h('div', { key, class: ['astryx-markdown__code', fadeClass(start, ctx.fade)] }, [
        h(CodeBlock, {
          code: value,
          language: language ?? 'plaintext',
          width: '100%',
          isCollapsible: false,
        }),
      ])
    }
    case 'blockquote': {
      const children = (node.children ?? []).map((child, index) => renderBlock(child, `${key}-${index}`, ctx)).filter(child => child != null)
      const override = ctx.components?.blockquote
      if (override != null)
        return h(override, { key }, () => children)
      return h(Blockquote, { key, class: 'astryx-markdown__blockquote astryx-markdown__prose' }, () => children)
    }
    case 'list':
      return renderList(node, key, ctx)
    case 'table': {
      const rows = node.children ?? []
      const header = rows[0]
      const body = rows.slice(1)
      const align = node.align ?? []
      const renderRow = (row: MdNode, rowKey: string, cellTag: 'th' | 'td'): VNode => h('tr', { key: rowKey }, (row.children ?? []).map((cell, index) => {
        const alignment = align[index]
        const marked = alignment === 'center' || alignment === 'right' ? alignment : undefined
        return h(cellTag, {
          'key': `${rowKey}-${index}`,
          'class': 'astryx-markdown__cell',
          'scope': cellTag === 'th' ? 'col' : undefined,
          'data-align': marked,
        }, renderChildren(cell.children, `${rowKey}-${index}`, ctx))
      }))
      const content = [
        header == null ? null : h('thead', { key: `${key}-head` }, [renderRow(header, `${key}-head-row`, 'th')]),
        body.length === 0 ? null : h('tbody', { key: `${key}-body` }, body.map((row, index) => renderRow(row, `${key}-body-${index}`, 'td'))),
      ].filter(child => child != null)
      const override = ctx.components?.table
      if (override != null)
        return h(override, { key }, () => content)
      return h('div', { key, class: 'astryx-markdown__table-wrap' }, [
        h('table', { class: 'astryx-markdown__table' }, content),
      ])
    }
    case 'thematicBreak': {
      const override = ctx.components?.hr
      if (override != null)
        return h(override, { key })
      return h('hr', { key, class: 'astryx-markdown__hr' })
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

export function slotText(nodes: VNode[] | undefined): string {
  if (nodes == null)
    return ''
  return nodes.map((node) => {
    if (typeof node.children === 'string')
      return node.children
    return ''
  }).join('')
}
