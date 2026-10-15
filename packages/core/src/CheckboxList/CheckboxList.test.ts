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

  it('fills a checked row and leaves the indeterminate select-all row clear', () => {
    const wrapper = mount(CheckboxList, {
      props: { label: 'Include in export' },
      slots: {
        default: '<CheckboxListItem label="Select all" is-checked="indeterminate" /><CheckboxListItem label="History" :is-checked="true" />',
      },
      global: { components: { CheckboxListItem } },
    })
    const rows = wrapper.findAll('.astryx-item')
    expect(rows[0]?.find('.astryx-checkbox-indicator').attributes('data-state')).toBe('indeterminate')
    expect(rows[0]?.attributes('data-selected')).toBeUndefined()
    expect(rows[1]?.attributes('data-selected')).toBe('true')
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

  it('blocks a read-only group without dimming it', async () => {
    const wrapper = mount(CheckboxList, {
      props: { label: 'Export', modelValue: ['csv'], isReadOnly: true },
      slots: { default: '<CheckboxListItem label="CSV" value="csv" />' },
      global: { components: { CheckboxListItem } },
    })
    const input = wrapper.get('input[type="checkbox"]')
    expect(input.attributes('aria-readonly')).toBe('true')
    expect(input.attributes('disabled')).toBeUndefined()
    await input.setValue(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('keeps a disabled group focusable when a reason is provided', () => {
    const wrapper = mount(CheckboxList, {
      props: { label: 'Export', modelValue: [], isDisabled: true, disabledReason: 'Ask an administrator' },
      slots: { default: '<CheckboxListItem label="CSV" value="csv" />' },
      global: { components: { CheckboxListItem } },
    })
    const input = wrapper.get('input[type="checkbox"]')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(wrapper.text()).toContain('Ask an administrator')
  })

  it('shows a spinner while a change action is still running', async () => {
    let finish = () => {}
    const wrapper = mount(CheckboxList, {
      props: {
        'label': 'Export',
        'modelValue': [] as string[],
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value as string[] }),
        'changeAction': () => new Promise<void>((resolve) => {
          finish = resolve
        }),
      },
      slots: { default: '<CheckboxListItem label="CSV" value="csv" />' },
      global: { components: { CheckboxListItem } },
    })
    await wrapper.get('input[type="checkbox"]').setValue(true)
    expect(wrapper.find('.astryx-checkbox-spinner').exists()).toBe(true)
    expect(wrapper.get('input[type="checkbox"]').attributes('aria-busy')).toBe('true')
    finish()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.find('.astryx-checkbox-spinner').exists()).toBe(false)
  })

  it('shows a spinner for a loading row and blocks that row', async () => {
    const wrapper = mount(CheckboxList, {
      props: { label: 'Export', modelValue: [] },
      slots: {
        default: `
          <CheckboxListItem label="CSV" value="csv" :is-loading="true" />
          <CheckboxListItem label="JSON" value="json" />
        `,
      },
      global: { components: { CheckboxListItem } },
    })
    const inputs = wrapper.findAll('input[type="checkbox"]')
    expect(wrapper.find('.astryx-checkbox-spinner').exists()).toBe(true)
    expect(inputs[0]?.attributes('aria-busy')).toBe('true')
    await inputs[0]?.setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
