import type { CenterAxis, CenterProps } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Center from './Center.vue'

describe('center', () => {
  it('renders a flex container that centers on both axes by default', () => {
    const wrapper = mount(Center, {
      slots: { default: '<p class="message">Nothing here yet</p>' },
    })

    const center = wrapper.find('.astryx-center')
    expect(center.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(center.classes()).not.toContain('astryx-center--inline')
    expect(center.attributes('data-axis')).toBe('both')
    expect(center.find('p.message').text()).toBe('Nothing here yet')
  })

  it('reflects the centering axis it was given', () => {
    expect(mount(Center, { props: { axis: 'horizontal' } }).attributes('data-axis')).toBe('horizontal')
    expect(mount(Center, { props: { axis: 'vertical' } }).attributes('data-axis')).toBe('vertical')
  })

  it('switches to inline-flex only when isInline is set', () => {
    const wrapper = mount(Center)
    expect(wrapper.classes()).not.toContain('astryx-center--inline')

    const inline = mount(Center, { props: { isInline: true } })
    expect(inline.classes()).toContain('astryx-center--inline')
  })

  it('formats numeric sizes as pixels and preserves string sizes', () => {
    const wrapper = mount(Center, {
      props: { height: 240, maxWidth: '70rem', minHeight: 0, width: '100%' },
    })

    expect(wrapper.element.style.height).toBe('240px')
    expect(wrapper.element.style.maxWidth).toBe('70rem')
    expect(wrapper.element.style.minHeight).toBe('0px')
    expect(wrapper.element.style.width).toBe('100%')
  })

  it('applies padding to all four edges as spacing tokens', () => {
    const wrapper = mount(Center, { props: { padding: 3 } })
    const style = wrapper.element.style

    expect(style.getPropertyValue('--astryx-center-padding-block-start')).toBe('var(--astryx-spacing-3, 12px)')
    expect(style.getPropertyValue('--astryx-center-padding-block-end')).toBe('var(--astryx-spacing-3, 12px)')
    expect(style.getPropertyValue('--astryx-center-padding-inline-start')).toBe('var(--astryx-spacing-3, 12px)')
    expect(style.getPropertyValue('--astryx-center-padding-inline-end')).toBe('var(--astryx-spacing-3, 12px)')
  })

  it('lets an axis override padding and an edge override the axis, including with zero', () => {
    const wrapper = mount(Center, {
      props: { padding: 4, paddingBlock: 0, paddingInline: 2, paddingInlineStart: 6 },
    })
    const style = wrapper.element.style

    expect(style.getPropertyValue('--astryx-center-padding-block-start')).toBe('var(--astryx-spacing-0, 0px)')
    expect(style.getPropertyValue('--astryx-center-padding-block-end')).toBe('var(--astryx-spacing-0, 0px)')
    expect(style.getPropertyValue('--astryx-center-padding-inline-start')).toBe('var(--astryx-spacing-6, 24px)')
    expect(style.getPropertyValue('--astryx-center-padding-inline-end')).toBe('var(--astryx-spacing-2, 8px)')
  })

  it('leaves the padding variables unset when no padding prop is given', () => {
    const wrapper = mount(Center)

    expect(wrapper.element.style.getPropertyValue('--astryx-center-padding-block-start')).toBe('')
    expect(wrapper.element.style.getPropertyValue('--astryx-center-padding-inline-end')).toBe('')
  })

  it('merges consumer classes and styles, letting its own padding win', () => {
    const wrapper = mount(Center, {
      props: { padding: 2 },
      attrs: { class: 'my-center', style: 'margin-top: 4px; --astryx-center-padding-block-start: 99px' },
    })

    expect(wrapper.classes()).toContain('astryx-center')
    expect(wrapper.classes()).toContain('my-center')
    expect(wrapper.element.style.marginTop).toBe('4px')
    expect(wrapper.element.style.getPropertyValue('--astryx-center-padding-block-start')).toBe('var(--astryx-spacing-2, 8px)')
  })

  it('forwards attributes and listeners without letting a consumer data-axis replace its own', async () => {
    const wrapper = mount(Center, {
      attrs: {
        'aria-label': 'Empty state',
        'data-axis': 'vertical',
        'data-testid': 'center',
        'onClick': () => {},
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('Empty state')
    expect(wrapper.attributes('data-testid')).toBe('center')
    expect(wrapper.attributes('data-axis')).toBe('both')

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('exposes the container element', () => {
    const wrapper = mount(Center)
    expect(wrapper.vm.element).toBe(wrapper.element)
  })

  it('follows reactive props instead of a snapshot taken at mount', async () => {
    const axis = ref<CenterAxis>('both')
    const isInline = ref(false)
    const padding = ref<CenterProps['padding']>(2)

    const Owner = defineComponent({
      setup() {
        return () => h(Center, { axis: axis.value, isInline: isInline.value, padding: padding.value })
      },
    })

    const wrapper = mount(Owner)
    expect(wrapper.attributes('data-axis')).toBe('both')
    expect(wrapper.classes()).not.toContain('astryx-center--inline')

    axis.value = 'vertical'
    isInline.value = true
    padding.value = 6
    await nextTick()

    expect(wrapper.attributes('data-axis')).toBe('vertical')
    expect(wrapper.classes()).toContain('astryx-center--inline')
    expect(wrapper.element.style.getPropertyValue('--astryx-center-padding-block-start')).toBe('var(--astryx-spacing-6, 24px)')

    padding.value = undefined
    await nextTick()

    expect(wrapper.element.style.getPropertyValue('--astryx-center-padding-block-start')).toBe('')
  })
})
