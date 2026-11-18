import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { useContainerReveal } from './useContainerReveal.js'

describe('useContainerReveal', () => {
  it('returns hover and focus reveal classes for the container and its content', () => {
    const reveal = useContainerReveal()
    expect(reveal.containerProps({ hoverDelay: 200, forceState: 'active' })).toMatchObject({
      class: {
        'astryx-reveal': true,
        'astryx-reveal--active': true,
      },
      style: { '--_hover-delay': '200ms' },
    })
    expect(reveal.contentProps({ isRevealInverted: true, isLayoutPreserved: true }).class).toMatchObject({
      'astryx-reveal__conceal': true,
      'astryx-reveal__conceal--preserve': true,
    })
  })

  it('adds no classes when the reveal is turned off', () => {
    const reveal = useContainerReveal({ isEnabled: () => false })
    expect(reveal.containerProps()).toEqual({})
    expect(reveal.contentProps()).toEqual({})
  })

  it('maps forceState and forceVisibility to classes, and omits the delay style when zero', () => {
    const reveal = useContainerReveal()
    expect(reveal.containerProps({ forceState: 'inactive' }).class).toMatchObject({
      'astryx-reveal--inactive': true,
      'astryx-reveal--active': false,
    })
    expect(reveal.containerProps({ hoverDelay: 0 }).style).toBeUndefined()
    expect(reveal.contentProps({ forceVisibility: 'hidden', isLayoutPreserved: true }).class).toMatchObject({
      'astryx-reveal__hidden': false,
      'astryx-reveal__hidden--preserve': true,
    })
    expect(reveal.contentProps({ forceVisibility: 'shown' }).class).toMatchObject({ 'astryx-reveal__shown': true })
  })

  it('keeps the stylesheet branches that mirror upstream (coarse pointer, hover gating, dwell, reduced motion)', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/container-reveal.css'), 'utf8')
    expect(css).toContain('@media (pointer: coarse)')
    expect(css).toContain('@media (hover: hover)')
    expect(css).toContain(':hover:where(:not(:disabled, [aria-disabled="true"]))')
    expect(css).toContain('var(--_hover-delay, 0s)')
    expect(css).toContain('--_reveal-delay-reduced')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).not.toContain('any-pointer')
  })
})
