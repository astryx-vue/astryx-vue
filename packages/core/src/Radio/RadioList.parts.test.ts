import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import RadioListItem from '../RadioList/RadioListItem.vue'
import RadioList from './RadioList.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())

describe('radioList 样式分层和富文本', () => {
  it('外壳吃 container，radiogroup 吃 control，根上的 class 留在外壳', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(RadioList, {
      props: {
        label: 'Size',
        modelValue: 's',
        containerClass: 'box-a',
        containerStyle: { marginTop: '7px' },
        controlClass: 'ctl-a',
        controlStyle: { marginBottom: '9px' },
        options: [{ label: 'Small', value: 's' }],
      },
      attrs: { 'class': 'root-a', 'data-testid': 'member' },
    })
    const field = wrapper.get('.astryx-field')
    const group = wrapper.get('[role="radiogroup"]')
    expect(field.classes()).toEqual(expect.arrayContaining(['box-a', 'root-a']))
    expect(field.classes()).not.toContain('ctl-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(group.classes()).toContain('ctl-a')
    expect(group.attributes('data-testid')).toBe('member')
    expect(wrapper.get('input').attributes('data-testid')).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })

  it('横向标签的表单里 container 不生效，并警告一次', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      setup: () => () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(RadioList, {
          label: 'Size',
          modelValue: 's',
          containerClass: 'box-a',
          controlClass: 'ctl-a',
          options: [{ label: 'Small', value: 's' }],
        }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(wrapper.get('[role="radiogroup"]').classes()).toContain('ctl-a')
    expect(warn.mock.calls.some(call => String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('富文本标题里的链接不会选中这一项，说明仍被读到', async () => {
    const wrapper = mount(RadioList, {
      props: { label: 'Plan', modelValue: 'free' },
      slots: {
        default: `
          <RadioListItem label="Pro" value="pro">
            <template #label><a class="pro-link" href="#pro">Pro details</a></template>
            <template #description>Billed yearly</template>
          </RadioListItem>
        `,
      },
      global: { components: { RadioListItem } },
    })
    const input = wrapper.get('input[value="pro"]')
    expect(input.attributes('aria-describedby')).toBeTruthy()
    expect(wrapper.text()).toContain('Billed yearly')
    await wrapper.get('a.pro-link').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect((input.element as HTMLInputElement).checked).toBe(false)
  })
})
