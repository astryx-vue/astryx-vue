import { CheckboxInput, defineTheme, Theme } from '@astryx-vue/core'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import CircleCheckIndicator from './CircleCheckIndicator.vue'

enableAutoUnmount(afterEach)

function mark(props: Record<string, unknown>, attrs: Record<string, unknown> = {}, slot?: () => unknown) {
  return mount(CircleCheckIndicator, { props: { state: 'unchecked', ...props }, attrs, slots: slot ? { default: slot } : {} })
}

describe('circleCheckIndicator', () => {
  it('is decorative: aria-hidden, with no role, tab stop or aria attribute a caller forwards', () => {
    const wrapper = mark({}, { 'role': 'checkbox', 'tabindex': 0, 'aria-label': 'Pick', 'aria-hidden': 'false', 'data-testid': 'circle' })
    const root = wrapper.get('.astryx-circle-check-indicator')
    expect(root.attributes('aria-hidden')).toBe('true')
    expect(root.attributes('role')).toBeUndefined()
    expect(root.attributes('tabindex')).toBeUndefined()
    expect(root.attributes('aria-label')).toBeUndefined()
    expect(root.attributes('data-testid')).toBe('circle')
  })

  it('draws an empty ring, a check, or a bar for each state', () => {
    for (const state of ['unchecked', 'checked', 'indeterminate'] as const) {
      const root = mark({ state }).get('.astryx-circle-check-indicator')
      expect(root.attributes('data-state')).toBe(state)
      // 对勾和横线都在，CSS 按状态只显示其中一个。
      expect(root.find('.astryx-circle-check-indicator-check').exists()).toBe(true)
      expect(root.find('.astryx-circle-check-indicator-dash').exists()).toBe(true)
    }
  })

  it('takes the size and disabled look', () => {
    const root = mark({ size: 'sm', isDisabled: true }).get('.astryx-circle-check-indicator')
    expect(root.attributes('data-size')).toBe('sm')
    expect(root.attributes('data-disabled')).toBe('disabled')
    expect(mark({}).get('.astryx-circle-check-indicator').attributes('data-size')).toBe('md')
  })

  it('draws slot content instead of the mark', () => {
    const root = mark({ state: 'checked' }, {}, () => h('span', { class: 'spinner' })).get('.astryx-circle-check-indicator')
    expect(root.find('.spinner').exists()).toBe(true)
    expect(root.find('.astryx-circle-check-indicator-check').exists()).toBe(false)
  })

  it('replaces every checkbox when a theme maps it to checkbox', () => {
    const theme = defineTheme({ name: 'circle-checks', indicators: { checkbox: CircleCheckIndicator } })
    const wrapper = mount(Theme, {
      props: { theme },
      slots: { default: () => h(CheckboxInput, { label: 'Select row', modelValue: true }) },
    })
    const circle = wrapper.get('.astryx-circle-check-indicator')
    expect(circle.attributes('data-state')).toBe('checked')
    // 控件自己的语义和输入都还在。
    expect(wrapper.get('input[type="checkbox"]').attributes('aria-labelledby')).toBeTruthy()
  })
})
