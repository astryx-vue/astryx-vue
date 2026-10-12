import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { ariaRequired, showsOptionalIndicator, showsRequiredIndicator, useFormLayout } from './context.js'
import FormLayout from './FormLayout.vue'

const Probe = defineComponent({
  name: 'FormLayoutProbe',
  setup() {
    const layout = useFormLayout()
    return { layout }
  },
  template: '<span class="probe">{{ layout?.direction }}:{{ layout?.defaultOptionality }}</span>',
})

describe('form layout', () => {
  it('stacks fields vertically by default and is not a form element', () => {
    const wrapper = mount(FormLayout, { slots: { default: '<input />' } })
    expect(wrapper.attributes('data-direction')).toBe('vertical')
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('publishes direction so a nested layout can replace it', () => {
    const wrapper = mount(FormLayout, {
      props: { direction: 'vertical', defaultOptionality: 'required' },
      slots: {
        default: () => [
          h(Probe),
          h(FormLayout, { direction: 'horizontal' }, () => h(Probe)),
        ],
      },
    })

    const probes = wrapper.findAll('.probe')
    expect(probes[0]?.text()).toBe('vertical:required')
    expect(probes[1]?.text()).toBe('horizontal:')
  })

  it('keeps the existing aria-required rule outside a form layout', () => {
    expect(ariaRequired(true, false, undefined)).toBe(true)
    expect(ariaRequired(true, true, undefined)).toBeUndefined()
    expect(ariaRequired(false, false, undefined)).toBeUndefined()
  })

  it('marks unmarked fields required when the form default is required', () => {
    expect(ariaRequired(false, false, 'required')).toBe(true)
    expect(ariaRequired(false, true, 'required')).toBeUndefined()
    expect(showsRequiredIndicator(true, false, 'required')).toBe(false)
    expect(showsOptionalIndicator(true, false, 'required')).toBe(true)
    expect(showsRequiredIndicator(true, true, undefined)).toBe(false)
    expect(showsOptionalIndicator(true, true, undefined)).toBe(true)
  })
})
