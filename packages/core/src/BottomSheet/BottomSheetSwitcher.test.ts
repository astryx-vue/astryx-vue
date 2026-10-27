import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import BottomSheet from './BottomSheet.vue'
import BottomSheetSwitcher from './BottomSheetSwitcher.vue'

enableAutoUnmount(afterEach)

function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function' && typeof proto.show === 'function')
    return
  Object.defineProperty(proto, 'open', {
    configurable: true,
    get(this: HTMLDialogElement) {
      return this.hasAttribute('open')
    },
    set(this: HTMLDialogElement, value: boolean) {
      if (value)
        this.setAttribute('open', '')
      else
        this.removeAttribute('open')
    },
  })
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
  document.body.innerHTML = ''
  resetDismissStackForTests()
})

describe('bottomSheetSwitcher', () => {
  it('shows one sheet at a time inside a shared dialog', async () => {
    const Host = defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      setup() {
        const activeSheet = ref<string | null>('details')
        return { activeSheet }
      },
      template: `
        <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Checkout">
          <BottomSheet sheet-id="details" label="Details">
            <button type="button" @click="activeSheet = 'pay'">Continue</button>
          </BottomSheet>
          <BottomSheet sheet-id="pay" label="Pay">
            <p>Payment</p>
          </BottomSheet>
        </BottomSheetSwitcher>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const dialog = document.querySelector('dialog')
    expect(dialog?.open).toBe(true)
    expect(dialog?.getAttribute('aria-label')).toBe('Checkout')
    expect(document.body.textContent).toContain('Continue')
    expect(document.body.textContent).not.toContain('Payment')
    expect(document.querySelectorAll('dialog')).toHaveLength(1)

    await wrapper.get('button').trigger('click')
    expect(document.body.textContent).toContain('Payment')
    expect(wrapper.vm.activeSheet).toBe('pay')
    wrapper.unmount()
  })

  it('reports a cancel request and lets the consumer keep the flow open', async () => {
    const host = (onCancel?: (event: Event) => void) => defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      setup() {
        const activeSheet = ref<string | null>('details')
        return { activeSheet, onCancel }
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
    const dialog = document.querySelector('dialog') as HTMLDialogElement
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    await nextTick()
    expect(canceled).toHaveLength(1)
    expect(blocking.vm.activeSheet).toBe('details')
    blocking.unmount()

    const closing = mount(host(), { attachTo: document.body })
    const closingDialog = document.querySelector('dialog') as HTMLDialogElement
    closingDialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    await nextTick()
    expect(closing.vm.activeSheet).toBeNull()
    closing.unmount()
  })

  it('passes an explicit padding step through to the shared sheet content', async () => {
    const Host = defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      setup() {
        const activeSheet = ref<string | null>('details')
        return { activeSheet }
      },
      template: `
        <BottomSheetSwitcher v-model:active-sheet="activeSheet" label="Checkout">
          <BottomSheet sheet-id="details" label="Details" :padding="2">
            <p>Details</p>
          </BottomSheet>
        </BottomSheetSwitcher>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    expect(document.querySelector('.astryx-bottom-sheet__content')?.getAttribute('data-padding')).toBe('2')
    expect(document.querySelector('.astryx-bottom-sheet')?.classList.contains('astryx-layer')).toBe(true)
    wrapper.unmount()
  })

  it('passes extra attributes through to the dialog', () => {
    const wrapper = mount(BottomSheetSwitcher, { attrs: { 'data-testid': 'switcher', 'id': 'my-switcher' } })
    const dialog = wrapper.get('dialog')
    expect(dialog.attributes('data-testid')).toBe('switcher')
    expect(dialog.attributes('id')).toBe('my-switcher')
  })
})
