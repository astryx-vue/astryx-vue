import { describe, expect, it } from 'vitest'
import { resolveNavHeadingMode } from './navHeadingMode.js'

describe('resolveNavHeadingMode', () => {
  it('keeps a logo-only heading as one link when it has an address', () => {
    expect(resolveNavHeadingMode({
      hasHeading: false,
      hasMenu: false,
      headingHref: '/',
    })).toBe('logo')
  })

  it('makes the whole heading one link when only the title has an address', () => {
    expect(resolveNavHeadingMode({
      hasHeading: true,
      hasMenu: false,
      headingHref: '/',
    })).toBe('whole-link')
  })

  it('makes the whole heading the menu trigger when nothing is a link', () => {
    expect(resolveNavHeadingMode({
      hasHeading: true,
      hasMenu: true,
    })).toBe('trigger')
  })

  it('keeps links and the chevron separate when both exist', () => {
    expect(resolveNavHeadingMode({
      hasHeading: true,
      hasMenu: true,
      headingHref: '/app',
      superheadingHref: '/suite',
    })).toBe('mixed')
  })

  it('renders independent links when there is no menu', () => {
    expect(resolveNavHeadingMode({
      hasHeading: true,
      hasMenu: false,
      headingHref: '/app',
      subheadingHref: '/account',
    })).toBe('links')
  })
})
