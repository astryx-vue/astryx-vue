import type { MdNode } from '../ast.js'
import type {
  MarkdownExtensionNode,
  MarkdownPluginEntry,
  MarkdownSyntaxContribution,
  MarkdownTokenizeResult,
} from './protocol.js'
import { freezeMarkdownPluginData, getMarkdownPluginDefinition, isMarkdownPluginData } from './protocol.js'

export interface PreparedContribution {
  readonly pluginName: string
  readonly display: 'inline' | 'block'
  readonly startsWith: readonly string[]
  readonly maxSpan: number
  readonly tokenize: MarkdownSyntaxContribution['tokenize']
  readonly rendererNames: ReadonlySet<string>
}

export interface PreparedSyntax {
  readonly inline: readonly PreparedContribution[]
  readonly block: readonly PreparedContribution[]
}

export type ExtensionMatch
  = | { readonly status: 'none' }
    | { readonly status: 'defer' }
    | { readonly status: 'match', readonly end: number, readonly node: MdNode }

/** The plugins' syntax contributions, split by the kind of match they make. */
export function prepareSyntax(plugins: readonly MarkdownPluginEntry[]): PreparedSyntax {
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

export function pointAt(source: string, offset: number): { line: number, column: number, offset: number } {
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

/**
 * The contribution that matches at `offset`, if any. The tokenizer sees the
 * source from its start up to `offset + maxSpan`, so it can read past the
 * marks and links around the match.
 */
export function matchAt(
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
