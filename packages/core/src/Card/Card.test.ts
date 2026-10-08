import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Card from './Card.vue'

describe('card', () => {
  it('renders a div with the theme target and the slot content', () => {
    const wrapper = mount(Card, {
      slots: { default: 'Hello' },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('astryx-card')
    expect(wrapper.text()).toBe('Hello')
  })

  it('defaults to the default variant at rest elevation', () => {
    const wrapper = mount(Card)

    expect(wrapper.attributes('data-variant')).toBe('default')
    expect(wrapper.attributes('data-elevation')).toBe('none')
    expect(wrapper.attributes('data-padding')).toBeUndefined()
    expect(wrapper.attributes('data-scrollable')).toBeUndefined()
  })

  it('reflects the variant and the elevation', () => {
    const variant = mount(Card, { props: { variant: 'muted' } })
    const elevation = mount(Card, { props: { elevation: 'high' } })

    expect(variant.attributes('data-variant')).toBe('muted')
    expect(elevation.attributes('data-elevation')).toBe('high')
  })

  it('accepts every built-in variant', () => {
    const variants = ['default', 'transparent', 'muted', 'blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'] as const

    for (const cardVariant of variants) {
      const wrapper = mount(Card, { props: { variant: cardVariant } })
      expect(wrapper.attributes('data-variant')).toBe(cardVariant)
    }
  })

  it('reflects every padding step, including zero and half steps', () => {
    const steps = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10] as const

    for (const step of steps) {
      const wrapper = mount(Card, { props: { padding: step } })
      expect(wrapper.attributes('data-padding')).toBe(String(step))
    }
  })

  it('formats numeric sizes as pixels and preserves string sizes', () => {
    const wrapper = mount(Card, {
      props: {
        height: 240,
        maxWidth: '70rem',
        minHeight: 0,
        width: '100%',
      },
    })

    expect(wrapper.element.style.height).toBe('240px')
    expect(wrapper.element.style.maxWidth).toBe('70rem')
    expect(wrapper.element.style.minHeight).toBe('0px')
    expect(wrapper.element.style.width).toBe('100%')
  })

  it('scrolls only when the height is fixed', () => {
    const fixed = mount(Card, { props: { height: 200 } })
    const auto = mount(Card, { props: { height: 'auto' } })
    const unsized = mount(Card)

    expect(fixed.attributes('data-scrollable')).toBe('true')
    expect(auto.attributes('data-scrollable')).toBeUndefined()
    expect(unsized.attributes('data-scrollable')).toBeUndefined()
  })

  it('spreads unknown attributes onto the root and merges class and style', () => {
    const wrapper = mount(Card, {
      attrs: {
        'aria-label': 'Promotion',
        'class': 'promo',
        'data-testid': 'card',
        'id': 'promo',
        'style': 'color: red',
      },
    })

    expect(wrapper.attributes('id')).toBe('promo')
    expect(wrapper.attributes('aria-label')).toBe('Promotion')
    expect(wrapper.attributes('data-testid')).toBe('card')
    expect(wrapper.classes()).toContain('astryx-card')
    expect(wrapper.classes()).toContain('promo')
    expect(wrapper.element.style.color).toBe('red')
  })

  it('exposes the rendered element', () => {
    const wrapper = mount(Card)

    expect(wrapper.vm.element).toBe(wrapper.element)
  })

  /*
   * A prop read once at setup would leave the card painted with the values it
   * was mounted with, so every prop is checked again after it changes.
   */
  it('follows prop changes after mount', async () => {
    const wrapper = mount(Card, {
      props: { height: 200, padding: 2, variant: 'muted', width: 320 },
    })

    await wrapper.setProps({ height: 'auto', padding: 6, variant: 'blue', width: '50%' })

    expect(wrapper.attributes('data-variant')).toBe('blue')
    expect(wrapper.attributes('data-padding')).toBe('6')
    expect(wrapper.attributes('data-scrollable')).toBeUndefined()
    expect(wrapper.element.style.width).toBe('50%')
    expect(wrapper.element.style.height).toBe('auto')

    await wrapper.setProps({ elevation: 'med', padding: undefined })

    expect(wrapper.attributes('data-elevation')).toBe('med')
    expect(wrapper.attributes('data-padding')).toBeUndefined()
  })
})
