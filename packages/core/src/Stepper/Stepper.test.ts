import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { resolveStepGlyph, shouldCollapseStepper } from './logic.js'
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

  it('shows a check for a finished step and a ring for the current step', () => {
    const wrapper = mount(Stepper, {
      props: { activeStep: 1 },
      slots: {
        default: `
          <Step :step="0" label="Cart" />
          <Step :step="1" label="Shipping" />
          <Step :step="2" label="Payment" />
        `,
      },
      global: { components: { Step } },
    })
    const items = wrapper.findAll('.astryx-step')
    expect(items[0].get('.astryx-step-indicator').attributes('data-glyph')).toBe('check')
    expect(items[1].get('.astryx-step-indicator').attributes('data-glyph')).toBe('ring')
    expect(items[2].get('.astryx-step-indicator').attributes('data-glyph')).toBe('number')
    expect(items[2].text()).toContain('3')
  })

  it('collapses below minimumStepWidth and moves with Previous and Next', async () => {
    vi.stubGlobal('ResizeObserver', class {
      constructor(private readonly callback: ResizeObserverCallback) {}

      observe() {
        this.callback([{ contentRect: { width: 300 } } as ResizeObserverEntry], this)
      }

      disconnect() {}

      unobserve() {}
    })
    const active = ref(2)
    const wrapper = mount(defineComponent({
      components: { Step, Stepper },
      setup() {
        return { active }
      },
      template: `
        <Stepper
          :active-step="active"
          :horizontal-options="{ minimumStepWidth: 112 }"
          :on-step-click="(index) => { active = index }"
        >
          <Step :step="0" label="Cart" />
          <Step :step="1" label="Shipping" />
          <Step :step="2" label="Payment" />
          <Step :step="3" label="Review" />
          <Step :step="4" label="Confirm" />
        </Stepper>
      `,
    }))
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.astryx-stepper-root').attributes('data-collapsed')).toBe('true')
    expect(wrapper.get('.astryx-stepper-summary').text()).toContain('Payment')
    await wrapper.get('[aria-label="Previous step"]').trigger('click')
    expect(active.value).toBe(1)
    expect(wrapper.get('.astryx-stepper-summary').text()).toContain('Shipping')
    vi.unstubAllGlobals()
  })

  it('collapses at 390px with the default minimum step width of 112', async () => {
    vi.stubGlobal('ResizeObserver', class {
      constructor(private readonly callback: ResizeObserverCallback) {}

      observe() {
        this.callback([{ contentRect: { width: 390 } } as ResizeObserverEntry], this)
      }

      disconnect() {}

      unobserve() {}
    })
    const wrapper = mount(defineComponent({
      components: { Step, Stepper },
      setup() {
        const active = ref(2)
        return { active }
      },
      template: `
        <Stepper :active-step="active" :on-step-click="(index) => { active = index }">
          <Step :step="0" label="Cart" />
          <Step :step="1" label="Shipping" />
          <Step :step="2" label="Payment" />
          <Step :step="3" label="Review" />
          <Step :step="4" label="Confirm" />
        </Stepper>
      `,
    }))
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.astryx-stepper-root').attributes('data-collapsed')).toBe('true')
    expect(wrapper.get('.astryx-stepper-summary').text()).toContain('Payment')
    expect(wrapper.find('[aria-label="Previous step"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Next step"]').exists()).toBe(true)
    vi.unstubAllGlobals()
  })
})

describe('stepper logic', () => {
  it('collapses only when the row is narrower than count times minimumStepWidth', () => {
    expect(shouldCollapseStepper(640, 5, undefined, 'horizontal')).toBe(false)
    expect(shouldCollapseStepper(390, 5, undefined, 'horizontal')).toBe(true)
    expect(shouldCollapseStepper(640, 5, 112, 'horizontal')).toBe(false)
    expect(shouldCollapseStepper(390, 5, 112, 'horizontal')).toBe(true)
    expect(shouldCollapseStepper(200, 5, undefined, 'vertical')).toBe(false)
    expect(resolveStepGlyph({ progress: 'completed', indicator: 'auto' })).toBe('check')
    expect(resolveStepGlyph({ progress: 'in-progress', indicator: 'auto' })).toBe('ring')
    expect(resolveStepGlyph({ progress: 'not-started', indicator: 'auto' })).toBe('number')
  })
})
