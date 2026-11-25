import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Heading from './Heading.vue'

describe('heading', () => {
  it('renders the correct semantic element for the level', () => {
    const wrapper = mount(Heading, {
      props: { level: 2 },
      slots: { default: 'Section title' },
    })

    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.text()).toBe('Section title')
  })

  it('applies display type class', () => {
    const wrapper = mount(Heading, {
      props: { level: 1, type: 'display-1' },
      slots: { default: 'Hero' },
    })

    expect(wrapper.classes()).toContain('astryx-heading--type-display-1')
  })

  it('applies color and weight classes', () => {
    const wrapper = mount(Heading, {
      props: { level: 3, color: 'secondary', weight: 'bold' },
      slots: { default: 'Title' },
    })

    expect(wrapper.classes()).toContain('astryx-heading--color-secondary')
    expect(wrapper.classes()).toContain('astryx-heading--weight-bold')
  })

  it('truncates to a single line when maxLines is 1', () => {
    const wrapper = mount(Heading, {
      props: { level: 2, maxLines: 1 },
      slots: { default: 'Very long heading text' },
    })

    expect(wrapper.get('h2').classes()).toContain('astryx-heading--truncate-single')
    expect(wrapper.get('h2').element.parentElement?.tagName).not.toBe('SPAN')
  })

  it('keeps the visual level and exposes a different accessibility level', () => {
    const wrapper = mount(Heading, {
      props: {
        level: 2,
        accessibilityLevel: 3,
        textWrap: 'balance',
        wordBreak: 'break-word',
        justify: 'center',
        hasStrikethrough: true,
      },
      slots: { default: 'Section' },
    })

    const heading = wrapper.get('h2')
    expect(heading.attributes('aria-level')).toBe('3')
    expect(heading.classes()).toContain('astryx-heading--wrap-balance')
    expect(heading.classes()).toContain('astryx-heading--word-break-word')
    expect(heading.classes()).toContain('astryx-heading--justify-center')
    expect(heading.classes()).toContain('astryx-heading--strike')
  })

  it('trims the leading with hasCapsize and drops the inline display', () => {
    const capped = mount(Heading, { props: { level: 2, hasCapsize: true, display: 'inline' }, slots: { default: 'Title' } })
    expect(capped.classes()).toContain('astryx-heading--capsize')
    expect(capped.classes()).not.toContain('astryx-heading--inline')
    expect(capped.element.tagName).toBe('H2')
  })
})

describe('heading outline and caller precedence', () => {
  it('adds no aria-level when accessibilityLevel equals level', () => {
    const wrapper = mount(Heading, { props: { level: 3, accessibilityLevel: 3 }, slots: { default: 'Matching outline' } })
    expect(wrapper.element.tagName).toBe('H3')
    expect(wrapper.attributes('aria-level')).toBeUndefined()
  })

  it('lets a caller aria-level win over the derived one', () => {
    const wrapper = mount(Heading, {
      props: { level: 2, accessibilityLevel: 3 },
      attrs: { 'aria-level': '4' },
      slots: { default: 'Caller outline' },
    })
    expect(wrapper.attributes('aria-level')).toBe('4')
  })
})

describe('heading without a valid level', () => {
  function headingWarnings(warn: { mock: { calls: unknown[][] } }): string[] {
    return warn.mock.calls.map(call => String(call[0])).filter(message => message.startsWith('Heading:'))
  }

  it('renders an h2 at the level 2 scale and warns in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Heading, { props: {} as never, slots: { default: 'Overview' } })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('astryx-heading--level-2')
    expect(headingWarnings(warn)).toEqual([expect.stringContaining('level must be 1, 2, 3, 4, 5 or 6, but it is undefined.')])
    warn.mockRestore()
  })

  it('reads a level given as a numeric string, and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Heading, { props: { level: '3' } as never, slots: { default: 'Details' } })
    expect(wrapper.element.tagName).toBe('H3')
    expect(headingWarnings(warn)).toEqual([expect.stringContaining('but it is "3".')])
    warn.mockRestore()
  })

  it('does not warn for a valid level', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Heading, { props: { level: 4 }, slots: { default: 'Notes' } })
    expect(wrapper.element.tagName).toBe('H4')
    expect(headingWarnings(warn)).toEqual([])
    warn.mockRestore()
  })
})
