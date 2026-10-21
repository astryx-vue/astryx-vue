import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Dialog from '../Dialog/Dialog.vue'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import { resetModalOutletsForTests } from '../layer/modalOutlet.js'
import { toastStore } from './store.js'
import ToastViewport from './ToastViewport.vue'
import { useToast } from './useToast.js'

enableAutoUnmount(afterEach)

beforeAll(ensureDialogModalApi)

afterEach(() => {
  for (const toast of [...toastStore.toasts])
    toastStore.finalize(toast.id)
  resetModalOutletsForTests()
  document.body.innerHTML = ''
})

function showToast(body: string): void {
  useToast()({ body, isAutoHide: false })
}

describe('toast viewport and an open dialog', () => {
  it('moves into the open dialog so it stays visible above it', async () => {
    const dialog = mount(Dialog, {
      attachTo: document.body,
      props: { isOpen: true },
      slots: { default: () => h('p', 'Body') },
    })
    const viewport = mount(ToastViewport, { attachTo: document.body })

    showToast('Saved')
    await nextTick()

    const element = document.body.querySelector('.astryx-toast-viewport')
    const dialogEl = document.body.querySelector('dialog')
    expect(element).not.toBeNull()
    expect(element?.classList.contains('astryx-layer')).toBe(true)
    expect(dialogEl?.contains(element ?? null)).toBe(true)

    viewport.unmount()
    dialog.unmount()
  })

  it('goes back to the body once the dialog closes', async () => {
    const dialog = mount(Dialog, {
      attachTo: document.body,
      props: { isOpen: true },
      slots: { default: () => h('p', 'Body') },
    })
    const viewport = mount(ToastViewport, { attachTo: document.body })

    showToast('Saved')
    await nextTick()
    expect(document.body.querySelector('dialog')?.contains(document.querySelector('.astryx-toast-viewport'))).toBe(true)

    await dialog.setProps({ isOpen: false })
    await nextTick()

    const element = document.body.querySelector('.astryx-toast-viewport')
    expect(element?.parentElement).toBe(document.body)

    viewport.unmount()
    dialog.unmount()
  })
})
