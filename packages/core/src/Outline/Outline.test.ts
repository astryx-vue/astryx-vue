import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Outline from './Outline.vue'
import { indentLevel } from './scrollGeometry.js'

const items = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'tokens', label: 'Tokens', level: 3 },
  { id: 'accessibility', label: 'Accessibility', level: 2 },
]

describe('outline', () => {
  it('renders a labelled nav and marks the controlled section', () => {
    const wrapper = mount(Outline, {
      props: { items, activeId: 'tokens', label: 'On this page' },
    })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('On this page')
    const current = wrapper.get('[aria-current="location"]')
    expect(current.text()).toBe('Tokens')
    expect(current.attributes('href')).toBe('#tokens')
    expect(current.attributes('data-level')).toBe('2')
    expect(wrapper.get('[href="#overview"]').attributes('data-level')).toBe('1')
  })

  it('uses compact padding and the localized landmark name', () => {
    const wrapper = mount(Outline, {
      props: { items, density: 'compact' },
    })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Table of contents')
    expect(wrapper.get('nav').attributes('data-density')).toBe('compact')
  })

  it('marks each link as pressable', () => {
    const wrapper = mount(Outline, {
      props: { items: [{ id: 'overview', label: 'Overview', level: 2 }] },
    })
    expect(wrapper.get('a').attributes('data-astryx-pressable')).toBe('')
  })

  it('maps heading levels onto four indents', () => {
    expect(indentLevel(1)).toBe(1)
    expect(indentLevel(2)).toBe(1)
    expect(indentLevel(3)).toBe(2)
    expect(indentLevel(4)).toBe(3)
    expect(indentLevel(6)).toBe(4)
  })
})
