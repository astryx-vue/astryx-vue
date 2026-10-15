import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
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
})
