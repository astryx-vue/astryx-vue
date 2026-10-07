import type { VueWrapper } from '@vue/test-utils'
import type { RadioValue } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import Radio from './Radio.vue'
import RadioGroup from './RadioGroup.vue'
import RadioList from './RadioList.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

function renderGroup(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}): VueWrapper<InstanceType<typeof RadioGroup>> {
  const wrapper: VueWrapper<InstanceType<typeof RadioGroup>> = mount(RadioGroup, {
    attachTo: document.body,
    props: {
      'label': 'Size',
      'modelValue': 'md',
      'onUpdate:modelValue': (value: unknown) => { void wrapper.setProps({ modelValue: value as RadioValue }) },
      ...props,
    },
    slots,
  })
  return wrapper
}

describe('radio', () => {
  it('selects a value via RadioGroup slot', async () => {
    const wrapper = renderGroup({}, {
      default: () => [
        h(Radio, { value: 'sm', label: 'Small' }),
        h(Radio, { value: 'md', label: 'Medium' }),
        h(Radio, { value: 'lg', label: 'Large' }),
      ],
    })
    const inputs = wrapper.findAll<HTMLInputElement>('input[type="radio"]')
    expect(inputs[1]?.element.checked).toBe(true)
    await inputs[2]?.setValue()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['lg'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('lg')
  })

  it('selects a value via RadioList options', async () => {
    const wrapper: VueWrapper<InstanceType<typeof RadioList>> = mount(RadioList, {
      attachTo: document.body,
      props: {
        'label': 'Size',
        'modelValue': 'md',
        'options': [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
        'onUpdate:modelValue': (value: unknown) => { void wrapper.setProps({ modelValue: value as RadioValue }) },
      },
    })
    const inputs = wrapper.findAll<HTMLInputElement>('input[type="radio"]')
    expect(inputs).toHaveLength(3)
    await inputs[0]?.setValue()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['sm'])
  })

  it('links the group label and radiogroup role', () => {
    const wrapper = renderGroup({ id: 'size', options: [{ value: 'sm', label: 'Small' }] })
    const group = wrapper.get('[role="radiogroup"]')
    expect(group.attributes('aria-labelledby')).toBe('size-label')
    expect(wrapper.get('#size-label').attributes('for')).toBeUndefined()
  })

  it('disables individual options and the whole group', async () => {
    const wrapper = renderGroup({
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium', isDisabled: true },
      ],
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[1]?.attributes('disabled')).toBe('')
    await wrapper.setProps({ isDisabled: true })
    expect(inputs[0]?.attributes('disabled')).toBe('')
  })

  it('renders server-side with checked state', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(RadioGroup, { label: 'Size', modelValue: 'lg', options: [{ value: 'sm', label: 'Small' }, { value: 'lg', label: 'Large' }] }),
    }))
    expect(html).toContain('role="radiogroup"')
    expect(html).toContain('value="lg"')
    expect(html).toContain('checked')
  })
})
