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

  it('keeps every link in the normal Tab order with no roving tabindex or arrow movement', async () => {
    const wrapper = mount(Outline, { attachTo: document.body, props: { items, activeId: 'tokens' } })
    for (const link of wrapper.findAll('a'))
      expect(link.attributes('tabindex')).toBeUndefined()
    await wrapper.get('[href="#overview"]').trigger('focus')
    await wrapper.get('[href="#overview"]').trigger('keydown', { key: 'ArrowDown' })
    for (const link of wrapper.findAll('a'))
      expect(link.attributes('tabindex')).toBeUndefined()
    wrapper.unmount()
  })

  it('lets a caller aria-label win over label', () => {
    const wrapper = mount(Outline, { props: { items, label: 'On this page' }, attrs: { 'aria-label': 'Page sections' } })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Page sections')
  })

  it('moves focus to the chosen section after following a link', async () => {
    const section = document.createElement('section')
    section.id = 'tokens'
    document.body.append(section)
    section.scrollIntoView = () => {}
    const wrapper = mount(Outline, { attachTo: document.body, props: { items } })
    await wrapper.get('[href="#tokens"]').trigger('click')
    expect(document.activeElement).toBe(section)
    wrapper.unmount()
    section.remove()
  })

  it('maps heading levels onto four indents', () => {
    expect(indentLevel(1)).toBe(1)
    expect(indentLevel(2)).toBe(1)
    expect(indentLevel(3)).toBe(2)
    expect(indentLevel(4)).toBe(3)
    expect(indentLevel(6)).toBe(4)
  })
})
