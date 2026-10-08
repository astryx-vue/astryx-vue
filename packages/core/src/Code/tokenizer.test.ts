import { describe, expect, it, vi } from 'vitest'
import { applyHighlightRanges } from './highlightRanges.js'
import { flatTokensToLines, SYNC_TOKENIZE_THRESHOLD, tokenize, tokenizeAsync } from './tokenizer.js'

describe('tokenize', () => {
  it('returns line-relative tokens for a known language', () => {
    const lines = tokenize('const x = 1;\nconst y = 2;', 'typescript')

    expect(lines).toHaveLength(2)
    expect(lines[0][0]).toMatchObject({ type: 'keyword', start: 0, end: 5 })
    expect(lines[1][0]).toMatchObject({ type: 'keyword', start: 0, end: 5 })
  })

  it('returns nothing for an unknown language', () => {
    expect(tokenize('const x = 1;', 'not-a-language')).toEqual([])
  })

  it('marks strings, numbers, and comments', () => {
    const [line] = tokenize('const name = "astryx"; // inline', 'javascript')

    expect(line).toContainEqual({ type: 'keyword', start: 0, end: 5 })
    expect(line).toContainEqual({ type: 'string', start: 13, end: 21 })
    expect(line).toContainEqual({ type: 'comment', start: 23, end: 32 })
  })

  it('tokenizes asynchronously to the same result', async () => {
    const code = 'def run():\n    return 1'
    const sync = tokenize(code, 'python')
    const async = await tokenizeAsync(code, 'python')

    expect(async).toEqual(sync)
  })

  it('stops early when the signal is already aborted', async () => {
    const code = `${'x = 1\n'.repeat(400)}`
    const controller = new AbortController()
    controller.abort()

    const lines = await tokenizeAsync(code, 'python', controller.signal)

    expect(code.length).toBeGreaterThan(SYNC_TOKENIZE_THRESHOLD)
    expect(lines.length).toBeLessThan(400)
  })

  it('converts flat absolute tokens into line-relative ones', () => {
    const code = 'ab\ncd'
    const lines = flatTokensToLines([{ type: 'tag', start: 3, end: 5 }], code)

    expect(lines).toEqual([[], [{ type: 'tag', start: 0, end: 2 }]])
  })
})

describe('applyHighlightRanges', () => {
  it('leaves the code text untouched when the highlight API is missing', () => {
    const code = document.createElement('code')
    const line = document.createElement('div')
    line.setAttribute('data-line', '1')
    line.textContent = 'const x = 1;'
    code.appendChild(line)

    const cleanup = applyHighlightRanges(code, tokenize('const x = 1;', 'javascript'))

    expect(code.textContent).toBe('const x = 1;')
    expect(() => cleanup()).not.toThrow()
  })

  it('registers a range on the line text node, including past empty sibling nodes', () => {
    const added: object[] = []
    class FakeHighlight {
      delete(range: object): void {
        const index = added.indexOf(range)
        if (index >= 0)
          added.splice(index, 1)
      }

      add(range: object): void {
        added.push(range)
      }
    }

    const highlights = new Map<string, unknown>()
    const css = globalThis.CSS

    vi.stubGlobal('Highlight', FakeHighlight)
    vi.stubGlobal('CSS', { highlights, escape: (value: string) => value })

    try {
      const code = document.createElement('code')
      const line = document.createElement('div')
      line.setAttribute('data-line', '1')
      line.appendChild(document.createTextNode(''))
      line.appendChild(document.createTextNode('const x = 1;'))
      line.appendChild(document.createTextNode(''))
      code.appendChild(line)

      const cleanup = applyHighlightRanges(code, tokenize('const x = 1;', 'javascript'))

      const keyword = highlights.get('astryx-keyword') as FakeHighlight
      expect(keyword).toBeInstanceOf(FakeHighlight)
      expect(added).toHaveLength(4)
      const [range] = added as Range[]
      expect(range.toString()).toBe('const')

      cleanup()
      expect(added).toHaveLength(0)
    }
    finally {
      vi.stubGlobal('Highlight', undefined)
      vi.stubGlobal('CSS', css)
    }
  })
})
