import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Dialog from '../Dialog/Dialog.vue'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import DateInput from './DateInput.vue'

enableAutoUnmount(afterEach)
beforeAll(ensureDialogModalApi)
afterEach(() => {
  document.body.innerHTML = ''
})

function pressBackdrop(): void {
  const dialog = document.querySelector('dialog') as HTMLDialogElement
  dialog.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }))
  dialog.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }))
  dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

describe('dateInput 在模态框里', () => {
  it('遮罩上的一下按压只关日历，下一下才关模态框', async () => {
    const date = ref<Date | null>(null)
    const Host = defineComponent({
      setup: () => () => h(Dialog, { isOpen: true, purpose: 'info' }, () => h(DateInput, {
        'label': 'Due',
        'presentation': 'popover',
        'modelValue': date.value,
        'onUpdate:modelValue': (value: Date | null) => {
          date.value = value
        },
      })),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await flushPromises()
    await wrapper.get('input').trigger('click')
    await flushPromises()
    const input = wrapper.get('input')
    expect(input.attributes('aria-expanded')).toBe('true')

    pressBackdrop()
    await flushPromises()
    expect(input.attributes('aria-expanded')).not.toBe('true')
    expect(wrapper.findComponent(Dialog).emitted('openChange')).toBeUndefined()

    pressBackdrop()
    expect(wrapper.findComponent(Dialog).emitted('openChange')).toEqual([[false]])
  })
})
