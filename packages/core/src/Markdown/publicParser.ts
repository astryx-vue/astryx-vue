import type { MdNode } from './ast.js'
import type { MarkdownAstPhrasingContent, MarkdownAstRoot } from './canonicalAst.js'
import type { BlockNode, InlineNode } from './legacyNodes.js'
import type { MarkdownPluginEntry } from './plugin-protocol/protocol.js'
import { decodeMarkdownCharacterReferences } from './characterReferences.js'
import { projectBlocks, projectInline } from './legacyNodes.js'
import { parseInlineContent, parseMarkdown as parseMarkdownTree } from './parse.js'
import { applyProtocolTransforms } from './plugin-protocol/run.js'
import { applyCitations, applyMarkdownSyntax } from './plugin-protocol/syntax.js'

export interface ParseOptions {
  /** `'gfm'` keeps bare URLs, `www.` hosts, and emails as links. */
  readonly autolink?: 'gfm'
  /** Attach `{ start, end }` source offsets on top-level legacy blocks. */
  readonly sourceRanges?: boolean
  /** Ids that turn `[id]` and `【id】` into citation nodes. */
  readonly sourceIds?: Iterable<string>
  readonly plugins?: readonly MarkdownPluginEntry[]
  /**
   * `false` while a stream is still open. An unclosed frontmatter fence then
   * defers instead of being dropped. Defaults to `true`.
   */
  readonly isFinal?: boolean
  /**
   * Accepted so callers can pass it. This parser does not emit math nodes.
   */
  readonly math?: boolean
}

export type MathParseOptions = ParseOptions
export type IncrementalParseOptions = ParseOptions
export type IncrementalMathParseOptions = ParseOptions

export interface IncrementalState {
  prevInput: string
  settledText: string
  settledBlocks: BlockNode[]
  settledUpTo: number
}

function idSet(sourceIds: Iterable<string> | undefined): ReadonlySet<string> | undefined {
  if (sourceIds == null)
    return undefined
  const ids = sourceIds instanceof Set ? sourceIds : new Set(sourceIds)
  return ids.size === 0 ? undefined : ids
}

function parseTree(source: string, options?: ParseOptions): MdNode {
  let root = parseMarkdownTree(source, { autolink: options?.autolink })
  const ids = idSet(options?.sourceIds)
  if (ids != null)
    root = applyCitations(root, ids)
  const plugins = options?.plugins
  if (plugins != null && plugins.length > 0) {
    const isFinal = options?.isFinal !== false
    root = applyMarkdownSyntax(root, source, plugins, isFinal)
    root = applyProtocolTransforms(root, plugins, source, isFinal)
  }
  return root
}

/** Canonical mdast-shaped root, including plugin syntax and transforms. */
export function parseMarkdownAst(source: string, options?: ParseOptions): MarkdownAstRoot {
  return parseTree(source, options) as MarkdownAstRoot
}

/** Phrasing children of `source`, read as inline content only. */
export function parseInlineAst(source: string, options?: ParseOptions): MarkdownAstPhrasingContent[] {
  const nodes = parseInlineContent(source, { autolink: options?.autolink })
  // 插件语法是在原文上按偏移找的，要往一个块里找，这个块就得带着覆盖整段原文的位置；没有位置的块会被整个跳过。
  const whole = { start: { line: 1, column: 0, offset: 0 }, end: { line: 1 + (source.match(/\n/g)?.length ?? 0), column: 0, offset: source.length } }
  let root: MdNode = { type: 'root', position: whole, children: [{ type: 'paragraph', position: whole, children: nodes }] }
  const plugins = options?.plugins
  if (plugins != null && plugins.length > 0) {
    const isFinal = options?.isFinal !== false
    root = applyMarkdownSyntax(root, source, plugins, isFinal)
    root = applyProtocolTransforms(root, plugins, source, isFinal)
  }
  const paragraph = root.children?.[0]
  return (paragraph?.children ?? []) as MarkdownAstPhrasingContent[]
}

/** Legacy block list. `sourceRanges` adds offsets on the top-level blocks. */
export function parseMarkdown(source: string, options?: ParseOptions): BlockNode[] {
  const root = parseTree(source, options)
  return projectBlocks(root.children ?? [], options?.sourceRanges === true)
}

export function parseInline(source: string, options?: ParseOptions): InlineNode[] {
  return parseInlineAst(source, options).map(node => projectInline(node as MdNode))
}

export function createIncrementalState(): IncrementalState {
  return {
    prevInput: '',
    settledText: '',
    settledBlocks: [],
    settledUpTo: 0,
  }
}

/**
 * Public incremental entry. The result matches a full parse. The state records
 * the latest source so a later call can see what was already settled.
 */
export function parseMarkdownIncremental(
  source: string,
  state: IncrementalState,
  options?: ParseOptions,
): BlockNode[] {
  const blocks = parseMarkdown(source, options)
  state.prevInput = source
  state.settledText = source
  state.settledBlocks = blocks
  state.settledUpTo = source.length
  return blocks
}

export { decodeMarkdownCharacterReferences }
