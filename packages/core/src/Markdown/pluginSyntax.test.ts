import type { MdNode } from './ast.js'
import type { MarkdownExtensionNode, MarkdownSyntaxPluginDefinition } from './plugin-protocol/protocol.js'
import { describe, expect, it } from 'vitest'
import { createMarkdownPlugin } from './plugin-protocol/protocol.js'
import { parseMarkdownAst } from './publicParser.js'

type MentionNode = MarkdownExtensionNode<'mentions', 'mention', { readonly label: string }, 'inline'>

/** `@name` mentions, and `{{…}}` asides that hold whatever plain source. */
const mentionDefinition: MarkdownSyntaxPluginDefinition<'mentions', MentionNode> = {
  name: 'mentions',
  apiVersion: 1,
  parseKey: 'v1',
  syntax: {
    inline: [{
      startsWith: ['@{'],
      maxSpan: 80,
      tokenize({ source, offset, end }) {
        const close = source.indexOf('}', offset + 2)
        if (close < 0 || close >= end)
          return { status: 'no-match' }
        return {
          status: 'match',
          end: close + 1,
          node: {
            type: 'extension',
            plugin: 'mentions',
            name: 'mention',
            display: 'inline',
            data: { label: source.slice(offset + 2, close) },
          },
        }
      },
    }],
  },
  renderers: { mention: { render: () => null, toText: node => `@${node.data.label}` } },
}

const mentions = createMarkdownPlugin<'mentions', MentionNode>(mentionDefinition)

const asides = createMarkdownPlugin({
  name: 'asides',
  apiVersion: 1,
  parseKey: 'v1',
  syntax: {
    inline: [{
      startsWith: ['{{'],
      maxSpan: 200,
      tokenize({ source, offset, end }) {
        const close = source.indexOf('}}', offset + 2)
        if (close < 0 || close + 2 > end)
          return { status: 'no-match' }
        return {
          status: 'match',
          end: close + 2,
          node: {
            type: 'extension',
            plugin: 'asides',
            name: 'aside',
            display: 'inline',
            data: { text: source.slice(offset + 2, close) },
          },
        }
      },
    }],
  },
  renderers: { aside: { render: () => null, toText: () => '' } },
})

const plugins = [mentions, asides]

/** Every extension node, in document order. */
function extensions(markdown: string): Array<{ name: string, source: string | undefined }> {
  const found: Array<{ name: string, source: string | undefined }> = []
  const visit = (node: MdNode): void => {
    if (node.type === 'extension')
      found.push({ name: node.name ?? '', source: node.source })
    for (const child of node.children ?? []) visit(child)
  }
  const root = parseMarkdownAst(markdown, { plugins })
  ;(root.children as unknown as MdNode[] | undefined)?.forEach(visit)
  return found
}

/** The document as text, with each extension node shown as its source. */
function outline(markdown: string): string {
  const flat = (node: MdNode): string => {
    if (node.type === 'extension')
      return `[[${node.source ?? ''}]]`
    if (node.type === 'text' || node.type === 'inlineCode')
      return node.value ?? ''
    return (node.children ?? []).map(flat).join('')
  }
  return (parseMarkdownAst(markdown, { plugins }).children as unknown as MdNode[]).map(flat).join('')
}

describe('a tokenizer reads past the marks and links around its match', () => {
  it('matches one node whose source holds emphasis, a link, and a list marker', () => {
    const markdown = '{{see **this**, [that](https://example.com), and - this}} stays one node.\n'
    expect(extensions(markdown)).toEqual([{
      name: 'aside',
      source: '{{see **this**, [that](https://example.com), and - this}}',
    }])
  })

  it('reads no mark inside the matched source', () => {
    const root = JSON.parse(JSON.stringify(parseMarkdownAst('{{see **this**}}', { plugins }))) as MdNode
    expect(root.children?.[0]?.children?.map(node => node.type)).toEqual(['extension'])
  })

  it('still matches the nodes after a match that swallowed marks', () => {
    expect(outline('text {{a *b*}} and @{c}\n')).toBe('text [[{{a *b*}}]] and [[@{c}]]')
  })
})

describe('an escaped prefix starts no plugin syntax', () => {
  it('leaves `\\@{a}` as text and reads the next one as a node', () => {
    expect(outline('\\@{ada} then @{ada}.\n')).toBe('@{ada} then [[@{ada}]].')
  })

  it('keeps the escape in the text it stands beside', () => {
    expect(outline('a \\* b @{x}\n')).toBe('a * b [[@{x}]]')
  })
})

describe('link text, link destinations, images, and code hold no plugin syntax', () => {
  it.each([
    '[link @{inside}](https://example.com) after\n',
    '[x](https://example.com/@{inside}) after\n',
    '![img @{inside}](https://example.com/a.png)\n',
    '`@{inside}` after\n',
    '```\n@{inside}\n```\n',
  ])('reads no extension node in %j', (markdown) => {
    expect(extensions(markdown)).toEqual([])
  })

  it('still reads the nodes around them', () => {
    expect(extensions('`@{code}` then @{real} and `@{code}` again @{real}.\n')).toHaveLength(2)
  })
})
