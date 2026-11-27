import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyHighlightRangesFlat } from './highlightRanges.js'

class FakeHighlight {
  add(): void {}
  delete(): void {}
}

describe('a custom token type\'s highlight rule', () => {
  const css = globalThis.CSS

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.stubGlobal('CSS', css)
    document.head.querySelectorAll('[data-astryx-code-token-styles]').forEach(node => node.remove())
    document.body.innerHTML = ''
  })

  it('is added inside the astryx.components layer so theme and app syntax colors win', () => {
    vi.stubGlobal('Highlight', FakeHighlight)
    vi.stubGlobal('CSS', { highlights: new Map(), escape: (value: string) => value })
    const insertRule = vi.spyOn(CSSStyleSheet.prototype, 'insertRule').mockImplementation(() => 0)
    const code = document.createElement('code')
    code.textContent = 'line'
    document.body.appendChild(code)

    const cleanup = applyHighlightRangesFlat(code, [[{ type: 'layered-type', start: 0, end: 4 }]])

    expect(insertRule).toHaveBeenCalledWith(
      '@layer astryx.components { .astryx-code-block code::highlight(astryx-layered-type) { color: var(--astryx-code-syntax-layered-type, currentColor); } }',
    )
    cleanup()
  })
})
