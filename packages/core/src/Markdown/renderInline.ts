import type { VNode, VNodeChild } from 'vue'
import type { FadeCursor, RenderContext } from './render.js'
import { Fragment, h } from 'vue'
import Link from '../Link/Link.vue'
import { computeSegments } from './streaming.js'
import { linkOpensInNewTab, sanitizeMarkdownImageUrl, sanitizeMarkdownLinkUrl } from './url.js'

function renderPlainText(value: string, key: string, fade: FadeCursor): VNodeChild {
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

export function renderText(value: string, key: string, ctx: RenderContext): VNodeChild {
  const sources = ctx.sources
  if (sources == null)
    return renderPlainText(value, key, ctx.fade)
  const pattern = /\[([^\]\s]+)\]|【([^】\s]+)】/g
  const pieces: Array<{ kind: 'text', value: string } | { kind: 'cite', id: string, raw: string }> = []
  let cursor = 0
  for (const match of value.matchAll(pattern)) {
    const id = match[1] ?? match[2] ?? ''
    const index = match.index ?? 0
    if (sources[id] == null)
      continue
    if (index > cursor)
      pieces.push({ kind: 'text', value: value.slice(cursor, index) })
    pieces.push({ kind: 'cite', id, raw: match[0] })
    cursor = index + match[0].length
  }
  if (pieces.length === 0)
    return renderPlainText(value, key, ctx.fade)
  if (cursor < value.length)
    pieces.push({ kind: 'text', value: value.slice(cursor) })
  return pieces.map((piece, index) => {
    if (piece.kind === 'text')
      return renderPlainText(piece.value, `${key}-${index}`, ctx.fade)
    const start = ctx.fade.offset
    ctx.fade.offset += piece.raw.length
    return renderCitation(piece.id, `${key}-${index}`, start, ctx)
  })
}

function renderCitation(id: string, key: string, start: number, ctx: RenderContext): VNode {
  const source = ctx.sources?.[id]
  let number = ctx.citationOrder.get(id)
  if (number == null) {
    number = ctx.citationOrder.size + 1
    ctx.citationOrder.set(id, number)
  }
  const title = source?.title?.trim() || id
  const href = source?.url == null ? null : sanitizeMarkdownLinkUrl(source.url)
  const icon = source?.icon == null ? null : sanitizeMarkdownImageUrl(source.icon)
  const accessibleName = ctx.citationLabel(number, title)
  const fading = fadeClass(start, ctx.fade)
  if (ctx.citationStyle === 'number') {
    const shared = {
      'key': key,
      'class': ['astryx-markdown__cite', fading],
      'data-citation': String(number),
      'data-citation-style': 'number',
      'aria-label': accessibleName,
      title,
    }
    const text = String(number)
    if (href == null)
      return h('span', shared, text)
    return h('a', {
      ...shared,
      href,
      rel: linkOpensInNewTab(href) ? 'noopener noreferrer' : undefined,
      target: linkOpensInNewTab(href) ? '_blank' : undefined,
    }, text)
  }
  const label = h('span', { class: 'astryx-markdown__cite-label' }, title)
  const iconNode = icon == null
    ? null
    : h('span', { class: 'astryx-markdown__cite-icon' }, [
        h('img', { alt: '', src: icon }),
      ])
  const className = ['astryx-markdown__cite', fading, iconNode == null ? null : 'astryx-markdown__cite--icon']
  const children = iconNode == null ? [label] : [iconNode, label]
  const shared = {
    key,
    'class': className,
    'data-citation': String(number),
    'data-citation-style': 'label',
    'aria-label': accessibleName,
    title,
  }
  if (href == null)
    return h('span', shared, children)
  return h('a', {
    ...shared,
    href,
    rel: linkOpensInNewTab(href) ? 'noopener noreferrer' : undefined,
    target: linkOpensInNewTab(href) ? '_blank' : undefined,
  }, children)
}

export function fadeClass(start: number, fade: FadeCursor): string | undefined {
  if (!fade.active || fade.boundaries.length === 0)
    return undefined
  const oldest = fade.boundaries[0]
  return oldest != null && start >= oldest ? 'astryx-markdown__fade' : undefined
}

export function renderLink(href: string, key: string, children: VNodeChild[], title: string | null | undefined, ctx: RenderContext): VNode {
  const override = ctx.components?.link
  if (override != null)
    return h(override, { href, title: title ?? undefined, key }, () => children)

  return h(Link, {
    key,
    href,
    class: 'astryx-markdown__link',
    hasUnderline: true,
    target: linkOpensInNewTab(href) ? '_blank' : undefined,
    title: title ?? undefined,
    onClick: (event: MouseEvent) => {
      if (ctx.onLinkClick?.(href, event) === false)
        event.preventDefault()
    },
  }, () => children)
}
