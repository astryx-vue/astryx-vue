import { afterEach, describe, expect, it, vi } from 'vitest'
import { FOCUSABLE_SELECTOR } from '../../layer/focus'
import { focusForLastInputTemporarily, releaseTemporaryFocus } from './focusReturn'

describe('temporary programmatic focus', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  function block(): HTMLDivElement {
    const target = document.createElement('div')
    document.body.append(target)
    return target
  }

  it('uses the shared focusable selector before acquiring a temporary tab stop', () => {
    const target = block()
    const matches = vi.spyOn(target, 'matches')
    const dispose = focusForLastInputTemporarily(target)
    expect(matches).toHaveBeenCalledWith(FOCUSABLE_SELECTOR)
    expect(target.getAttribute('tabindex')).toBe('-1')
    dispose()
    expect(target.hasAttribute('tabindex')).toBe(false)
  })

  it('passes options and modality through and releases its attribute and listener on dispose', () => {
    const target = block()
    const focus = vi.spyOn(target, 'focus')
    const remove = vi.spyOn(target, 'removeEventListener')
    const dispose = focusForLastInputTemporarily(target, { preventScroll: true }, 'pointer')
    expect(document.activeElement).toBe(target)
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true, focusVisible: false })
    expect(target.getAttribute('tabindex')).toBe('-1')
    dispose()
    dispose()
    expect(target.hasAttribute('tabindex')).toBe(false)
    expect(remove).toHaveBeenCalledTimes(1)
  })

  it('gives the focus stop up as soon as focus leaves', () => {
    const target = block()
    const other = document.createElement('button')
    document.body.append(other)
    focusForLastInputTemporarily(target)
    expect(target.getAttribute('tabindex')).toBe('-1')
    other.focus()
    expect(target.hasAttribute('tabindex')).toBe(false)
  })

  it.each(['button', 'input', 'textarea', 'select'])('preserves native %s focusability', (tag) => {
    const target = document.createElement(tag)
    document.body.append(target)
    const dispose = focusForLastInputTemporarily(target)
    expect(document.activeElement).toBe(target)
    expect(target.hasAttribute('tabindex')).toBe(false)
    dispose()
    expect(target.hasAttribute('tabindex')).toBe(false)
  })

  it.each(['-1', '0', '3'])('preserves authored tabindex %s', (value) => {
    const target = block()
    target.setAttribute('tabindex', value)
    const dispose = focusForLastInputTemporarily(target)
    expect(document.activeElement).toBe(target)
    target.blur()
    dispose()
    releaseTemporaryFocus(target)
    expect(target.getAttribute('tabindex')).toBe(value)
  })

  it('keeps later authored changes and lets a newer focus owner survive old cleanup', () => {
    const target = block()
    const first = focusForLastInputTemporarily(target)
    const second = focusForLastInputTemporarily(target, { preventScroll: true }, 'pointer')
    first()
    expect(document.activeElement).toBe(target)
    expect(target.getAttribute('tabindex')).toBe('-1')
    target.setAttribute('tabindex', '2')
    second()
    expect(target.getAttribute('tabindex')).toBe('2')
  })

  it('explicitly releases ownership after removal and can refocus with keyboard options', () => {
    const target = block()
    const focus = vi.spyOn(target, 'focus')
    focusForLastInputTemporarily(target, { preventScroll: true }, 'keyboard')
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true })
    target.remove()
    releaseTemporaryFocus(target)
    expect(target.hasAttribute('tabindex')).toBe(false)
    document.body.append(target)
    const dispose = focusForLastInputTemporarily(target)
    expect(document.activeElement).toBe(target)
    dispose()
  })

  it('cleans a target that cannot take focus, and an explicit release is idempotent', () => {
    const target = document.createElement('div')
    const dispose = focusForLastInputTemporarily(target)
    expect(target.hasAttribute('tabindex')).toBe(false)
    releaseTemporaryFocus(target)
    dispose()
    expect(target.hasAttribute('tabindex')).toBe(false)
  })
})
