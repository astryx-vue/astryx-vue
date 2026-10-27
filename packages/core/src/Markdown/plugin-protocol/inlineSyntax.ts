import type { MdNode } from '../ast.js'
import type { PreparedContribution } from './syntaxMatch.js'
import { decodeLiteralText } from '../characterReferences.js'
import { matchAt, pointAt } from './syntaxMatch.js'

/**
 * Plugin syntax is read on the source text itself, at every position the
 * Markdown parser read as text. A match may span the marks and links around
 * it, and it replaces whatever they built: `{{see **this**}}` is one node, not
 * an aside holding a bold run.
 */
const NOT_TEXT = new Set([
  'code',
  'inlineCode',
  'inlineMath',
  'link',
  'linkReference',
  'image',
  'imageReference',
])

/** Blocks whose content upstream reads inline as one run of text. */
const INLINE_BLOCKS = new Set(['paragraph', 'heading', 'tableCell'])

interface Spliced {
  readonly nodes: MdNode[]
  /** Absolute offset the last match consumed up to, or -1 without a match. */
  readonly consumedTo: number
  readonly deferred: boolean
}

function textNode(value: string): MdNode {
  return { type: 'text', value: decodeLiteralText(value) }
}

/** True when a backslash in the source makes this position escaped text. */
function isEscaped(source: string, offset: number): boolean {
  let backslashes = 0
  while (source[offset - 1 - backslashes] === '\\')
    backslashes += 1
  return backslashes % 2 === 1
}

/** Matches inside one text node; a match may read past the node's own end. */
function spliceText(
  node: MdNode,
  source: string,
  limit: number,
  contributions: readonly PreparedContribution[],
  isFinal: boolean,
): Spliced {
  const start = node.position?.start?.offset
  const end = node.position?.end?.offset
  if (start == null || end == null)
    return { nodes: [node], consumedTo: -1, deferred: false }

  const pieces: MdNode[] = []
  let textStart = start
  let cursor = start
  let consumedTo = -1
  let deferred = false
  while (cursor < end) {
    // `\\@{a}` is an escaped `@`, so plugin syntax does not start there.
    if (isEscaped(source, cursor)) {
      cursor += 1
      continue
    }
    const matched = matchAt(source, cursor, limit, 'inline', contributions, isFinal)
    if (matched.status === 'match') {
      if (cursor > textStart)
        pieces.push(textNode(source.slice(textStart, cursor)))
      pieces.push(matched.node)
      cursor = matched.end
      consumedTo = cursor
      textStart = Math.min(cursor, end)
      continue
    }
    if (matched.status === 'defer') {
      deferred = true
      break
    }
    cursor += 1
  }
  if (pieces.length === 0)
    return { nodes: [node], consumedTo: -1, deferred }
  if (textStart < end)
    pieces.push(textNode(source.slice(textStart, end)))
  return { nodes: pieces, consumedTo, deferred }
}

function spliceNodes(
  nodes: readonly MdNode[],
  source: string,
  limit: number,
  contributions: readonly PreparedContribution[],
  isFinal: boolean,
): Spliced {
  const out: MdNode[] = []
  let consumedTo = -1
  let deferred = false
  let changed = false
  for (let node of nodes) {
    const start = node.position?.start?.offset
    const end = node.position?.end?.offset

    // A match that started earlier already covers part of this node.
    if (start != null && end != null && consumedTo > start) {
      changed = true
      // Fully covered, or a mark the match swallowed: the match replaces it.
      if (end <= consumedTo || node.type !== 'text' || node.value == null)
        continue
      node = {
        ...node,
        value: decodeLiteralText(source.slice(consumedTo, end)),
        position: { start: pointAt(source, consumedTo), end: pointAt(source, end) },
      }
      consumedTo = -1
    }

    if (start == null || end == null || NOT_TEXT.has(node.type)) {
      out.push(node)
      continue
    }

    if (node.type === 'text') {
      const spliced = spliceText(node, source, limit, contributions, isFinal)
      out.push(...spliced.nodes)
      if (spliced.deferred)
        deferred = true
      if (spliced.consumedTo > end)
        consumedTo = spliced.consumedTo
      if (spliced.nodes.length !== 1 || spliced.nodes[0] !== node)
        changed = true
      continue
    }

    if (node.children == null || node.children.length === 0) {
      out.push(node)
      continue
    }

    const inner = spliceNodes(
      node.children,
      source,
      INLINE_BLOCKS.has(node.type) ? end : limit,
      contributions,
      isFinal,
    )
    if (inner.deferred)
      deferred = true
    if (inner.consumedTo > end) {
      // The match swallowed the rest of this mark, so the mark is matched
      // source: its content stands where it did, one level up.
      out.push(...inner.nodes)
      consumedTo = inner.consumedTo
      changed = true
      continue
    }
    if (inner.nodes.some((child, index) => child !== node.children?.[index]) || inner.nodes.length !== node.children.length) {
      out.push({ ...node, children: inner.nodes })
      changed = true
      continue
    }
    out.push(node)
  }
  return { nodes: changed ? out : [...nodes], consumedTo, deferred }
}

/** Replaces every inline plugin match in `root` with its extension node. */
export function spliceInlineSyntax(
  root: MdNode,
  source: string,
  contributions: readonly PreparedContribution[],
  isFinal: boolean,
): MdNode {
  if (root.children == null || contributions.length === 0)
    return root
  const spliced = spliceNodes(root.children, source, source.length, contributions, isFinal)
  return spliced.nodes.some((node, index) => node !== root.children?.[index]) ? { ...root, children: spliced.nodes } : root
}
