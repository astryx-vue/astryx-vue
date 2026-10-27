import type { MdNode } from './ast.js'

/** A list item whose whole content is one task checkbox, `[x]` or `[ ]`. */
const EMPTY_CHECK = /^\[([ x])\][ \t]*$/i

/**
 * GFM reads `- [x] done` as a checked item, but drops the checkbox when the
 * item holds nothing else, leaving `[x]` as text. Upstream keeps the item
 * checked and empty, so mark it here and drop the placeholder paragraph.
 */
export function markEmptyTaskItems(root: MdNode): MdNode {
  const visit = (node: MdNode): MdNode => {
    const children = node.children?.map(visit)
    const checked = node.type === 'listItem' && node.checked == null ? emptyCheck(children) : null
    if (checked == null && (children == null || children.every((child, index) => child === node.children?.[index])))
      return node
    const next: MdNode = { ...node, ...(children == null ? {} : { children }) }
    if (checked == null)
      return next
    next.checked = checked
    next.children = (next.children ?? []).slice(1)
    return next
  }
  return visit(root)
}

function emptyCheck(children: MdNode[] | undefined): boolean | null {
  const first = children?.[0]
  if (first?.type !== 'paragraph')
    return null
  const text = first.children?.[0]
  if (text?.type !== 'text' || first.children?.length !== 1)
    return null
  const match = EMPTY_CHECK.exec(text.value ?? '')
  return match == null ? null : match[1] !== ' '
}
