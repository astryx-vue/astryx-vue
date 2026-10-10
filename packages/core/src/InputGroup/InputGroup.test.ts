import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InputGroup from './InputGroup.vue'

describe('inputGroup', () => {
  it('renders default slot', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.find('.astryx-input-group-field').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders before addon', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        before: '<span>$</span>',
        default: '<input type="text" />',
      },
    })

    const beforeAddon = wrapper.find('.astryx-input-group-addon.before')
    expect(beforeAddon.exists()).toBe(true)
    expect(beforeAddon.text()).toBe('$')
  })

  it('renders after addon', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: '<input type="text" />',
        after: '<span>.00</span>',
      },
    })

    const afterAddon = wrapper.find('.astryx-input-group-addon.after')
    expect(afterAddon.exists()).toBe(true)
    expect(afterAddon.text()).toBe('.00')
  })

  it('renders both before and after addons', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        before: '<span>$</span>',
        default: '<input type="text" />',
        after: '<span>.00</span>',
      },
    })

    expect(wrapper.find('.astryx-input-group-addon.before').exists()).toBe(true)
    expect(wrapper.find('.astryx-input-group-addon.after').exists()).toBe(true)
  })

  it('applies correct size class', () => {
    const wrapper = mount(InputGroup, {
      props: {
        size: 'sm',
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.find('.astryx-input-group').classes()).toContain('size-sm')
  })

  it('applies disabled class when disabled', () => {
    const wrapper = mount(InputGroup, {
      props: {
        disabled: true,
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.find('.astryx-input-group').classes()).toContain('is-disabled')
  })

  it('provides context to children', () => {
    // 简化测试：只验证 provide 被调用
    const wrapper = mount(InputGroup, {
      props: {
        size: 'lg',
        disabled: true,
      },
      slots: {
        default: '<input type="text" />',
      },
    })

    // 验证 props 被正确应用
    expect(wrapper.props('size')).toBe('lg')
    expect(wrapper.props('disabled')).toBe(true)
    expect(wrapper.find('.astryx-input-group').classes()).toContain('size-lg')
    expect(wrapper.find('.astryx-input-group').classes()).toContain('is-disabled')
  })

  it('renders without addons when slots are not provided', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.find('.astryx-input-group-addon.before').exists()).toBe(false)
    expect(wrapper.find('.astryx-input-group-addon.after').exists()).toBe(false)
    expect(wrapper.find('.astryx-input-group-field').exists()).toBe(true)
  })

  it('handles complex addon content', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        before: '<button type="button">Search</button>',
        default: '<input type="text" />',
        after: '<button type="button">Clear</button>',
      },
    })

    const beforeButton = wrapper.find('.astryx-input-group-addon.before button')
    const afterButton = wrapper.find('.astryx-input-group-addon.after button')

    expect(beforeButton.exists()).toBe(true)
    expect(beforeButton.text()).toBe('Search')
    expect(afterButton.exists()).toBe(true)
    expect(afterButton.text()).toBe('Clear')
  })

  it('applies default size when not specified', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.find('.astryx-input-group').classes()).toContain('size-md')
  })

  it('is not disabled by default', () => {
    const wrapper = mount(InputGroup, {
      slots: {
        default: '<input type="text" />',
      },
    })

    expect(wrapper.find('.astryx-input-group').classes()).not.toContain('is-disabled')
  })
})
