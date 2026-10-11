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

export function parseMarkdown(source: string): MdNode {
  const root = fromMarkdown(source, {
    extensions: markdownExtensions,
    mdastExtensions,
  })
  return root as unknown as MdNode
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
  options?: { trimTail?: boolean },
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
      const children = parseMarkdown(slice).children ?? []
      state.blocks = state.blocks.concat(children)
    }
    state.settledEnd = end
  }
  state.settledSource = source

  const tail = source.slice(state.settledEnd)
  const prepared = options?.trimTail === true ? trimStreamingTail(tail) : tail
  const tailBlocks = prepared.trim() === '' ? [] : parseMarkdown(prepared).children ?? []
  return {
    blocks: state.blocks.concat(tailBlocks),
    settledCount: state.blocks.length,
  }
}
