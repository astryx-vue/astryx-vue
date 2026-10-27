import type { MdNode } from './ast.js'
import { plainText } from './ast.js'
import { isSafeMarkdownParserUrl } from './url.js'

/**
 * Nodes whose destination the parser refuses outright.
 * A refused link is not a link with no `href`; it is never a link at all.
 */
function hasRefusedDestination(node: MdNode): boolean {
  if (node.type !== 'link' && node.type !== 'image')
    return false
  return node.url != null && !isSafeMarkdownParserUrl(node.url)
}

/**
 * The source text a refused link stands for. Readers see the markup as
 * written, so everything inside it (code spans, emphasis) stays plain text.
 */
function refusedSource(node: MdNode, source: string): string {
  const start = node.position?.start?.offset
  const end = node.position?.end?.offset
  if (start != null && end != null && end > start)
    return source.slice(start, end)
  if (node.type === 'image')
    return `![${plainText(node)}](${node.url ?? ''})`
  return `[${plainText(node)}](${node.url ?? ''})`
}

function mergeText(nodes: MdNode[]): MdNode[] {
  const merged: MdNode[] = []
  for (const node of nodes) {
    const previous = merged[merged.length - 1]
    if (previous?.type === 'text' && node.type === 'text') {
      merged[merged.length - 1] = { type: 'text', value: `${previous.value ?? ''}${node.value ?? ''}` }
      continue
    }
    merged.push(node)
  }
  return merged
}

/** `node` with every unsafe destination inside it replaced by its source text. */
function refuse(node: MdNode, source: string): MdNode {
  if (hasRefusedDestination(node))
    return { type: 'text', value: refusedSource(node, source) }
  const children = node.children
  if (children == null)
    return node

  const next = children.map(child => refuse(child, source))
  if (next.every((child, index) => child === children[index]))
    return node

  return { ...node, children: mergeText(next) }
}

/**
 * Read every unsafe link and image destination as the text that was written.
 * `javascript:`, `vbscript:`, and HTML `data:` destinations never reach a
 * renderer as links, so no later stage has to strip an `href`.
 */
export function refuseUnsafeDestinations(root: MdNode, source: string): MdNode {
  return refuse(root, source)
}
