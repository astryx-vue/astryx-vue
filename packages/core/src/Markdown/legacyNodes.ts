import type { MdNode } from './ast.js'
import type { MarkdownExtensionNode } from './plugin-protocol/protocol.js'

export interface SourceRange { readonly start: number, readonly end: number }

export type InlineNode<Extension extends MarkdownExtensionNode = never>
  = | { type: 'text', content: string }
    | { type: 'bold', children: InlineNode<Extension>[] }
    | { type: 'italic', children: InlineNode<Extension>[] }
    | { type: 'strikethrough', children: InlineNode<Extension>[] }
    | { type: 'code', content: string }
    | { type: 'link', href: string, children: InlineNode<Extension>[] }
    | { type: 'image', src: string, alt: string }
    | { type: 'citation', sourceId: string }
    | { type: 'break' }
    | Extract<Extension, { display: 'inline' }>

export interface MathInlineNode { type: 'math', value: string }

export type InlineNodeWithMath<Extension extends MarkdownExtensionNode = never>
  = | Exclude<InlineNode<Extension>, Extract<Extension, { display: 'inline' }>>
    | MathInlineNode
    | Extract<Extension, { display: 'inline' }>

export type TableAlignment = 'left' | 'center' | 'right' | null

export interface ListItemNode<Extension extends MarkdownExtensionNode = never> {
  checked?: boolean
  children: BlockNode<Extension>[]
}

export interface TableCellNode<Extension extends MarkdownExtensionNode = never> {
  children: InlineNode<Extension>[]
}

interface BlockMetadata { range?: SourceRange }

export type BlockNode<Extension extends MarkdownExtensionNode = never> = (
  | { type: 'heading', level: 1 | 2 | 3 | 4 | 5 | 6, children: InlineNode<Extension>[] }
  | { type: 'paragraph', children: InlineNode<Extension>[] }
  | { type: 'codeblock', language: string, content: string }
  | { type: 'blockquote', children: BlockNode<Extension>[] }
  | {
    type: 'list'
    ordered: boolean
    start?: number
    delimiter?: '.' | ')'
    loose?: boolean
    items: ListItemNode<Extension>[]
  }
  | {
    type: 'table'
    headers: TableCellNode<Extension>[]
    alignments: TableAlignment[]
    rows: TableCellNode<Extension>[][]
  }
  | { type: 'hr' }
  | { type: 'image', src: string, alt: string }
  | Extract<Extension, { display: 'block' }>
) & BlockMetadata

export type MathBlockNode = { type: 'math', value: string } & BlockMetadata

export type BlockNodeWithMath<Extension extends MarkdownExtensionNode = never>
  = | BlockNode<Extension>
    | MathBlockNode

function rangeOf(node: MdNode, withRange: boolean): BlockMetadata {
  if (!withRange)
    return {}
  const start = node.position?.start?.offset
  const end = node.position?.end?.offset
  if (start == null || end == null)
    return {}
  return { range: { start, end } }
}

export function projectInline(node: MdNode): InlineNode {
  switch (node.type) {
    case 'text':
    case 'html':
      return { type: 'text', content: node.value ?? '' }
    case 'strong':
      return { type: 'bold', children: (node.children ?? []).map(projectInline) }
    case 'emphasis':
      return { type: 'italic', children: (node.children ?? []).map(projectInline) }
    case 'delete':
      return { type: 'strikethrough', children: (node.children ?? []).map(projectInline) }
    case 'inlineCode':
      return { type: 'code', content: node.value ?? '' }
    case 'break':
      return { type: 'break' }
    case 'link':
    case 'linkReference':
      return {
        type: 'link',
        href: node.url ?? '',
        children: (node.children ?? []).map(projectInline),
      }
    case 'image':
    case 'imageReference':
      return { type: 'image', src: node.url ?? '', alt: node.alt ?? node.label ?? '' }
    case 'citation':
      return { type: 'citation', sourceId: node.sourceId ?? '' }
    case 'extension':
      return node as InlineNode
    default:
      return { type: 'text', content: node.value ?? '' }
  }
}

export function projectBlock(node: MdNode, withRange: boolean): BlockNode {
  const range = rangeOf(node, withRange)
  switch (node.type) {
    case 'heading':
      return {
        ...range,
        type: 'heading',
        level: node.depth ?? 1,
        children: (node.children ?? []).map(projectInline),
      }
    case 'paragraph':
      return {
        ...range,
        type: 'paragraph',
        children: (node.children ?? []).map(projectInline),
      }
    case 'code':
      return {
        ...range,
        type: 'codeblock',
        language: node.lang ?? '',
        content: node.value ?? '',
      }
    case 'blockquote':
      return {
        ...range,
        type: 'blockquote',
        children: (node.children ?? []).map(child => projectBlock(child, false)),
      }
    case 'list':
      return {
        ...range,
        type: 'list',
        ordered: node.ordered === true,
        start: node.start ?? undefined,
        loose: node.spread === true ? true : undefined,
        items: (node.children ?? []).map(item => ({
          checked: item.checked ?? undefined,
          children: (item.children ?? []).map(child => projectBlock(child, false)),
        })),
      }
    case 'table': {
      const rows = node.children ?? []
      const header = rows[0]
      const alignments = (node.align ?? []) as TableAlignment[]
      const cell = (entry: MdNode): TableCellNode => ({
        children: (entry.children ?? []).map(projectInline),
      })
      return {
        ...range,
        type: 'table',
        headers: (header?.children ?? []).map(cell),
        alignments,
        rows: rows.slice(1).map(row => (row.children ?? []).map(cell)),
      }
    }
    case 'thematicBreak':
      return { ...range, type: 'hr' }
    case 'image':
      return { ...range, type: 'image', src: node.url ?? '', alt: node.alt ?? '' }
    case 'extension':
      return { ...(node as BlockNode), ...range }
    default:
      return {
        ...range,
        type: 'paragraph',
        children: (node.children ?? []).map(projectInline),
      }
  }
}

export function projectBlocks(nodes: readonly MdNode[], withRange: boolean): BlockNode[] {
  return nodes.map(node => projectBlock(node, withRange))
}
