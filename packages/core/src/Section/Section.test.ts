import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Section from './Section.vue'

describe('section', () => {
  it('escapes the parent padding and paints the surface variant', () => {
    const wrapper = mount(Section, {
      slots: { default: 'Account' },
    })

    expect(wrapper.classes()).toContain('astryx-section')
    const inner = wrapper.get('.astryx-section__inner')
    expect(inner.attributes('data-variant')).toBe('section')
    expect(inner.text()).toBe('Account')
    expect(wrapper.element.style.marginInlineStart).toBe('')
  })

  it('applies a muted wash, explicit padding, and dividers', () => {
    const wrapper = mount(Section, {
      props: { variant: 'muted', padding: 6, dividers: ['bottom', 'start'] },
      slots: { default: 'Price' },
    })

    const inner = wrapper.get('.astryx-section__inner')
    expect(inner.attributes('data-variant')).toBe('muted')
    expect(inner.attributes('data-divider-bottom')).toBe('true')
    expect(inner.attributes('data-divider-start')).toBe('true')
    expect(inner.attributes('data-divider-top')).toBeUndefined()
    expect(inner.element.style.getPropertyValue('--_section-inline-start')).toContain('--astryx-spacing-6')
    expect(inner.element.style.getPropertyValue('--_section-block-end')).toContain('--astryx-spacing-6')
  })

  it('lets one edge override the shared padding', () => {
    const wrapper = mount(Section, {
      props: { padding: 5, paddingInlineStart: 1 },
    })

    const inner = wrapper.get('.astryx-section__inner').element as HTMLElement
    expect(inner.style.getPropertyValue('--_section-inline-start')).toContain('--astryx-spacing-1')
    expect(inner.style.getPropertyValue('--_section-inline-end')).toContain('--astryx-spacing-5')
    expect(inner.style.getPropertyValue('--_section-block-start')).toContain('--astryx-spacing-5')
  })

  it('treats numeric sizes as pixels', () => {
    const wrapper = mount(Section, {
      props: { width: 320, minHeight: 80, maxWidth: '40rem' },
    })

    expect(wrapper.element.style.width).toBe('320px')
    expect(wrapper.element.style.minHeight).toBe('80px')
    expect(wrapper.element.style.maxWidth).toBe('40rem')
  })
})
