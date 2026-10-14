import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import CheckboxIndicator from '../CheckboxIndicator/CheckboxIndicator.vue'
import { defineTheme } from '../Theme/defineTheme.js'
import Theme from '../Theme/Theme.vue'
import CheckIndicator from './CheckIndicator.vue'
import RadioIndicator from './RadioIndicator.vue'
import { defaultIndicators, getIndicator } from './registry.js'
import { useIndicator } from './useIndicator.js'

const BrandStar = defineComponent({
  name: 'BrandStar',
  props: { state: { type: String, required: true } },
  setup(props) {
    return () => h('span', { 'class': 'brand-star', 'data-state': props.state, 'aria-hidden': 'true' })
  },
})

describe('indicator registry', () => {
  it('ships a default for each core name', () => {
    expect(Object.keys(defaultIndicators).sort()).toEqual(['check', 'checkbox', 'radio'])
    expect(defaultIndicators.check).toBe(CheckIndicator)
    expect(defaultIndicators.checkbox).toBe(CheckboxIndicator)
    expect(defaultIndicators.radio).toBe(RadioIndicator)
    expect(getIndicator('check')).toBe(CheckIndicator)
    expect(getIndicator('radio')).toBe(RadioIndicator)
  })

  it('prefers a theme override and leaves the other names alone', () => {
    const theme = defineTheme({
      name: 'registry-override',
      indicators: { check: RadioIndicator },
    })

    expect(getIndicator('check', theme)).toBe(RadioIndicator)
    expect(getIndicator('checkbox', theme)).toBe(CheckboxIndicator)
  })

  it('returns undefined for a name core does not ship, until a theme supplies it', () => {
    expect(getIndicator('brand-star')).toBeUndefined()
    const theme = defineTheme({
      name: 'brand-star-theme',
      indicators: { 'brand-star': BrandStar },
    })
    expect(getIndicator('brand-star', theme)).toBe(BrandStar)
  })

  it('merges indicator overrides when a theme extends another', () => {
    const base = defineTheme({
      name: 'indicator-base',
      indicators: { check: RadioIndicator, checkbox: CheckboxIndicator },
    })
    const child = defineTheme({
      name: 'indicator-child',
      extends: base,
      indicators: { check: BrandStar as Component },
    })
    expect(child.indicators?.check).toBe(BrandStar)
    expect(child.indicators?.checkbox).toBe(CheckboxIndicator)
  })

  it('reads the nearest theme from useIndicator', () => {
    const theme = defineTheme({
      name: 'hook-override',
      indicators: { check: RadioIndicator },
    })
    const Host = defineComponent({
      setup() {
        const Mark = useIndicator('check')
        return () => h(Mark.value, { state: 'checked', size: 'sm' })
      },
    })
    const wrapper = mount(Theme, {
      props: { theme },
      slots: { default: () => h(Host) },
    })
    expect(wrapper.find('.astryx-radio-indicator').exists()).toBe(true)
    expect(wrapper.find('.astryx-icon').exists()).toBe(false)
  })
})
