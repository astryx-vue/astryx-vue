import type { VNode } from 'vue'
import type { MdNode } from './ast.js'
import { plainText } from './ast.js'
import { slugify, uniqueSlug } from './slug.js'

export function measureNode(node: MdNode): number {
  switch (node.type) {
    case 'text':
    case 'inlineCode':
    case 'code':
    case 'html':
      return node.value?.length ?? 0
    case 'image':
    case 'imageReference':
      return (node.alt ?? node.label ?? '').length
    case 'break':
      return 1
    case 'footnoteReference':
      return (node.label ?? node.identifier ?? '').length
    case 'definition':
    case 'thematicBreak':
      return 0
    default:
      return (node.children ?? []).reduce((sum, child) => sum + measureNode(child), 0)
  }
}

export function assignHeadingSlugs(nodes: MdNode[]): Map<MdNode, string> {
  const counts = new Map<string, number>()
  const slugs = new Map<MdNode, string>()
  const visit = (list: MdNode[]): void => {
    for (const node of list) {
      if (node.type === 'heading')
        slugs.set(node, uniqueSlug(slugify(plainText(node)), counts))
      if (node.children != null)
        visit(node.children)
    }
  }
  visit(nodes)
  return slugs
}

export function collectDefinitions(nodes: MdNode[]): Map<string, { url: string, title?: string | null }> {
  const definitions = new Map<string, { url: string, title?: string | null }>()
  const visit = (list: MdNode[]): void => {
    for (const node of list) {
      if (node.type === 'definition' && node.identifier != null && node.url != null)
        definitions.set(node.identifier, { url: node.url, title: node.title })
      if (node.children != null)
        visit(node.children)
    }
  }
  visit(nodes)
  return definitions
}

export function slotText(nodes: VNode[] | undefined): string {
  if (nodes == null)
    return ''
  return nodes.map((node) => {
    if (typeof node.children === 'string')
      return node.children
    return ''
  }).join('')
}
