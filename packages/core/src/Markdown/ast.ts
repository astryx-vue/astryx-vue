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
