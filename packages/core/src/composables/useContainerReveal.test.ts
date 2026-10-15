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
})
