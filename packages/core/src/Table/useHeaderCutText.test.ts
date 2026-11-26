import type { CutTextOnKeyboardFocusOptions } from '../Text/useCutTextOnKeyboardFocus.js'
import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useHeaderCutText } from './useHeaderCutText.js'

const captured: CutTextOnKeyboardFocusOptions[] = []

vi.mock('../Text/useCutTextOnKeyboardFocus.js', () => ({
  useCutTextOnKeyboardFocus: (options: CutTextOnKeyboardFocusOptions) => {
    captured.push(options)
    return { cutText: shallowRef(null), hide: () => {}, onFocusin: () => {}, onFocusout: () => {}, onPointerdown: () => {} }
  },
}))

function focusHeaderIn(overflow: 'wrap' | 'truncate'): boolean {
  document.body.innerHTML = `<table class="astryx-table" data-overflow="${overflow}"><thead><tr><th><button>Name</button></th></tr></thead></table>`
  const cut = useHeaderCutText()
  const options = captured.at(-1)!
  const button = document.querySelector('button')!
  cut.onFocusin({ target: button } as unknown as FocusEvent)
  return options.isEnabled()
}

describe('header cut-text tooltip', () => {
  it('shows only where headings truncate', () => {
    expect(focusHeaderIn('truncate')).toBe(true)
    expect(focusHeaderIn('wrap')).toBe(false)
  })
})
