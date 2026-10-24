import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import Blockquote from './Blockquote.vue'

describe('blockquote', () => {
  it('renders slotted content in a semantic blockquote without attribution by default', () => {
    const wrapper = mount(Blockquote, {
      slots: {
        default: '<p>A quoted statement.</p>',
      },
    })

    expect(wrapper.element.tagName).toBe('BLOCKQUOTE')
    expect(wrapper.text()).toBe('A quoted statement.')
    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.find('cite').exists()).toBe(false)
  })

  it('renders the cite prop in a cite element without a footer landmark', () => {
    const wrapper = mount(Blockquote, {
      props: {
        cite: 'Steve Jobs',
      },
      slots: {
        default: 'Design is not just what it looks like.',
      },
    })

    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.find('cite').text()).toBe('Steve Jobs')
  })

  it('supports rich attribution through the cite slot', () => {
    const wrapper = mount(Blockquote, {
      props: {
        cite: 'Fallback attribution',
      },
      slots: {
        cite: '<a href="/people/ada">Ada Lovelace</a>',
        default: 'That brain of mine is something more than merely mortal.',
      },
    })

    expect(wrapper.find('cite a').attributes('href')).toBe('/people/ada')
    expect(wrapper.find('cite').text()).toBe('Ada Lovelace')
    expect(wrapper.text()).not.toContain('Fallback attribution')
  })

  it('skips an empty cite so the quote does not grow an empty attribution', () => {
    const wrapper = mount(Blockquote, {
      props: {
        cite: '',
      },
    })

    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.find('cite').exists()).toBe(false)
  })
})
