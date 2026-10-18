import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { toastStore } from './store.js'
import ToastViewport from './ToastViewport.vue'
import { useToast } from './useToast.js'

function purge() {
  for (const toast of [...toastStore.toasts])
    toastStore.finalize(toast.id)
}

describe('useToast', () => {
  beforeEach(() => {
    purge()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a toast and returns a dismiss function that exits it', () => {
    const toast = useToast()

    const dismiss = toast({ body: 'Hello' })
    expect(toastStore.toasts).toHaveLength(1)
    expect(toastStore.toasts[0].body).toBe('Hello')

    dismiss()
    expect(toastStore.toasts[0].isExiting).toBe(true)
  })

  it('keeps an exiting toast mounted until its exit transition settles', () => {
    vi.useFakeTimers()
    const toast = useToast()

    const dismiss = toast({ body: 'Hello' })
    dismiss()
    expect(toastStore.toasts).toHaveLength(1)

    vi.advanceTimersByTime(400)
    expect(toastStore.toasts).toHaveLength(0)
  })

  it('overwrites a toast that reuses uniqueID', () => {
    const toast = useToast()
    toast({ body: 'Uploading… 10%', uniqueID: 'upload', autoClose: false })
    toast({ body: 'Uploading… 40%', uniqueID: 'upload', collisionBehavior: 'overwrite', autoClose: false })

    expect(toastStore.toasts).toHaveLength(1)
    expect(toastStore.toasts[0].body).toBe('Uploading… 40%')
  })

  it('ignores a toast whose uniqueID is already visible', () => {
    const toast = useToast()
    toast({ body: 'You are offline', uniqueID: 'offline', collisionBehavior: 'ignore', autoClose: false })
    const dismiss = toast({ body: 'You are offline', uniqueID: 'offline', collisionBehavior: 'ignore', autoClose: false })

    expect(toastStore.toasts).toHaveLength(1)
    expect(toastStore.toasts[0].body).toBe('You are offline')
    dismiss()
    expect(toastStore.toasts[0].isExiting).toBe(false)
  })

  it('exits every toast on clear', () => {
    const toast = useToast()
    toast({ body: 'One' })
    toast({ body: 'Two' })

    toast.clear()
    expect(toastStore.toasts).toHaveLength(2)
    expect(toastStore.toasts.every(t => t.isExiting)).toBe(true)
  })

  it('renders toasts in the viewport', () => {
    const toast = useToast()
    toast({ body: 'Rendered' })

    mount(ToastViewport)
    expect(document.body.textContent).toContain('Rendered')
  })

  it('plays the exit transition in the DOM before removing the toast', async () => {
    vi.useFakeTimers()
    const toast = useToast()
    const wrapper = mount(ToastViewport, { attachTo: document.body })

    toast({ body: 'Leaving' })
    await nextTick()
    expect(document.body.querySelector('.astryx-toast')).not.toBeNull()

    toast.dismiss(toastStore.toasts[0].id)
    await nextTick()
    expect(document.body.querySelector('.astryx-toast--exiting')).not.toBeNull()

    vi.advanceTimersByTime(400)
    await nextTick()
    expect(document.body.querySelector('.astryx-toast')).toBeNull()

    wrapper.unmount()
  })

  it('wraps each toast in a collapsing row', async () => {
    const toast = useToast()
    const wrapper = mount(ToastViewport, { attachTo: document.body })

    toast({ body: 'Stacked' })
    await nextTick()

    const row = document.body.querySelector('.astryx-toast-viewport__row--from-bottom')
    expect(row).not.toBeNull()
    expect(row?.querySelector('.astryx-toast-viewport__clip .astryx-toast')).not.toBeNull()

    wrapper.unmount()
  })

  it('resolves isAutoHide from the toast type and keeps the older names', () => {
    const toast = useToast()
    toast({ body: 'Info' })
    toast({ body: 'Error', type: 'error' })
    toast({ body: 'Sticky', isAutoHide: false })
    toast({ body: 'Legacy off', autoClose: false })
    toast({ body: 'Legacy duration', autoHideDuration: 1200 })
    toast({ body: 'Legacy duration alias', duration: 900 })

    const [info, error, sticky, legacyOff, explicit, legacyDuration] = toastStore.toasts
    expect(info.isAutoHide).toBe(true)
    expect(error.isAutoHide).toBe(false)
    expect(sticky.isAutoHide).toBe(false)
    expect(legacyOff.isAutoHide).toBe(false)
    expect(info.autoHideDuration).toBe(5000)
    expect(explicit.autoHideDuration).toBe(1200)
    expect(legacyDuration.autoHideDuration).toBe(900)
  })

  it('reports a programmatic dismissal through onHide only', () => {
    vi.useFakeTimers()
    const toast = useToast()
    const onDismiss = vi.fn()
    const onHide = vi.fn()

    const dismiss = toast({ body: 'Saved', isAutoHide: false, onDismiss, onHide })
    dismiss()
    dismiss()

    expect(onDismiss).not.toHaveBeenCalled()
    expect(onHide).toHaveBeenCalledTimes(1)
    expect(onHide).toHaveBeenCalledWith('manual')
    vi.useRealTimers()
  })

  it('reports a card dismissal through onDismiss and then onHide', async () => {
    vi.useFakeTimers()
    const toast = useToast()
    const calls: string[] = []
    const wrapper = mount(ToastViewport, { attachTo: document.body })

    toast({
      body: 'Uploaded',
      autoHideDuration: 100,
      onDismiss: reason => calls.push(`dismiss:${reason}`),
      onHide: reason => calls.push(`hide:${reason}`),
    })
    await nextTick()

    vi.advanceTimersByTime(100)
    await nextTick()
    expect(calls).toEqual(['dismiss:auto', 'hide:auto'])
    expect(toastStore.toasts[0].isExiting).toBe(true)

    wrapper.unmount()
    vi.useRealTimers()
  })
})
