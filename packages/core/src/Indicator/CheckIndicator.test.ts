import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CheckIndicator from './CheckIndicator.vue'

describe('checkIndicator', () => {
  it('draws a check when chosen and nothing when not', () => {
    const checked = mount(CheckIndicator, { props: { state: 'checked' } })
    expect(checked.find('.astryx-icon--check').exists()).toBe(true)
    expect(checked.attributes('aria-hidden')).toBe('true')

    const open = mount(CheckIndicator, { props: { state: 'unchecked' } })
    expect(open.find('.astryx-icon').exists()).toBe(false)
    expect(open.find('*').exists()).toBe(false)
  })

  it('drops role and aria attributes forwarded by a caller', () => {
    const wrapper = mount(CheckIndicator, {
      props: { state: 'checked' },
      attrs: { 'role': 'checkbox', 'aria-label': 'Chosen', 'tabindex': 0 },
    })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('replaces the mark in either state when the slot has something to draw', () => {
    const wrapper = mount(CheckIndicator, {
      props: { state: 'unchecked' },
      slots: { default: '<span class="pending" />' },
    })
    expect(wrapper.find('.pending').exists()).toBe(true)
    expect(wrapper.find('.astryx-icon').exists()).toBe(false)
    expect(wrapper.classes()).toContain('astryx-check-indicator')
  })

  it('keeps the mark when the slot renders nothing', () => {
    const wrapper = mount(CheckIndicator, {
      props: { state: 'checked' },
      slots: { default: () => [] },
    })
    expect(wrapper.find('.astryx-icon--check').exists()).toBe(true)
  })
})
