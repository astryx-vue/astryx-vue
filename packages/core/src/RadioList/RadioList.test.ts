import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RadioList from '../Radio/RadioList.vue'
import RadioListItem from './RadioListItem.vue'

describe('radio list', () => {
  it('selects an item and lays the group out horizontally', async () => {
    const wrapper = mount(RadioList, {
      props: {
        'label': 'Size',
        'orientation': 'horizontal' as const,
        'modelValue': 'md',
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value as string }),
      },
      slots: {
        default: `
          <RadioListItem label="Small" value="sm" />
          <RadioListItem label="Medium" value="md" />
        `,
      },
      global: { components: { RadioListItem } },
    })
    expect(wrapper.get('.astryx-radio-group').attributes('data-orientation')).toBe('horizontal')
    expect(wrapper.get('.astryx-radio').attributes('data-size')).toBe('md')
    await wrapper.findAll('input[type="radio"]')[0]?.setValue()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['sm'])
  })

  it('renders end content', () => {
    const wrapper = mount(RadioList, {
      props: { label: 'Plan', modelValue: '' },
      slots: {
        default: '<RadioListItem label="Free" value="free"><template #end>$0/mo</template></RadioListItem>',
      },
      global: { components: { RadioListItem } },
    })
    expect(wrapper.get('.astryx-radio-end').text()).toBe('$0/mo')
  })

  it('keeps every option focusable when a disabledMessage explains the group', async () => {
    const wrapper = mount(RadioList, {
      props: {
        label: 'Notification preference',
        modelValue: 'email',
        isDisabled: true,
        disabledMessage: 'Upgrade your account to change preferences',
      },
      slots: { default: '<RadioListItem label="Email" value="email" />' },
      global: { components: { RadioListItem } },
      attachTo: document.body,
    })
    const input = wrapper.get('input[type="radio"]')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('form')).toBe('')
    expect(input.attributes('aria-describedby')).toContain('astryx-radio-group')

    await input.trigger('click')
    expect((input.element as HTMLInputElement).checked).toBe(true)
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('stays natively disabled without a disabledMessage', () => {
    const wrapper = mount(RadioList, {
      props: { label: 'Plan', modelValue: 'free', isDisabled: true },
      slots: { default: '<RadioListItem label="Free" value="free" />' },
      global: { components: { RadioListItem } },
    })
    expect(wrapper.get('input[type="radio"]').attributes('disabled')).toBe('')
  })
})
