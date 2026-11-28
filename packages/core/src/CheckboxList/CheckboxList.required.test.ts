import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import CheckboxList from './CheckboxList.vue'
import CheckboxListItem from './CheckboxListItem.vue'

function mountGroup(props: Record<string, unknown>, options: { initial?: string[], order?: string[], disabled?: string[] } = {}) {
  const values = ref<string[]>(options.initial ?? [])
  const order = ref(options.order ?? ['a', 'b', 'c'])
  const host = defineComponent({
    setup: () => () => h(CheckboxList, {
      'label': 'Topics',
      'modelValue': values.value,
      'onUpdate:modelValue': (next: unknown) => { values.value = (next as string[] | undefined) ?? [] },
      ...props,
    }, () => order.value.map(value => h(CheckboxListItem, {
      key: value,
      value,
      label: value.toUpperCase(),
      isDisabled: options.disabled?.includes(value),
    }))),
  })
  const wrapper = mount(host, { attachTo: document.body })
  const requiredFlags = () => wrapper.findAll<HTMLInputElement>('input[type="checkbox"]').map(input => input.element.required)
  return { wrapper, values, order, requiredFlags }
}

describe('checkboxList isRequired', () => {
  it('没有勾选时只有第一个可用的框带 required，勾选后都不带', async () => {
    const { wrapper, requiredFlags } = mountGroup({ isRequired: true }, { disabled: ['a'] })
    await flushPromises()
    expect(requiredFlags()).toEqual([false, true, false])

    await wrapper.findAll('input[type="checkbox"]')[2]!.setValue(true)
    await flushPromises()
    expect(requiredFlags()).toEqual([false, false, false])

    await wrapper.findAll('input[type="checkbox"]')[2]!.setValue(false)
    await flushPromises()
    expect(requiredFlags()).toEqual([false, true, false])
    wrapper.unmount()
  })

  it('不是必填的组，没有任何框带 required', async () => {
    const { wrapper, requiredFlags } = mountGroup({})
    await flushPromises()
    expect(requiredFlags()).toEqual([false, false, false])
    wrapper.unmount()
  })

  it('禁用或只读的组什么都不要求', async () => {
    const disabled = mountGroup({ isRequired: true, isDisabled: true })
    await flushPromises()
    expect(disabled.requiredFlags()).toEqual([false, false, false])
    disabled.wrapper.unmount()

    const readOnly = mountGroup({ isRequired: true, isReadOnly: true })
    await flushPromises()
    expect(readOnly.requiredFlags()).toEqual([false, false, false])
    readOnly.wrapper.unmount()
  })

  it('选项重排后 required 跟到新的第一个框', async () => {
    const { wrapper, order, requiredFlags } = mountGroup({ isRequired: true })
    await flushPromises()
    expect(requiredFlags()).toEqual([true, false, false])

    order.value = ['c', 'a', 'b']
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(requiredFlags()).toEqual([true, false, false])
    expect(requiredFlags().filter(Boolean)).toHaveLength(1)
    wrapper.unmount()
  })
})
