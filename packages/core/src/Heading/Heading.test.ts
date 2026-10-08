import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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

    expect(wrapper.classes()).toContain('astryx-heading--truncate-single')
  })
})
