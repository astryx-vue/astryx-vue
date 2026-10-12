import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Collapsible from './Collapsible.vue'
import CollapsibleGroup from './CollapsibleGroup.vue'

function section(value: string, label: string) {
  return h(Collapsible, { trigger: label, value, defaultIsOpen: false }, () => label)
}

describe('collapsible group', () => {
  it('keeps a single section open', async () => {
    const wrapper = mount(CollapsibleGroup, {
      props: { defaultValue: 'one' },
      slots: {
        default: () => [section('one', 'One'), section('two', 'Two')],
      },
    })

    const triggers = wrapper.findAll('.astryx-collapsible-trigger')
    expect(triggers[0].attributes('aria-expanded')).toBe('true')
    expect(triggers[1].attributes('aria-expanded')).toBe('false')

    await triggers[1].trigger('click')
    expect(triggers[0].attributes('aria-expanded')).toBe('false')
    expect(triggers[1].attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('change')![0]).toEqual(['two'])

    await triggers[1].trigger('click')
    expect(triggers[1].attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('change')![1]).toEqual([''])
  })

  it('toggles sections independently in multiple mode', async () => {
    const wrapper = mount(CollapsibleGroup, {
      props: { type: 'multiple', defaultValue: ['one'] },
      slots: {
        default: () => [section('one', 'One'), section('two', 'Two')],
      },
    })

    await wrapper.findAll('.astryx-collapsible-trigger')[1].trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([['one', 'two']])
  })

  it('draws dividers and balanced density only when asked', () => {
    const wrapper = mount(CollapsibleGroup, {
      props: { hasDividers: true },
      slots: { default: () => section('one', 'One') },
    })
    expect(wrapper.get('.astryx-collapsible-group').attributes('data-density')).toBe('balanced')
    expect(wrapper.get('.astryx-collapsible').attributes('data-dividers')).toBe('true')
  })

  it('follows a controlled value', async () => {
    const Harness = defineComponent({
      components: { Collapsible, CollapsibleGroup },
      setup() {
        const value = ref('one')
        return { value }
      },
      template: `
        <CollapsibleGroup v-model:value="value">
          <Collapsible trigger="One" value="one" />
          <Collapsible trigger="Two" value="two" />
        </CollapsibleGroup>
      `,
    })
    const wrapper = mount(Harness)
    wrapper.vm.value = 'two'
    await wrapper.vm.$nextTick()
    const triggers = wrapper.findAll('.astryx-collapsible-trigger')
    expect(triggers[0].attributes('aria-expanded')).toBe('false')
    expect(triggers[1].attributes('aria-expanded')).toBe('true')
  })
})