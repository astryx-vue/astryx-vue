import type { MdNode } from '../ast.js'
import type { MarkdownAstRoot } from '../canonicalAst.js'
import type { MarkdownPluginEntry } from './protocol.js'
import { getMarkdownPluginDefinition } from './protocol.js'

/**
 * Run each plugin transform in order. A plugin that returns the same root
 * leaves settled blocks reusable. Reported messages are warnings, not throws.
 */
export function applyProtocolTransforms(
  root: MdNode,
  plugins: readonly MarkdownPluginEntry[],
  source: string,
  isFinal: boolean,
): MdNode {
  let current = root
  for (const plugin of plugins) {
    const definition = getMarkdownPluginDefinition(plugin)
    if (definition.transform == null)
      continue
    const reports: string[] = []
    const next = definition.transform(current as MarkdownAstRoot, {
      source,
      isFinal,
      display: 'block',
      report(message: string) {
        reports.push(message)
      },
    })
    for (const message of reports) {
      if (typeof console !== 'undefined')
        console.warn(`[Astryx] Markdown plugin "${definition.name}": ${message}`)
    }
    if (next != null)
      current = next as MdNode
  }
  return current
}
