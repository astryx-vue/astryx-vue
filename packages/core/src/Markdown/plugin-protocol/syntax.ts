import type { MdNode } from '../ast.js'
import type { MarkdownPluginEntry } from './protocol.js'
import type { PreparedContribution } from './syntaxMatch.js'
import { spliceInlineSyntax } from './inlineSyntax.js'
import { matchAt, prepareSyntax } from './syntaxMatch.js'

function codeRanges(root: MdNode): Array<{ start: number, end: number }> {
  const ranges: Array<{ start: number, end: number }> = []
  const visit = (node: MdNode): void => {
    if (node.type === 'code') {
      const start = node.position?.start?.offset
      const end = node.position?.end?.offset
      if (start != null && end != null)
        ranges.push({ start, end })
    }
    for (const child of node.children ?? [])
      visit(child)
  }
  visit(root)
  return ranges
}

function replaceBlocks(
  root: MdNode,
  source: string,
  contributions: readonly PreparedContribution[],
  isFinal: boolean,
): MdNode {
  const ranges = codeRanges(root)
  const matches: Array<{ start: number, end: number, node: MdNode }> = []
  let offset = 0
  let coveredUntil = 0
  while (offset <= source.length) {
    const insideCode = ranges.some(range => offset >= range.start && offset < range.end)
    if (offset >= coveredUntil && !insideCode) {
      const matched = matchAt(source, offset, source.length, 'block', contributions, isFinal)
      if (matched.status === 'match') {
        matches.push({ start: offset, end: matched.end, node: matched.node })
        coveredUntil = matched.end
        offset = matched.end
        continue
      }
    }
    const next = source.indexOf('\n', offset)
    if (next === -1)
      break
    offset = next + 1
  }
  if (matches.length === 0)
    return root

  const children = root.children ?? []
  const next: MdNode[] = []
  let matchIndex = 0
  for (const child of children) {
    const start = child.position?.start?.offset
    const end = child.position?.end?.offset
    const match = matches[matchIndex]
    if (match != null && start != null && end != null && end > match.start && start < match.end) {
      if (next[next.length - 1] !== match.node)
        next.push(match.node)
      if (end >= match.end)
        matchIndex += 1
      continue
    }
    next.push(child)
  }
  return { ...root, children: next }
}

/**
 * Apply plugin syntax after the CommonMark parse.
 * Inline matches are spliced into text nodes. Block matches replace
 * top-level children that overlap the match. Code fences are left alone.
 */
export function applyMarkdownSyntax(
  root: MdNode,
  source: string,
  plugins: readonly MarkdownPluginEntry[],
  isFinal: boolean,
): MdNode {
  const prepared = prepareSyntax(plugins)
  if (prepared.inline.length === 0 && prepared.block.length === 0)
    return root
  let current = spliceInlineSyntax(root, source, prepared.inline, isFinal)
  if (prepared.block.length > 0)
    current = replaceBlocks(current, source, prepared.block, isFinal)
  return current
}

const BRACKET_CITE = /\[([^\]\s]+)\]|【([^】\s]+)】/g

/** Turn `[id]` and `【id】` text into citation nodes when the id is known. */
export function applyCitations(root: MdNode, sourceIds: ReadonlySet<string>): MdNode {
  const visit = (nodes: readonly MdNode[], parentType: string): { nodes: MdNode[], changed: boolean } => {
    if (parentType === 'code' || parentType === 'inlineCode')
      return { nodes: [...nodes], changed: false }
    let changed = false
    const next: MdNode[] = []
    for (const node of nodes) {
      const text = node.type === 'text' ? node.value ?? '' : ''
      if (text.includes('[') || text.includes('【')) {
        const parts = splitCitations(node.value ?? '', sourceIds)
        if (parts != null) {
          changed = true
          next.push(...parts)
          continue
        }
      }
      if (node.children != null && node.children.length > 0) {
        const mapped = visit(node.children, node.type)
        if (mapped.changed) {
          changed = true
          next.push({ ...node, children: mapped.nodes })
          continue
        }
      }
      next.push(node)
    }
    return { nodes: next, changed }
  }
  if (root.children == null)
    return root
  const mapped = visit(root.children, 'root')
  return mapped.changed ? { ...root, children: mapped.nodes } : root
}

function splitCitations(value: string, sourceIds: ReadonlySet<string>): MdNode[] | null {
  const pieces: MdNode[] = []
  let cursor = 0
  let changed = false
  BRACKET_CITE.lastIndex = 0
  for (const match of value.matchAll(BRACKET_CITE)) {
    const id = match[1] ?? match[2] ?? ''
    const index = match.index ?? 0
    if (!sourceIds.has(id))
      continue
    if (match[1] != null && value[index + match[0].length] === '(')
      continue
    if (index > cursor)
      pieces.push({ type: 'text', value: value.slice(cursor, index) })
    pieces.push({ type: 'citation', sourceId: id })
    cursor = index + match[0].length
    changed = true
  }
  if (!changed)
    return null
  if (cursor < value.length)
    pieces.push({ type: 'text', value: value.slice(cursor) })
  return pieces
}
