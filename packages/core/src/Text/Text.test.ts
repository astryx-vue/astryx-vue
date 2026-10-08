import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Text from './Text.vue'

describe('text', () => {
  it('renders a span by default', () => {
    const wrapper = mount(Text, {
      slots: { default: 'Body text' },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('Body text')
  })

  it('renders the requested element via as prop', () => {
    const wrapper = mount(Text, {
      props: { as: 'p' },
      slots: { default: 'Paragraph' },
    })

    expect(wrapper.element.tagName).toBe('P')
  })

  it('applies type and size classes', () => {
    const wrapper = mount(Text, {
      props: { type: 'supporting', size: 'sm' },
      slots: { default: 'Hint' },
    })

    expect(wrapper.classes()).toContain('astryx-text--type-supporting')
    expect(wrapper.classes()).toContain('astryx-text--size-sm')
  })

  it('truncates to multiple lines when maxLines is greater than 1', () => {
    const wrapper = mount(Text, {
      props: { maxLines: 2 },
      slots: { default: 'Long text' },
    })

    expect(wrapper.classes()).toContain('astryx-text--truncate-multi')
  })
})
