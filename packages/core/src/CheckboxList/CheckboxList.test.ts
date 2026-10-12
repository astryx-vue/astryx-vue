import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CheckboxList from './CheckboxList.vue'
import CheckboxListItem from './CheckboxListItem.vue'

describe('checkbox list', () => {
  it('toggles a value in collection mode', async () => {
    const wrapper = mount(CheckboxList, {
      props: {
        'label': 'Add-on packages',
        'modelValue': ['free'],
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value as string[] }),
      },
      slots: {
        default: `
          <CheckboxListItem label="Free tier" value="free" />
          <CheckboxListItem label="Pro tier" value="pro" />
        `,
      },
      global: { components: { CheckboxListItem } },
    })
    const inputs = wrapper.findAll('input[type="checkbox"]')
    expect((inputs[0]?.element as HTMLInputElement).checked).toBe(true)
    await inputs[1]?.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['free', 'pro']])
  })

  it('supports a standalone select-all item', async () => {
    const wrapper = mount(CheckboxList, {
      props: { label: 'Include in export' },
      slots: {
        default: '<CheckboxListItem label="Select all" :is-checked="false" />',
      },
      global: { components: { CheckboxListItem } },
    })
    await wrapper.get('input[type="checkbox"]').setValue(true)
    expect(wrapper.findComponent(CheckboxListItem).emitted('check')?.[0]).toEqual([true])
  })
})
