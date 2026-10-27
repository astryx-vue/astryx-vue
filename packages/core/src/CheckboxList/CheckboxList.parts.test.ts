import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import CheckboxList from './CheckboxList.vue'
import CheckboxListItem from './CheckboxListItem.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())

const item = () => h(CheckboxListItem, { label: 'Email', value: 'email' })

describe('checkboxList 样式分层', () => {
  it('外壳吃 container，group 吃 control，根上的 class 留在外壳', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(CheckboxList, {
      props: {
        label: 'Contact',
        modelValue: [],
        containerClass: 'box-a',
        containerStyle: { marginTop: '7px' },
        controlClass: 'ctl-a',
        controlStyle: { marginBottom: '9px' },
      },
      attrs: { 'class': 'root-a', 'data-testid': 'member', 'aria-details': 'details-id' },
      slots: { default: item },
    })
    const field = wrapper.get('.astryx-field')
    const group = wrapper.get('[role="group"]')
    expect(field.classes()).toEqual(expect.arrayContaining(['box-a', 'root-a', 'astryx-checkbox-list']))
    expect(field.classes()).not.toContain('ctl-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(group.classes()).toContain('ctl-a')
    expect(group.classes()).not.toContain('box-a')
    expect(group.classes()).not.toContain('root-a')
    expect((group.element as HTMLElement).style.marginBottom).toBe('9px')
    expect(group.attributes('data-testid')).toBe('member')
    expect(group.attributes('aria-details')).toBe('details-id')
    expect(group.attributes('aria-labelledby')).toBeTruthy()
    expect(wrapper.get('input').classes()).not.toContain('ctl-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('横向标签的表单里 container 不生效，并警告一次', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      setup: () => () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(CheckboxList, {
          label: 'Contact',
          modelValue: [],
          containerClass: 'box-a',
          controlClass: 'ctl-a',
        }, { default: item }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(wrapper.get('[role="group"]').classes()).toContain('ctl-a')
    expect(warn.mock.calls.some(call => String(call[0]).startsWith('CheckboxList:') && String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('富文本标题给复选框命名，说明挂在 aria-describedby 上，点链接不切换', async () => {
    const wrapper = mount(CheckboxList, {
      props: {
        'label': 'Contact',
        'modelValue': [] as string[],
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value as string[] }),
      },
      slots: {
        default: `
          <CheckboxListItem label="Email" value="email">
            <template #label><a class="terms" href="#terms">Terms</a></template>
            <template #description><span class="hint">Once a day</span></template>
          </CheckboxListItem>
        `,
      },
      global: { components: { CheckboxListItem } },
    })
    const input = wrapper.get('input')
    const labelledBy = input.attributes('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    expect(wrapper.get(`#${labelledBy}`).text()).toBe('Terms')
    expect(input.attributes('aria-labelledby')).not.toContain(wrapper.get('label').attributes('id') ?? 'missing')
    const described = input.attributes('aria-describedby')
    expect(wrapper.get(`#${described}`).text()).toContain('Once a day')
    await wrapper.get('a.terms').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('ariaLabel 覆盖富文本标题带来的名字', () => {
    const wrapper = mount(CheckboxList, {
      props: { label: 'Contact', modelValue: [] },
      slots: {
        default: `
          <CheckboxListItem label="Email" value="email" aria-label="Email updates">
            <template #label><a href="#terms">Terms</a></template>
          </CheckboxListItem>
        `,
      },
      global: { components: { CheckboxListItem } },
    })
    const input = wrapper.get('input')
    expect(input.attributes('aria-labelledby')).toBe(wrapper.get('label').attributes('id'))
    expect(wrapper.get('label').text()).toBe('Email updates')
  })
})
