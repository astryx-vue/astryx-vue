import type { MdNode } from './ast.js'
import { describe, expect, it } from 'vitest'
import { parseInlineAst, parseMarkdownAst } from './publicParser.js'

/** `type:text` for every block, its value or its children's text. */
function blocks(markdown: string): string[] {
  const text = (node: MdNode): string =>
    node.value ?? (node.children ?? []).map(text).join('')
  return (parseMarkdownAst(markdown).children as unknown as MdNode[])
    .map(node => `${node.type}:${text(node)}`)
}

describe('a line indented four columns is no block start', () => {
  it.each([
    ['    # h', 'paragraph:    # h'],
    ['    > a', 'paragraph:    > a'],
    ['    text', 'paragraph:    text'],
    ['para\n    cont', 'paragraph:para\n    cont'],
  ])('reads %j as text', (markdown, expected) => {
    expect(blocks(markdown)).toEqual([expected])
  })

  it('reads an indented fence as an inline code span', () => {
    const [only] = parseMarkdownAst('    ```\n    x\n    ```').children as unknown as MdNode[]
    expect(only?.type).toBe('paragraph')
    expect(only?.children?.map(node => node.type)).toEqual(['text', 'inlineCode'])
    expect(only?.children?.[0]?.value).toBe('    ')
    expect(only?.children?.[1]?.value).toBe('\n    x\n    ')
  })

  it.each([
    ['    - a', 'list:a'],
    ['    * a', 'list:a'],
    ['    ---', 'thematicBreak:'],
    ['\t| a | b |\n\t| - | - |\n\t| 1 | 2 |', 'table:ab12'],
  ])('still reads %j as the block it is', (markdown, expected) => {
    expect(blocks(markdown)).toEqual([expected])
  })

  it('never reads indented code, however deep the indentation', () => {
    expect(blocks('        deep')).toEqual(['paragraph:        deep'])
  })
})

describe('the inline entry reads no block syntax at all', () => {
  it.each(['# h', '> q', '- b', '| a | b |\n| - | - |', 'a\n\nb'])(
    'reads %j as text',
    (markdown) => {
      expect(parseInlineAst(markdown)).toMatchObject([{ type: 'text', value: markdown }])
    },
  )

  it('reads a fence as a code span', () => {
    const nodes = parseInlineAst('```\n    x\n    ```')
    expect(nodes.map(node => node.type)).toEqual(['inlineCode'])
  })

  it('reads marks and breaks inline', () => {
    expect(parseInlineAst('**bold** and *it*')).toMatchObject([
      { type: 'strong' },
      { type: 'text' },
      { type: 'emphasis' },
    ])
    expect(parseInlineAst('a  \nb').map(node => node.type)).toEqual(['text', 'break', 'text'])
  })
})

describe('a task item holding nothing but its checkbox', () => {
  it('stays checked, as upstream reads it', () => {
    const root = parseMarkdownAst('- [x] \n- [ ] b\n') as unknown as MdNode
    const list = root.children?.[0]
    expect(list?.type).toBe('list')
    expect(list?.children?.map(item => item.checked)).toEqual([true, false])
    expect(list?.children?.[0]?.children).toEqual([])
  })

  it('reads an unchecked empty item too', () => {
    const root = parseMarkdownAst('- [ ] \n') as unknown as MdNode
    expect(root.children?.[0]?.children?.[0]?.checked).toBe(false)
  })

  it('leaves a checkbox without a space after it as text', () => {
    const root = parseMarkdownAst('- [ ]no space\n') as unknown as MdNode
    expect(root.children?.[0]?.children?.[0]?.checked ?? null).toBeNull()
  })
})
