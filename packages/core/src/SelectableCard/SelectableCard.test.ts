import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import SelectableCard from './SelectableCard.vue'

const Harness = defineComponent({
  components: { SelectableCard },
  setup() {
    const selected = ref(false)
    return { selected }
  },
  template: `
    <SelectableCard v-model:is-selected="selected" label="Pro plan">
      <span data-testid="title">Pro</span>
      <button type="button" data-testid="info">Details</button>
    </SelectableCard>
  `,
})

describe('selectable card', () => {
  it('toggles from the surface, space, and enter', async () => {
    const wrapper = mount(Harness)
    await wrapper.get('[data-testid="title"]').trigger('click')
    expect(wrapper.vm.selected).toBe(true)
    expect(wrapper.get('.astryx-card').attributes('data-selected')).toBe('true')

    const checkbox = wrapper.get('input[type="checkbox"]')
    await checkbox.setValue(false)
    expect(wrapper.vm.selected).toBe(false)

    await checkbox.trigger('keydown', { key: 'Enter' })
    expect(wrapper.vm.selected).toBe(true)
  })

  it('does not toggle when a nested button is clicked', async () => {
    const wrapper = mount(Harness)
    await wrapper.get('[data-testid="info"]').trigger('click')
    expect(wrapper.vm.selected).toBe(false)
  })

  it('ignores activation while disabled', async () => {
    const wrapper = mount(SelectableCard, {
      attachTo: document.body,
      props: { label: 'Pro', isSelected: false, isDisabled: true },
      slots: { default: 'Pro' },
    })
    await wrapper.get('.astryx-card').trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('aria-disabled')).toBe('true')
    input.element.focus()
    expect(document.activeElement).toBe(input.element)
    await input.trigger('keydown', { key: ' ' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.unmount()
  })

  it('marks an enabled card as pressable', () => {
    const wrapper = mount(SelectableCard, {
      props: { isSelected: false, label: 'Pro' },
      slots: { default: 'Pro' },
    })
    expect(wrapper.get('.astryx-card').attributes('data-astryx-pressable')).toBe('')
  })
})
