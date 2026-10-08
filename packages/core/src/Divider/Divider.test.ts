import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Divider from './Divider.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

describe('divider', () => {
  it('renders one rule and a horizontal separator without a label', () => {
    const wrapper = mount(Divider, { attachTo: document.body })
    const separator = wrapper.get('[role="separator"]')

    expect(separator.attributes('aria-orientation')).toBe('horizontal')
    expect(separator.attributes('data-orientation')).toBe('horizontal')
    expect(separator.attributes('aria-labelledby')).toBeUndefined()
    expect(separator.findAll('.astryx-divider__rule')).toHaveLength(1)
    expect(separator.find('.astryx-divider__label').exists()).toBe(false)
  })

  it('renders rule, label and rule when a label is given', () => {
    const wrapper = mount(Divider, {
      attachTo: document.body,
      props: { label: 'or' },
    })
    const separator = wrapper.get('[role="separator"]')
    const label = wrapper.get('.astryx-divider__label')

    expect(separator.findAll('.astryx-divider__rule')).toHaveLength(2)
    expect(label.text()).toBe('or')
    expect(separator.attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('uses an explicit aria-label instead of the visible label', () => {
    const wrapper = mount(Divider, {
      attachTo: document.body,
      props: { label: 'or' },
      attrs: { 'aria-label': 'Or continue with' },
    })
    const separator = wrapper.get('[role="separator"]')

    expect(separator.attributes('aria-label')).toBe('Or continue with')
    expect(separator.attributes('aria-labelledby')).toBeUndefined()
  })

  it('reflects vertical orientation', () => {
    const wrapper = mount(Divider, {
      attachTo: document.body,
      props: { orientation: 'vertical' },
    })
    const separator = wrapper.get('[role="separator"]')

    expect(separator.attributes('aria-orientation')).toBe('vertical')
    expect(separator.attributes('data-orientation')).toBe('vertical')
  })

  it.each(['subtle', 'strong'] as const)('exposes variant %s', (variant) => {
    const wrapper = mount(Divider, { attachTo: document.body, props: { variant } })

    expect(wrapper.get('[role="separator"]').attributes('data-variant')).toBe(variant)
  })

  it('marks full-bleed only when enabled', () => {
    const plain = mount(Divider, { attachTo: document.body })
    expect(plain.get('[role="separator"]').attributes('data-full-bleed')).toBeUndefined()

    const bleed = mount(Divider, { attachTo: document.body, props: { isFullBleed: true } })
    expect(bleed.get('[role="separator"]').attributes('data-full-bleed')).toBe('true')
  })
})
