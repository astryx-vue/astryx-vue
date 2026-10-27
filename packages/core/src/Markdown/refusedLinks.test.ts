import type { MdNode } from './ast.js'
import { describe, expect, it } from 'vitest'
import { parseMarkdown } from './parse.js'
import { parseInlineAst } from './publicParser.js'

/** `type:text` for every node in the tree, in document order. */
function outline(nodes: readonly MdNode[]): string[] {
  const out: string[] = []
  const visit = (node: MdNode): void => {
    const text = node.value ?? ''
    out.push(`${node.type}:${text}`)
    for (const child of node.children ?? []) visit(child)
  }
  for (const node of nodes) visit(node)
  return out
}

function blocks(markdown: string): string[] {
  return [parseMarkdown(markdown).type, ...outline(parseMarkdown(markdown).children ?? [])]
}

describe('unsafe destinations are read as text, not as links', () => {
  it.each([
    '[x](javascript:alert(1))',
    '[x](<data: text/html,hi>)',
    '[x](JavaScript:a b)',
    '[x](vbscript:msgbox(1))',
    '[x](<javascript:x \\<y>)',
    '[x](<data: text/html \\<b\\>>)',
    '<javascript:alert(1)>',
  ])('reads %j as one text node', (markdown) => {
    expect(outline(parseMarkdown(markdown).children ?? [])).toEqual([`paragraph:`, `text:${markdown}`])
  })

  it('refuses an unsafe image source too', () => {
    expect(blocks('![a](javascript:alert(1))')).toEqual([
      'root',
      'paragraph:',
      'text:![a](javascript:alert(1))',
    ])
  })

  it('leaves the markup inside a refused link as plain text', () => {
    const markdown = 'See [`x`](javascript:y) now'
    expect(outline(parseMarkdown(markdown).children ?? [])).toEqual([
      'paragraph:',
      `text:${markdown}`,
    ])
  })

  it('refuses on the inline entry as well', () => {
    const nodes = parseInlineAst('a [x](javascript:y) b')
    expect(nodes.map(node => node.type)).toEqual(['text'])
    expect(nodes.map(node => (node.type === 'text' ? node.value : '')).join('')).toBe('a [x](javascript:y) b')
  })

  it('still links a safe destination, whatever its scheme', () => {
    expect(blocks('[safe](https://example.com)')).toEqual([
      'root',
      'paragraph:',
      'link:',
      'text:safe',
    ])
    expect(blocks('[mail](mailto:a@b.c)')).toEqual([
      'root',
      'paragraph:',
      'link:',
      'text:mail',
    ])
    expect(blocks('![a](data:image/png;base64,aa)')).toEqual([
      'root',
      'paragraph:',
      'image:',
    ])
  })
})
