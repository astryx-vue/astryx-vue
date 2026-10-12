import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import Step from './Step.vue'
import Stepper from './Stepper.vue'

const Harness = defineComponent({
  components: { Step, Stepper },
  setup() {
    const active = ref(1)
    return { active }
  },
  template: `
    <Stepper :active-step="active" :on-step-click="(index) => { active = index }">
      <Step :step="0" label="Cart" />
      <Step :step="1" label="Shipping" description="Address" />
      <Step :step="2" label="Payment" :is-disabled="true" />
    </Stepper>
  `,
})

describe('stepper', () => {
  it('marks progress and activates a step from the keyboard', async () => {
    const wrapper = mount(Harness)
    const items = wrapper.findAll('.astryx-step')
    expect(items[0].attributes('data-progress')).toBe('completed')
    expect(items[1].attributes('aria-current')).toBe('step')
    expect(items[2].attributes('data-progress')).toBe('not-started')
    expect(wrapper.findAll('button.astryx-step-control')).toHaveLength(2)

    await wrapper.findAll('button.astryx-step-control')[0].trigger('keydown', { key: 'Enter' })
    await wrapper.findAll('button.astryx-step-control')[0].trigger('click')
    expect(wrapper.vm.active).toBe(0)
    expect(items[0].attributes('aria-current')).toBe('step')
  })

  it('stays static without a step click handler', () => {
    const wrapper = mount(Stepper, {
      props: { activeStep: 0 },
      slots: { default: '<span />' },
    })
    expect(wrapper.get('ol').attributes('aria-label')).toBe('Progress')
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
