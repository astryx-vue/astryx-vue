import type { TourDismissSource } from './context.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import Tour from './Tour.vue'
import TourStep from './TourStep.vue'
import { useTour } from './useTour.js'

beforeAll(() => {
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showPopover !== 'function')
    proto.showPopover = function (this: HTMLElement) { this.setAttribute('open', '') }
  if (typeof proto.hidePopover !== 'function')
    proto.hidePopover = function (this: HTMLElement) { this.removeAttribute('open') }
})

afterEach(() => {
  document.body.innerHTML = ''
})

async function flush(): Promise<void> {
  await nextTick()
  await flushPromises()
  await nextTick()
}

interface TourOptions {
  active?: boolean
  backdrop?: boolean
  count?: boolean
  onDismiss?: (source: TourDismissSource) => void
}

function mountTour(options: TourOptions = {}) {
  return mount(defineComponent({
    components: { Tour, TourStep },
    setup() {
      const active = ref(options.active ?? true)
      const first = shallowRef<HTMLElement | null>(null)
      const second = shallowRef<HTMLElement | null>(null)
      function dismiss(source: TourDismissSource): void {
        options.onDismiss?.(source)
        active.value = false
      }
      function setActive(next: boolean): void {
        active.value = next
      }
      return { active, first, second, dismiss, setActive, backdrop: options.backdrop ?? false, count: options.count ?? false }
    },
    template: `
      <button ref="first" type="button">Target A</button>
      <button ref="second" type="button">Target B</button>
      <Tour :is-active="active" :has-backdrop="backdrop" :is-step-count-shown="count" @dismiss="dismiss">
        <TourStep :target-ref="first" heading="First">First body</TourStep>
        <TourStep :target-ref="second" heading="Second">Second body</TourStep>
      </Tour>
    `,
  }), { attachTo: document.body })
}

describe('tour', () => {
  it('shows only the first step and advances/backtracks through the registered order', async () => {
    const wrapper = mountTour()
    await flush()
    expect(document.body.textContent).toContain('First')
    expect(document.body.textContent).not.toContain('Second')
    expect(document.querySelector('[aria-label="First"]')).not.toBeNull()

    const next = [...document.querySelectorAll('button')].find(button => button.textContent === 'Next')
    next?.click()
    await flush()
    expect(document.body.textContent).not.toContain('First body')
    expect(document.body.textContent).toContain('Second body')

    const back = [...document.querySelectorAll('button')].find(button => button.textContent === 'Back')
    back?.click()
    await flush()
    expect(document.body.textContent).toContain('First body')
    expect([...document.querySelectorAll('button')].some(button => button.textContent === 'Back')).toBe(false)
    wrapper.unmount()
  })

  it('uses Done on the last step and reports complete instead of another navigation', async () => {
    const onDismiss = vi.fn()
    const wrapper = mountTour({ onDismiss })
    await flush()
    const next = [...document.querySelectorAll('button')].find(button => button.textContent === 'Next')
    next?.click()
    await flush()
    const done = [...document.querySelectorAll('button')].find(button => button.textContent === 'Done')
    expect(done).toBeTruthy()
    done?.click()
    await flush()
    expect(onDismiss).toHaveBeenCalledWith('complete')
    expect(document.body.textContent).not.toContain('Second body')
    expect(document.querySelector('[data-testid="tour-highlight"]')).toBeNull()
    wrapper.unmount()
  })

  it('shows the current step count only when requested', async () => {
    const wrapper = mountTour({ count: true })
    await flush()
    expect(document.body.textContent).toContain('1 of 2')
    const next = [...document.querySelectorAll('button')].find(button => button.textContent === 'Next')
    next?.click()
    await flush()
    expect(document.body.textContent).toContain('2 of 2')
    wrapper.unmount()

    const plain = mountTour()
    await flush()
    expect(document.body.textContent).not.toContain('1 of 2')
    plain.unmount()
  })

  it('keeps the target unchanged and dismisses from the backdrop', async () => {
    const onDismiss = vi.fn()
    const wrapper = mountTour({ backdrop: true, onDismiss })
    await flush()
    expect(document.querySelector('[data-testid="tour-backdrop"]')).not.toBeNull()
    expect(document.querySelector('button')?.className).toBe('')
    const backdrop = document.querySelector<HTMLElement>('[data-testid="tour-backdrop"]')
    backdrop?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flush()
    expect(onDismiss).toHaveBeenCalledWith('backdrop')
    wrapper.unmount()
  })

  it('closes the whole tour with Escape', async () => {
    const onDismiss = vi.fn()
    const wrapper = mountTour({ onDismiss })
    await flush()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flush()
    expect(onDismiss).toHaveBeenCalledWith('close')
    expect(document.body.textContent).not.toContain('First body')
    wrapper.unmount()
  })

  it('renders no step while inactive and restarts at the first step when reactivated', async () => {
    const wrapper = mountTour({ active: false })
    await flush()
    expect(document.body.textContent).not.toContain('First body')
    wrapper.vm.setActive(true)
    await flush()
    expect(document.body.textContent).toContain('First body')
    const next = [...document.querySelectorAll('button')].find(button => button.textContent === 'Next')
    next?.click()
    await flush()
    expect(document.body.textContent).toContain('Second body')
    wrapper.vm.setActive(false)
    await flush()
    wrapper.vm.setActive(true)
    await flush()
    expect(document.body.textContent).toContain('First body')
    expect(document.body.textContent).not.toContain('Second body')
    wrapper.unmount()
  })

  it('renders nothing for an orphan step', () => {
    const wrapper = mount(TourStep, { props: { targetRef: ref(null), heading: 'Orphan' } })
    expect(wrapper.text()).toBe('')
    wrapper.unmount()
  })

  it('exposes step position through useTour and returns null outside a Tour', async () => {
    let value: ReturnType<typeof useTour> = null
    const Probe = defineComponent({
      setup() {
        value = useTour()
        return () => h('output', value ? `${value.activeStepIndex}:${value.stepCount}` : 'none')
      },
    })
    const wrapper = mount(defineComponent({
      setup: () => () => h(Tour, { isActive: true, onDismiss: () => {} }, { default: () => h(Probe) }),
    }))
    await flush()
    expect(value).toMatchObject({ activeStepIndex: 0, stepCount: 0, isFirstStep: true, isLastStep: false })
    wrapper.unmount()
    mount(Probe)
    expect(value).toBeNull()
  })
})
