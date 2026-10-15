import type { MdNode } from './ast.js'
import { describe, expect, it } from 'vitest'
import { findSettledEnd, hasOpenFence } from './blocks.js'
import { createIncrementalMarkdownState, parseMarkdown, parseMarkdownIncremental } from './parse.js'
import { trimStreamingTail } from './trim.js'

function signature(node: MdNode): string {
  const bits = [node.type]
  if (node.depth != null)
    bits.push(`d${node.depth}`)
  if (node.ordered != null)
    bits.push(node.ordered ? 'ol' : 'ul')
  if (node.start != null)
    bits.push(`s${node.start}`)
  if (node.checked != null)
    bits.push(node.checked ? 'x' : 'o')
  if (node.lang != null)
    bits.push(node.lang)
  if (node.url != null)
    bits.push(node.url)
  if (node.alt != null)
    bits.push(node.alt)
  if (node.identifier != null)
    bits.push(node.identifier)
  if (node.align != null)
    bits.push(node.align.map(item => item ?? '-').join(','))
  if (node.value != null)
    bits.push(JSON.stringify(node.value))
  const children = (node.children ?? []).map(child => signature(child)).join('')
  return `(${bits.join(' ')}${children})`
}

function documentSignature(source: string): string {
  return (parseMarkdown(source).children ?? []).map(node => signature(node)).join('|')
}

const fixture = [
  '# Title',
  '',
  'Hello **world** and ~~old~~.',
  '',
  '- a',
  '',
  '- b',
  '',
  '> quote',
  '',
  '```ts',
  'const a = 1',
  '```',
  '',
  '| A | B |',
  '| --- | ---: |',
  '| 1 | 2 |',
  '',
  'https://example.com',
  '',
  '---',
  '',
  '3. third',
  '',
  '- [x] done',
  '- [ ] open',
  '',
].join('\n')

describe('markdown parsing', () => {
  it('settles only closed top-level blocks', () => {
    expect(findSettledEnd('# Hello')).toBe(0)
    expect(findSettledEnd('# Hello\n')).toBe('# Hello\n'.length)
    expect(findSettledEnd('```ts\nconst a = 1')).toBe(0)
    expect(hasOpenFence('```ts\nconst a = 1')).toBe(true)

    const closed = '```ts\nconst a = 1\n```\n'
    expect(findSettledEnd(closed)).toBe(closed.length)
    expect(hasOpenFence(closed)).toBe(false)
    expect(findSettledEnd('- a\n\n-')).toBe(0)
  })

  it('keeps the settled boundary monotonic and matches a full parse', () => {
    let seen = 0
    let built = ''
    for (const char of fixture) {
      built += char
      const next = findSettledEnd(built)
      expect(next).toBeGreaterThanOrEqual(seen)
      expect(next).toBeLessThanOrEqual(built.length)
      seen = next
    }

    const state = createIncrementalMarkdownState()
    let prefix = ''
    for (const char of fixture) {
      prefix += char
      const incremental = parseMarkdownIncremental(prefix, state)
      const rendered = incremental.blocks.map(node => signature(node)).join('|')
      expect(rendered).toBe(documentSignature(prefix))
      expect(incremental.blocks.slice(0, incremental.settledCount).every(node => state.blocks.includes(node))).toBe(true)
    }
  })

  it('reuses settled block objects when text is only appended', () => {
    const state = createIncrementalMarkdownState()
    const first = parseMarkdownIncremental('# Hello\n\n', state)
    const heading = first.blocks[0]
    const second = parseMarkdownIncremental('# Hello\n\nWorld', state)
    expect(heading?.type).toBe('heading')
    expect(second.blocks[0]).toBe(heading)
    expect(second.settledCount).toBe(1)
    expect(second.blocks).toHaveLength(2)
  })

  it('does not split a loose list that is still open', () => {
    const state = createIncrementalMarkdownState()
    const parsed = parseMarkdownIncremental('- a\n\n- b\n', state)
    expect(parsed.blocks.filter(node => node.type === 'list')).toHaveLength(1)
    expect(documentSignature('- a\n\n- b\n')).toBe(parsed.blocks.map(node => signature(node)).join('|'))
  })

  it('keeps bare urls as text unless autolink is gfm', () => {
    const bare = parseMarkdown('See https://example.com/docs.')
    expect(bare.children?.[0]?.children?.[0]).toMatchObject({
      type: 'text',
      value: 'See https://example.com/docs.',
    })

    const linked = parseMarkdown('See https://example.com/docs.', { autolink: 'gfm' })
    expect(linked.children?.[0]?.children?.some(node => node.type === 'link' && node.url === 'https://example.com/docs')).toBe(true)

    const angle = parseMarkdown('See <https://example.com/angle>.')
    expect(angle.children?.[0]?.children?.some(node => node.type === 'link' && node.url === 'https://example.com/angle')).toBe(true)
  })

  it('leaves html disabled so tags stay text', () => {
    const root = parseMarkdown('<script>alert(1)</script>')
    expect(root.children?.[0]?.children?.[0]).toMatchObject({
      type: 'text',
      value: '<script>alert(1)</script>',
    })
  })
})

describe('streaming tail trim', () => {
  it('closes or drops unfinished markers and leaves an open fence alone', () => {
    expect(trimStreamingTail('')).toBe('')
    expect(trimStreamingTail('```ts\nconst a = 1')).toBe('```ts\nconst a = 1')
    expect(trimStreamingTail('**bold')).toBe('**bold**')
    expect(trimStreamingTail('hello **')).toBe('hello ')
    expect(trimStreamingTail('`code')).toBe('`code`')
    expect(trimStreamingTail('~~gone')).toBe('~~gone~~')
    expect(trimStreamingTail('**bold**')).toBe('**bold**')
    expect(trimStreamingTail('see [docs](https://example.com/a')).toBe('see ')
    expect(trimStreamingTail('see [docs](https://example.com)')).toBe('see [docs](https://example.com)')
  })
})
