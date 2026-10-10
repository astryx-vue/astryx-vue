import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import InputGroup from './InputGroup.vue'

describe('InputGroup', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.find('.astryx-input-group').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('应该正确传递 size 到上下文', () => {
    const wrapper = mount(InputGroup, {
      props: {
        size: 'lg',
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.attributes('data-size')).toBe('lg')
  })

  it('应该正确传递 disabled 到上下文', () => {
    const wrapper = mount(InputGroup, {
      props: {
        disabled: true,
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.attributes('data-disabled')).toBeDefined()
  })

  it('before 插槽应该正确渲染', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        before: '<span>Before</span>',
        default: '<input type="text" />',
      },
    })

    const beforeSlot = wrapper.find('.astryx-input-group__before')
    expect(beforeSlot.exists()).toBe(true)
    expect(beforeSlot.text()).toBe('Before')
  })

  it('after 插槽应该正确渲染', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: '<input type="text" />',
        after: '<span>After</span>',
      },
    })

    const afterSlot = wrapper.find('.astryx-input-group__after')
    expect(afterSlot.exists()).toBe(true)
    expect(afterSlot.text()).toBe('After')
  })

  it('应该同时支持 before 和 after 插槽', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        before: '<span>Before</span>',
        default: '<input type="text" />',
        after: '<span>After</span>',
      },
    })

    expect(wrapper.find('.astryx-input-group__before').exists()).toBe(true)
    expect(wrapper.find('.astryx-input-group__after').exists()).toBe(true)
  })

  it('应该应用自定义类名', () => {
    const wrapper = mount(InputGroup, {
      props: {
        class: 'custom-class',
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.classes()).toContain('custom-class')
  })

  it('多个 size 值应该正确应用', async () => {
    const wrapper = mount(InputGroup, {
      props: {
        size: 'sm',
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.attributes('data-size')).toBe('sm')

    await wrapper.setProps({ size: 'md' })
    await nextTick()

    expect(wrapper.attributes('data-size')).toBe('md')

    await wrapper.setProps({ size: 'lg' })
    await nextTick()

    expect(wrapper.attributes('data-size')).toBe('lg')
  })

  it('应该正确嵌套多个输入控件', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: () => [
          h('input', { type: 'text', placeholder: 'First' }),
          h('input', { type: 'text', placeholder: 'Second' }),
        ],
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].attributes('placeholder')).toBe('First')
    expect(inputs[1].attributes('placeholder')).toBe('Second')
  })
})
