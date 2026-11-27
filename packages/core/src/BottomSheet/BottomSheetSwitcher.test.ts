import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import BottomSheet from './BottomSheet.vue'
import BottomSheetSwitcher from './BottomSheetSwitcher.vue'
import { getBottomSheetStackForTests, resetBottomSheetStackForTests } from './stack/bottomSheetStack.js'

/** 面板的过渡由测试手动走完：happy-dom 里过渡没有时长，交接会在同一拍里结束，看不到中间的样子。 */
const transitions = vi.hoisted(() => {
  const pending: Array<{ element: HTMLElement | null, property: string, complete: () => void }> = []
  return {
    pending,
    finish(element: Element | null, property: 'transform' | 'opacity'): void {
      const index = pending.findIndex(item => item.element === element && item.property === property)
      if (index < 0)
        throw new Error(`no pending ${property} transition`)
      const [item] = pending.splice(index, 1)
      item.complete()
    },
  }
})

vi.mock('./sheetTransition.js', () => ({
  waitForTransition: (element: HTMLElement | null, property: string, complete: () => void) => {
    const item = { element, property, complete }
    transitions.pending.push(item)
    return () => {
      const index = transitions.pending.indexOf(item)
      if (index >= 0)
        transitions.pending.splice(index, 1)
    }
  },
}))

enableAutoUnmount(afterEach)

function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function' && typeof proto.show === 'function')
    return
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.show = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

beforeAll(ensureDialogModalApi)

afterEach(() => {
  transitions.pending.length = 0
  document.body.innerHTML = ''
  resetDismissStackForTests()
  resetBottomSheetStackForTests()
  vi.restoreAllMocks()
})

const dialogs = (): HTMLDialogElement[] => [...document.querySelectorAll<HTMLDialogElement>('dialog')]
const panelOf = (dialog: HTMLDialogElement): HTMLElement => dialog.querySelector<HTMLElement>('.astryx-bottom-sheet')!

const Checkout = defineComponent({
  components: { BottomSheet, BottomSheetSwitcher },
  setup() {
    return { activeSheet: ref<string | null>(null), isExtraOpen: ref(false) }
  },
  template: `
    <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Checkout" id="checkout" data-testid="checkout">
      <BottomSheet sheet-id="details" label="Details">
        <button type="button" class="continue" @click="activeSheet = 'pay'">Continue</button>
      </BottomSheet>
      <BottomSheet sheet-id="pay" label="Pay">
        <p class="payment">Payment</p>
      </BottomSheet>
    </BottomSheetSwitcher>
    <BottomSheet v-model:is-open="isExtraOpen" label="Extra"><p>Extra</p></BottomSheet>
  `,
})

async function openCheckout() {
  const wrapper = mount(Checkout, { attachTo: document.body })
  wrapper.vm.activeSheet = 'details'
  await flushPromises()
  const [details, pay] = dialogs()
  transitions.finish(panelOf(details), 'transform')
  await flushPromises()
  return { wrapper, details, pay }
}

