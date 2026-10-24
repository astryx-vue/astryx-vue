import type { MarkdownAstDataValue } from './canonicalAst.js'

export interface MdPoint {
  offset?: number | null
  line?: number
  column?: number
}

export interface MdPosition {
  start?: MdPoint
  end?: MdPoint
}

export interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
  depth?: 1 | 2 | 3 | 4 | 5 | 6
  ordered?: boolean
  start?: number | null
  spread?: boolean | null
  checked?: boolean | null
  lang?: string | null
  url?: string
  alt?: string | null
  title?: string | null
  align?: Array<'left' | 'right' | 'center' | null> | null
  identifier?: string
  label?: string | null
  /** Parser offsets. Used to tell a bare autolink from an explicit link. */
  position?: MdPosition
  /**
   * Set on `type: 'extension'` nodes a plugin inserts.
   * `plugin` matches `MarkdownPlugin.name` or `MarkdownInlinePlugin.name`.
   */
  plugin?: string
  /** Name of an extension node within its plugin. */
  name?: string
  /** `block` extension nodes are rendered as their own block. */
  display?: 'inline' | 'block'
  /** Matched source text on an extension node. */
  source?: string
  /** Citation id, set when a parser turns `[id]` into a citation node. */
  sourceId?: string
  /**
   * Extra fields a plugin wants the renderer to read.
   * Nested objects and arrays are allowed so document metadata can live here.
   */
  data?: MarkdownAstDataValue
}

export function isMarkdownExtensionNode(
  node: MdNode,
  plugin?: string,
  name?: string,
): node is MdNode & { type: 'extension', plugin: string, name: string } {
  if (node.type !== 'extension' || node.plugin == null || node.name == null)
    return false
  if (plugin != null && node.plugin !== plugin)
    return false
  if (name != null && node.name !== name)
    return false
  return true
}

export function plainText(node: MdNode): string {
  if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code' || node.type === 'html')
    return node.value ?? ''
  if (node.type === 'image' || node.type === 'imageReference')
    return node.alt ?? node.label ?? ''
  if (node.type === 'footnoteReference')
    return node.label ?? node.identifier ?? ''
  if (node.type === 'break')
    return '\n'
  return (node.children ?? []).map(child => plainText(child)).join('')
}
