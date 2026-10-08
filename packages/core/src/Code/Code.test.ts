import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Code from './Code.vue'

describe('code', () => {
  it('renders the content inside a semantic code element', () => {
    const wrapper = mount(Code, { slots: { default: 'const count = 0' } })

    const code = wrapper.get('code')
    expect(code.classes()).toContain('astryx-code')
    expect(code.text()).toBe('const count = 0')
  })

  it('defaults to the primary color', () => {
    const wrapper = mount(Code, { slots: { default: 'code' } })

    expect(wrapper.get('.astryx-code').attributes('data-color')).toBe('primary')
  })

  it('reflects the color variant it was given', () => {
    const wrapper = mount(Code, { props: { color: 'secondary' }, slots: { default: 'code' } })

    expect(wrapper.get('.astryx-code').attributes('data-color')).toBe('secondary')
  })

  it('leaves the size off until it is asked to inherit one', async () => {
    const wrapper = mount(Code, { slots: { default: 'code' } })
    expect(wrapper.get('.astryx-code').attributes('data-size')).toBeUndefined()

    await wrapper.setProps({ size: 'inherit' })
    expect(wrapper.get('.astryx-code').attributes('data-size')).toBe('inherit')
  })

  it('follows a color change after mount', async () => {
    const wrapper = mount(Code, { slots: { default: 'code' } })

    await wrapper.setProps({ color: 'inherit' })
    expect(wrapper.get('.astryx-code').attributes('data-color')).toBe('inherit')
  })

  it('passes native attributes, class, and style to the code element', () => {
    const wrapper = mount(Code, {
      attrs: { 'aria-label': 'Code sample', 'class': 'consumer-class', 'data-testid': 'code', 'style': 'opacity: 0.5' },
      slots: { default: 'code' },
    })

    const code = wrapper.get('code')
    expect(code.attributes('aria-label')).toBe('Code sample')
    expect(code.attributes('data-testid')).toBe('code')
    expect(code.classes()).toContain('consumer-class')
    expect(code.attributes('style')).toContain('opacity: 0.5')
  })

  it('exposes the rendered code element', () => {
    const wrapper = mount(Code, { slots: { default: 'code' } })

    expect(wrapper.vm.element).toBe(wrapper.get('code').element)
  })
})
