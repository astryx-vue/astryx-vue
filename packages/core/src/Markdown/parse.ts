import type { MdNode } from './ast.js'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'
import { findSettledEnd } from './blocks.js'
import { trimStreamingTail } from './trim.js'

const markdownExtensions = [
  gfm(),
  { disable: { null: ['htmlFlow', 'htmlText'] } },
]

const mdastExtensions = [gfmFromMarkdown()]

export interface ParseMarkdownOptions {
  /**
   * `'gfm'` keeps GitHub-style bare URLs, `www.` hosts, and emails as links.
   * Omit it and those stay text. Angle-bracket autolinks stay either way.
   */
  autolink?: 'gfm'
}

function isAutolinkLiteral(node: MdNode, source: string): boolean {
  if (node.type !== 'link' || (node.title != null && node.title !== ''))
    return false

  const only = node.children?.length === 1 ? node.children[0] : null
  if (only == null || only.type !== 'text' || only.value == null)
    return false

  const start = node.position?.start?.offset
  const end = node.position?.end?.offset
  if (start == null || end == null)
    return false

  const raw = source.slice(start, end)
  if (raw.startsWith('<') || raw.startsWith('['))
    return false

  return raw === only.value
}

/** Turn bare autolinks back into text. Explicit links and `<url>` stay. */
function stripAutolinkLiterals(node: MdNode, source: string): MdNode {
  if (node.children == null)
    return node

  let changed = false
  const children: MdNode[] = []
  for (const child of node.children) {
    if (isAutolinkLiteral(child, source)) {
      const start = child.position?.start?.offset ?? 0
      const end = child.position?.end?.offset ?? start
      children.push({ type: 'text', value: source.slice(start, end) })
      changed = true
      continue
    }
    const next = stripAutolinkLiterals(child, source)
    if (next !== child)
      changed = true
    children.push(next)
  }

  if (!changed)
    return node

  return { ...node, children: mergeAdjacentText(children) }
}

function mergeAdjacentText(children: MdNode[]): MdNode[] {
  const merged: MdNode[] = []
  for (const child of children) {
    const previous = merged[merged.length - 1]
    if (previous?.type === 'text' && child.type === 'text') {
      merged[merged.length - 1] = {
        type: 'text',
        value: `${previous.value ?? ''}${child.value ?? ''}`,
      }
      continue
    }
    merged.push(child)
  }
  return merged
}

export function parseMarkdown(source: string, options?: ParseMarkdownOptions): MdNode {
  const root = fromMarkdown(source, {
    extensions: markdownExtensions,
    mdastExtensions,
  }) as unknown as MdNode

  if (options?.autolink === 'gfm')
    return root

  return stripAutolinkLiterals(root, source)
}

export interface IncrementalMarkdownState {
  settledEnd: number
  settledSource: string
  blocks: MdNode[]
}

export function createIncrementalMarkdownState(): IncrementalMarkdownState {
  return { settledEnd: 0, settledSource: '', blocks: [] }
}

function resetIncrementalState(state: IncrementalMarkdownState): void {
  state.settledEnd = 0
  state.settledSource = ''
  state.blocks = []
}

export interface IncrementalParseResult {
  blocks: MdNode[]
  settledCount: number
}

/**
 * Parse `source`, reusing the AST of every block that has already closed.
 * Only the suffix after {@link findSettledEnd} is parsed again. When `source`
 * is no longer an append of the previous value, the cache is dropped.
 */
export function parseMarkdownIncremental(
  source: string,
  state: IncrementalMarkdownState,
  options?: { trimTail?: boolean, autolink?: 'gfm' },
): IncrementalParseResult {
  const settledPrefix = state.settledSource.slice(0, state.settledEnd)
  if (settledPrefix.length > 0 && !source.startsWith(settledPrefix))
    resetIncrementalState(state)

  const end = findSettledEnd(source)
  if (end < state.settledEnd)
    resetIncrementalState(state)

  if (end > state.settledEnd) {
    const slice = source.slice(state.settledEnd, end)
    if (slice.trim() !== '') {
      const children = parseMarkdown(slice, { autolink: options?.autolink }).children ?? []
      state.blocks = state.blocks.concat(children)
    }
    state.settledEnd = end
  }
  state.settledSource = source

  const tail = source.slice(state.settledEnd)
  const prepared = options?.trimTail === true ? trimStreamingTail(tail) : tail
  const tailBlocks = prepared.trim() === '' ? [] : parseMarkdown(prepared, { autolink: options?.autolink }).children ?? []
  return {
    blocks: state.blocks.concat(tailBlocks),
    settledCount: state.blocks.length,
  }
}
