import type { MdNode, MdPoint } from './ast.js'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'
import { findSettledEnd } from './blocks.js'
import { createIndentationMask, freeCharacters, markDeepIndentedBlocks, restoreIndentation } from './indentation.js'
import { refuseUnsafeDestinations } from './refusedLinks.js'
import { markEmptyTaskItems } from './taskList.js'
import { trimStreamingTail } from './trim.js'

const markdownExtensions = [
  gfm(),
  // No indented code blocks: a line indented four columns is paragraph text.
  { disable: { null: ['htmlFlow', 'htmlText', 'codeIndented'] } },
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

function parseTree(text: string): MdNode {
  return fromMarkdown(text, {
    extensions: markdownExtensions,
    mdastExtensions,
  }) as unknown as MdNode
}

/**
 * A block marker four columns deep is paragraph text upstream, so those blocks
 * are read again with their indentation swapped out. Swapping uncovers the
 * next such block, hence the rounds; each round only ever adds lines.
 */
function parseBlocks(source: string): { root: MdNode, mask: ReturnType<typeof createIndentationMask> } {
  const mask = createIndentationMask(source)
  let root = parseTree(source)
  if (mask != null) {
    for (let round = 0; round < 5; round++) {
      if (!markDeepIndentedBlocks(root.children ?? [], mask))
        break
      root = parseTree(mask.text)
    }
  }
  return { root, mask }
}

export function parseMarkdown(source: string, options?: ParseMarkdownOptions): MdNode {
  const { root, mask } = parseBlocks(source)
  const safe = refuseUnsafeDestinations(markEmptyTaskItems(root), source)
  const tree = options?.autolink === 'gfm' ? safe : stripAutolinkLiterals(safe, source)
  return mask == null ? tree : restoreIndentation(tree, mask)
}

/** Puts a node's offsets back in the text the markers were added to. */
function unprefix(node: MdNode, marker: string): MdNode {
  const children = node.children?.map(child => unprefix(child, marker))
  const value = node.value?.split(marker).join('')
  const position = node.position?.start == null
    ? node.position
    : {
        start: shiftPoint(node.position.start),
        end: node.position.end == null ? node.position.end : shiftPoint(node.position.end),
      }
  return {
    ...node,
    ...(value == null || value === node.value ? {} : { value }),
    ...(children == null ? {} : { children }),
    ...(position === node.position ? {} : { position }),
  }
}

function shiftPoint(point: MdPoint): MdPoint {
  const line = point.line ?? 1
  const column = point.column ?? 1
  return {
    line,
    column: column - 1,
    offset: point.offset == null ? point.offset : point.offset - line,
  }
}

/**
 * Inline content of `source`, with no block syntax read at all: `# h` is text
 * and a fence is a code span. Every line is prefixed with a private-use
 * character first, so no line can start a block, and the prefix is stripped
 * from the text afterwards.
 */
export function parseInlineContent(source: string, options?: ParseMarkdownOptions): MdNode[] {
  if (source === '')
    return []
  const marker = freeCharacters(source, 1)[0]
  if (marker == null)
    return [{ type: 'text', value: source }]

  const prefixed = `${marker}${source.split('\n').join(`\n${marker}`)}`
  const root = parseTree(prefixed)
  const paragraph = root.children?.length === 1 ? root.children[0] : undefined
  if (paragraph?.type !== 'paragraph')
    return [{ type: 'text', value: source }]

  const safe = refuseUnsafeDestinations(paragraph, prefixed)
  const inline = options?.autolink === 'gfm' ? safe : stripAutolinkLiterals(safe, prefixed)
  const nodes = (inline.children ?? [])
    .map(child => unprefix(child, marker))
    .filter(child => child.type !== 'text' || (child.value ?? '') !== '')
  return nodes.length === 0 ? [{ type: 'text', value: source }] : nodes
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