describe('bottomSheetSwitcher', () => {
  it('每一步各有自己的原生对话框，只有当前那步开着', async () => {
    const { details, pay } = await openCheckout()

    expect(details.open).toBe(true)
    expect(pay.open).toBe(false)
    expect(details.getAttribute('aria-label')).toBe('Checkout')
    expect(details.getAttribute('aria-modal')).toBe('true')
    expect(pay.querySelector('.astryx-bottom-sheet__positioner')?.hasAttribute('hidden')).toBe(true)
    // id 和 data-testid 只落在宿主那步上。
    expect(details.id).toBe('checkout')
    expect(details.dataset.testid).toBe('checkout')
    expect(pay.hasAttribute('id')).toBe(false)
    expect(pay.hasAttribute('data-testid')).toBe(false)
  })

  it('换步时新的一步在自己的对话框里升上来，上一步原地留着，进场走完后淡出、关掉', async () => {
    const { wrapper, details, pay } = await openCheckout()

    await wrapper.get('.continue').trigger('click')
    await flushPromises()

    expect(pay.open).toBe(true)
    expect(details.open).toBe(true)
    expect(panelOf(details).dataset.state).toBe('retained')
    expect(panelOf(details).dataset.motion).toBe('covered')
    expect(details.hasAttribute('inert')).toBe(true)
    expect(pay.id).toBe('checkout')
    expect(details.hasAttribute('id')).toBe(false)
    // 被留下的那步拿着流程的遮罩，进场那步的遮罩透明，页面不会被压暗两次。
    expect(details.style.getPropertyValue('--_sheet-scrim-opacity')).toBe('1')
    expect(pay.style.getPropertyValue('--_sheet-scrim-opacity')).toBe('0')

    transitions.finish(panelOf(pay), 'transform')
    await flushPromises()
    expect(panelOf(details).dataset.motion).toBe('fading')

    transitions.finish(panelOf(details), 'opacity')
    await flushPromises()
    expect(details.open).toBe(false)
    expect(pay.style.getPropertyValue('--_sheet-scrim-opacity')).toBe('1')
  })

  it('上一步比新的一步高时，同时往下移到新的一步停下的顶边', async () => {
    const { wrapper, details, pay } = await openCheckout()
    vi.spyOn(panelOf(details), 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 0, y: 100, width: 390, height: 600 }))
    vi.spyOn(panelOf(pay).parentElement!, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 0, y: 300, width: 390, height: 400 }))

    await wrapper.get('.continue').trigger('click')
    await flushPromises()

    expect(panelOf(details).dataset.motion).toBe('aligning')
    expect(panelOf(details).style.transform).toBe('translateY(200px)')
  })

  it('整段流程在底部面板叠放里只算一层，换步不会多出一层', async () => {
    const { wrapper, details } = await openCheckout()
    await wrapper.get('.continue').trigger('click')
    await flushPromises()
    expect(getBottomSheetStackForTests()).toHaveLength(1)

    wrapper.vm.isExtraOpen = true
    await flushPromises()

    const stack = getBottomSheetStackForTests()
    expect(stack).toHaveLength(2)
    expect(stack[1].element?.getAttribute('aria-label')).toBe('Extra')
    const pay = dialogs()[1]
    expect(pay.getAttribute('data-sheet-stack')).toBe('covered')
    expect(pay.hasAttribute('inert')).toBe(true)
    expect(details.hasAttribute('inert')).toBe(true)
  })

  it('写在一步内容里的面板只在那一步是当前那步时呈现，自己的 isOpen 不变', async () => {
    const Host = defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      setup() {
        return { activeSheet: ref<string | null>(null), isNestedOpen: ref(true) }
      },
      template: `
        <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Checkout">
          <BottomSheet sheet-id="details" label="Details">
            <BottomSheet v-model:is-open="isNestedOpen" label="Nested"><p>Nested</p></BottomSheet>
          </BottomSheet>
          <BottomSheet sheet-id="pay" label="Pay"><p>Pay</p></BottomSheet>
        </BottomSheetSwitcher>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const nested = (): HTMLDialogElement => document.querySelector<HTMLDialogElement>('dialog[aria-label="Nested"]')!
    await flushPromises()
    expect(nested().open).toBe(false)

    wrapper.vm.activeSheet = 'details'
    await flushPromises()
    expect(nested().open).toBe(true)

    wrapper.vm.activeSheet = 'pay'
    await flushPromises()
    transitions.finish(panelOf(nested()), 'transform')
    await flushPromises()
    expect(nested().open).toBe(false)
    expect(wrapper.vm.isNestedOpen).toBe(true)
  })

  it('报告取消请求，消费者可以留住流程', async () => {
    const host = (onCancel?: (event: Event) => void) => defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      setup() {
        return { activeSheet: ref<string | null>('details'), onCancel }
      },
      template: `
        <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Checkout" @cancel="onCancel">
          <BottomSheet sheet-id="details" label="Details"><p>Details</p></BottomSheet>
        </BottomSheetSwitcher>
      `,
    })

    const canceled: Event[] = []
    const blocking = mount(host((event) => {
      canceled.push(event)
      event.preventDefault()
    }), { attachTo: document.body })
    await flushPromises()
    dialogs()[0].dispatchEvent(new Event('cancel', { cancelable: true }))
    await flushPromises()
    expect(canceled).toHaveLength(1)
    expect(blocking.vm.activeSheet).toBe('details')
    blocking.unmount()

    const closing = mount(host(), { attachTo: document.body })
    await flushPromises()
    dialogs()[0].dispatchEvent(new Event('cancel', { cancelable: true }))
    await flushPromises()
    expect(closing.vm.activeSheet).toBeNull()
  })

  it('padding 照传给那一步的内容', async () => {
    const Host = defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      template: `
        <BottomSheetSwitcher active-sheet="details" label="Checkout">
          <BottomSheet sheet-id="details" label="Details" :padding="2"><p>Details</p></BottomSheet>
        </BottomSheetSwitcher>
      `,
    })
    mount(Host, { attachTo: document.body })
    await flushPromises()
    expect(document.querySelector('.astryx-bottom-sheet__content')?.getAttribute('data-padding')).toBe('2')
    expect(document.querySelector('.astryx-bottom-sheet')?.classList.contains('astryx-layer')).toBe(true)
  })
})
