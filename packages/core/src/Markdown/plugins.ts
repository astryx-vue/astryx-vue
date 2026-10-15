import type { VNodeChild } from 'vue'
import type { MdNode } from './ast.js'

export interface MarkdownTransformContext {
  /** Record a problem. The document still renders. */
  report: (message: string) => void
}

export interface MarkdownPluginRenderContext {
  /** Render this node's children with the normal Markdown renderers. */
  renderChildren: () => VNodeChild[]
}

/**
 * A document plugin. `transform` receives the parsed root and returns the next
 * root. Return the same root when nothing changed so a streaming render can
 * reuse settled blocks. `render` draws `extension` nodes whose `plugin` equals
 * `name`.
 */
export interface MarkdownPlugin {
  name: string
  transform?: (root: MdNode, context: MarkdownTransformContext) => MdNode
  render?: (node: MdNode, context: MarkdownPluginRenderContext) => VNodeChild | null
}

/**
 * A text-node plugin. `pattern` needs the `g` flag. Matches inside inline
 * code and fenced code never run, because those nodes are not text.
 * `replace` returns the node for the match, or `null` to skip it.
 * `render` draws an extension node whose `plugin` equals `name`.
 */
export interface MarkdownInlinePlugin {
  name?: string
  pattern: RegExp
  getEndIndex?: (text: string, match: RegExpMatchArray) => number | false
  replace: (match: RegExpMatchArray) => MdNode | null
  render?: (node: MdNode, context: MarkdownPluginRenderContext) => VNodeChild | null
}

export function defineMarkdownPlugin<Plugin extends MarkdownPlugin>(plugin: Plugin): Plugin {
  return plugin
}

export function applyMarkdownPlugins(root: MdNode, plugins?: readonly MarkdownPlugin[]): MdNode {
  if (plugins == null || plugins.length === 0)
    return root

  let current = root
  for (const plugin of plugins) {
    if (plugin.transform == null)
      continue

    const reports: string[] = []
    const next = plugin.transform(current, {
      report(message: string) {
        reports.push(message)
      },
    })
    for (const message of reports) {
      if (typeof console !== 'undefined')
        console.warn(`[Astryx] Markdown plugin "${plugin.name}": ${message}`)
    }
    if (next != null)
      current = next
  }
  return current
}

interface HeldMatch {
  start: number
  end: number
  node: MdNode
}

function splitText(text: string, plugins: readonly MarkdownInlinePlugin[]): MdNode[] | null {
  const held: HeldMatch[] = []

  for (const plugin of plugins) {
    if (!plugin.pattern.global) {
      if (typeof console !== 'undefined')
        console.warn('[Astryx] Markdown inline plugin patterns need the g flag.')
      continue
    }

    plugin.pattern.lastIndex = 0
    let match = plugin.pattern.exec(text)
    while (match != null) {
      if (match[0].length === 0) {
        plugin.pattern.lastIndex += 1
        match = plugin.pattern.exec(text)
        continue
      }

      let end = match.index + match[0].length
      if (plugin.getEndIndex != null) {
        const refined = plugin.getEndIndex(text, match)
        if (refined === false) {
          match = plugin.pattern.exec(text)
          continue
        }
        end = refined
      }
      if (end <= match.index) {
        match = plugin.pattern.exec(text)
        continue
      }
      end = Math.min(end, text.length)

      const node = plugin.replace(match)
      if (node != null)
        held.push({ start: match.index, end, node })
      match = plugin.pattern.exec(text)
    }
  }

  if (held.length === 0)
    return null

  held.sort((left, right) => left.start - right.start)
  const resolved: HeldMatch[] = []
  let lastEnd = 0
  for (const item of held) {
    if (item.start >= lastEnd) {
      resolved.push(item)
      lastEnd = item.end
    }
  }

  const nodes: MdNode[] = []
  let cursor = 0
  for (const item of resolved) {
    if (item.start > cursor)
      nodes.push({ type: 'text', value: text.slice(cursor, item.start) })
    nodes.push(item.node)
    cursor = item.end
  }
  if (cursor < text.length)
    nodes.push({ type: 'text', value: text.slice(cursor) })
  return nodes
}

function mapInline(nodes: MdNode[], plugins: readonly MarkdownInlinePlugin[]): MdNode[] {
  let changed = false
  const next: Array<MdNode | MdNode[]> = nodes.map((node) => {
    if (node.type === 'text' && node.value != null && node.value !== '') {
      const parts = splitText(node.value, plugins)
      if (parts != null) {
        changed = true
        return parts
      }
    }
    if (node.children != null) {
      const children = mapInline(node.children, plugins)
      if (children !== node.children) {
        changed = true
        return { ...node, children }
      }
    }
    return node
  })

  if (!changed)
    return nodes

  return next.flat()
}

export function applyInlinePlugins(root: MdNode, plugins?: readonly MarkdownInlinePlugin[]): MdNode {
  if (plugins == null || plugins.length === 0 || root.children == null)
    return root

  const children = mapInline(root.children, plugins)
  if (children === root.children)
    return root

  return { ...root, children }
}
