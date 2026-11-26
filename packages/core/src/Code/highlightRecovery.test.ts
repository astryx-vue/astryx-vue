import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyHighlightRanges, applyHighlightRangesFlat } from './highlightRanges.js'
import { tokenize } from './tokenizer.js'

const painted: Range[] = []

class FakeHighlight {
  add(range: Range): void { painted.push(range) }
  delete(range: Range): void {
    const index = painted.indexOf(range)
    if (index >= 0)
      painted.splice(index, 1)
  }
}

const flush = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0))

/** 模拟外层容器把内容整块移出再放回：节点没变，但其中的 Range 会被折叠。 */
function moveOutAndBack(node: Element): void {
  const parent = node.parentNode!
  const next = node.nextSibling
  parent.removeChild(node)
  parent.insertBefore(node, next)
}

describe('highlight recovery', () => {
  const css = globalThis.CSS

  beforeEach(() => {
    painted.length = 0
    vi.stubGlobal('Highlight', FakeHighlight)
    vi.stubGlobal('CSS', { highlights: new Map(), escape: (value: string) => value })
  })

  afterEach(() => {
    vi.stubGlobal('Highlight', undefined)
    vi.stubGlobal('CSS', css)
    document.body.innerHTML = ''
  })

  it('repaints flat ranges after an ancestor is moved out of the document and back', async () => {
    const wrapper = document.createElement('div')
    const code = document.createElement('code')
    code.textContent = 'const greeting = 1;'
    wrapper.appendChild(code)
    document.body.appendChild(wrapper)

    const cleanup = applyHighlightRangesFlat(code, tokenize(code.textContent, 'javascript'))
    expect(painted.map(range => range.toString())).toContain('const')

    moveOutAndBack(wrapper)
    await flush()

    expect(painted.some(range => range.collapsed)).toBe(false)
    expect(painted.map(range => range.toString())).toContain('const')

    cleanup()
    expect(painted).toHaveLength(0)
  })

  it('repaints per-line ranges after an ancestor is moved', async () => {
    const wrapper = document.createElement('div')
    const code = document.createElement('code')
    const line = document.createElement('span')
    line.setAttribute('data-line', '')
    line.textContent = 'const x = 1;'
    code.appendChild(line)
    wrapper.appendChild(code)
    document.body.appendChild(wrapper)

    const cleanup = applyHighlightRanges(code, tokenize('const x = 1;', 'javascript'))
    moveOutAndBack(wrapper)
    await flush()

    expect(painted.some(range => range.collapsed)).toBe(false)
    expect(painted.map(range => range.toString())).toContain('const')
    cleanup()
  })

  it('stops watching after cleanup', async () => {
    const code = document.createElement('code')
    code.textContent = 'const x = 1;'
    document.body.appendChild(code)

    const cleanup = applyHighlightRangesFlat(code, tokenize(code.textContent, 'javascript'))
    cleanup()
    moveOutAndBack(code)
    await flush()

    expect(painted).toHaveLength(0)
  })
})
