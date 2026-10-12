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
})
