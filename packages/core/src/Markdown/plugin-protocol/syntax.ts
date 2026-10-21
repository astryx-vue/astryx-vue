import type { MdNode } from '../ast.js'
import type {
  MarkdownExtensionNode,
  MarkdownPluginEntry,
  MarkdownSyntaxContribution,
  MarkdownTokenizeResult,
} from './protocol.js'
import { freezeMarkdownPluginData, getMarkdownPluginDefinition, isMarkdownPluginData } from './protocol.js'

interface PreparedContribution {
  readonly pluginName: string
  readonly display: 'inline' | 'block'
  readonly startsWith: readonly string[]
  readonly maxSpan: number
  readonly tokenize: MarkdownSyntaxContribution['tokenize']
  readonly rendererNames: ReadonlySet<string>
}

interface PreparedSyntax {
  readonly inline: readonly PreparedContribution[]
  readonly block: readonly PreparedContribution[]
}

type ExtensionMatch
  = | { readonly status: 'none' }
    | { readonly status: 'defer' }
    | { readonly status: 'match', readonly end: number, readonly node: MdNode }

function prepareSyntax(plugins: readonly MarkdownPluginEntry[]): PreparedSyntax {
  const inline: PreparedContribution[] = []
  const block: PreparedContribution[] = []
  const names = new Set<string>()
  for (const plugin of plugins) {
    const definition = getMarkdownPluginDefinition(plugin)
    if (names.has(definition.name))
      throw new Error(`Markdown plugin: duplicate name "${definition.name}"`)
    names.add(definition.name)
    if (!('syntax' in definition) || definition.syntax == null)
      continue
    const rendererNames = new Set(Object.keys(definition.renderers))
    const take = (display: 'inline' | 'block', group: readonly MarkdownSyntaxContribution[] | undefined): void => {
      for (const contribution of group ?? []) {
        const prepared: PreparedContribution = {
          pluginName: definition.name,
          display,
          startsWith: contribution.startsWith,
          maxSpan: contribution.maxSpan,
          tokenize: contribution.tokenize,
          rendererNames,
        }
        ;(display === 'inline' ? inline : block).push(prepared)
      }
    }
    take('inline', definition.syntax.inline)
    take('block', definition.syntax.block)
  }
  return { inline, block }
}

function pointAt(source: string, offset: number): { line: number, column: number, offset: number } {
  let line = 1
  let column = 1
  const limit = Math.min(offset, source.length)
  for (let index = 0; index < limit; index += 1) {
    if (source.charCodeAt(index) === 10) {
      line += 1
      column = 1
    }
    else {
      column += 1
    }
  }
  return { line, column, offset }
}

function matchAt(
  source: string,
  offset: number,
  limit: number,
  display: 'inline' | 'block',
  contributions: readonly PreparedContribution[],
  isFinal: boolean,
): ExtensionMatch {
  const first = source[offset]
  if (first == null)
    return { status: 'none' }
  for (const contribution of contributions) {
    if (!contribution.startsWith.some(prefix => prefix[0] === first))
      continue
    let fullPrefix = false
    for (const prefix of contribution.startsWith) {
      if (source.startsWith(prefix, offset)) {
        fullPrefix = true
        break
      }
      if (!isFinal) {
        const remaining = source.slice(offset)
        if (remaining.length < prefix.length && prefix.startsWith(remaining))
          return { status: 'defer' }
      }
    }
    if (!fullPrefix)
      continue

    const endLimit = Math.min(source.length, offset + contribution.maxSpan, limit)
    let result: MarkdownTokenizeResult<MarkdownExtensionNode>
    try {
      result = contribution.tokenize({
        source: endLimit === source.length ? source : source.slice(0, endLimit),
        offset,
        end: endLimit,
        isFinal,
        context: display,
        lineStart: source.lastIndexOf('\n', offset - 1) + 1,
        column: offset - (source.lastIndexOf('\n', offset - 1) + 1),
      })
    }
    catch {
      continue
    }
    if (result == null || typeof result !== 'object' || typeof (result as { then?: unknown }).then === 'function')
      continue
    if (result.status === 'no-match')
      continue
    if (result.status === 'defer') {
      if (!isFinal && endLimit === source.length && source.length - offset < contribution.maxSpan)
        return { status: 'defer' }
      continue
    }
    if (result.status !== 'match')
      continue
    const node = result.node
    if (
      !Number.isInteger(result.end)
      || result.end <= offset
      || result.end > endLimit
      || node.type !== 'extension'
      || node.plugin !== contribution.pluginName
      || node.display !== display
      || node.name.trim() === ''
      || !isMarkdownPluginData(node.data)
      || !contribution.rendererNames.has(node.name)
    ) {
      continue
    }
    return {
      status: 'match',
      end: result.end,
      node: {
        ...node,
        data: freezeMarkdownPluginData(node.data),
        source: source.slice(offset, result.end),
        position: {
          start: pointAt(source, offset),
          end: pointAt(source, result.end),
        },
      },
    }
  }
  return { status: 'none' }
}

function splitText(
  node: MdNode,
  source: string,
  contributions: readonly PreparedContribution[],
  isFinal: boolean,
): MdNode[] | null {
  const value = node.value ?? ''
  const base = node.position?.start?.offset
  const end = node.position?.end?.offset
  const raw = base != null && end != null ? source.slice(base, end) : value
  const usingDocument = raw === value && base != null
  const text = usingDocument ? source : value
  const origin = usingDocument ? base : 0
  const limit = origin + (usingDocument ? raw.length : value.length)
  const pieces: MdNode[] = []
  let cursor = origin
  let textStart = origin
  let changed = false
  while (cursor < limit) {
    const matched = matchAt(text, cursor, limit, 'inline', contributions, isFinal)
    if (matched.status === 'match') {
      if (cursor > textStart)
        pieces.push({ type: 'text', value: text.slice(textStart, cursor) })
      pieces.push(matched.node)
      cursor = matched.end
      textStart = cursor
      changed = true
      continue
    }
    if (matched.status === 'defer')
      break
    cursor += 1
  }
  if (!changed)
    return null
  if (textStart < limit)
    pieces.push({ type: 'text', value: text.slice(textStart, limit) })
  return pieces
}

function mapChildren(
  nodes: readonly MdNode[],
  source: string,
  contributions: readonly PreparedContribution[],
  isFinal: boolean,
  parentType: string,
): { nodes: MdNode[], changed: boolean } {
  if (parentType === 'code' || parentType === 'inlineCode')
    return { nodes: [...nodes], changed: false }
  let changed = false
  const next: MdNode[] = []
  for (const node of nodes) {
    if (node.type === 'text' && node.value != null && node.value !== '') {
      const parts = splitText(node, source, contributions, isFinal)
      if (parts != null) {
        changed = true
        next.push(...parts)
        continue
      }
    }
    if (node.children != null && node.children.length > 0) {
      const mapped = mapChildren(node.children, source, contributions, isFinal, node.type)
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
  let current = root
  if (prepared.inline.length > 0 && current.children != null) {
    const mapped = mapChildren(current.children, source, prepared.inline, isFinal, 'root')
    if (mapped.changed)
      current = { ...current, children: mapped.nodes }
  }
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
