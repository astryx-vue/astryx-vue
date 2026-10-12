import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import ComplexSelector from './ComplexSelector.vue'

const Harness = defineComponent({
  components: { ComplexSelector },
  setup() {
    const value = ref('apple')
    const pending = ref(false)
    async function changeAction(): Promise<void> {
      pending.value = true
      await Promise.resolve()
      pending.value = false
    }
    return { changeAction, pending, value }
  },
  template: `
    <ComplexSelector
      v-model="value"
      label="Fruit"
      :trigger-label="value"
      :change-action="changeAction"
    >
      <template #default="{ commit, close }">
        <button type="button" data-testid="pear" @click="commit('pear'); close()">Pear</button>
      </template>
    </ComplexSelector>
  `,
})

describe('complex selector', () => {
  it('opens with arrow down and commits from the slot', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    const trigger = wrapper.get('button.astryx-complex-selector')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.text()).toContain('apple')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')

    const pear = document.body.querySelector('[data-testid="pear"]') as HTMLElement
    expect(pear).toBeTruthy()
    pear.click()
    await nextTick()
    expect(wrapper.vm.value).toBe('pear')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('does not open while disabled', async () => {
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Fruit', modelValue: 'apple', isDisabled: true },
      slots: { default: 'Body' },
    })
    const trigger = wrapper.get('button.astryx-complex-selector')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('disabled')).toBeDefined()
  })
})
