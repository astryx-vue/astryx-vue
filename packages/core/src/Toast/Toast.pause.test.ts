import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import LayerProvider from '../LayerProvider/LayerProvider.vue'
import { toastStore } from './store.js'
import Toast from './Toast.vue'
import ToastViewport from './ToastViewport.vue'
import { useToast } from './useToast.js'

function purge(): void {
  for (const toast of [...toastStore.toasts])
    toastStore.finalize(toast.id)
}

describe('toast auto-hide pause sources', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('keeps the timer held while focus is inside after the pointer leaves', async () => {
    const wrapper = mount(Toast, {
      attachTo: document.body,
      props: { body: 'Message', autoHideDuration: 1000 },
    })
    const card = wrapper.find('.astryx-toast')
    await card.trigger('mouseenter')
    await card.trigger('focusin')
    await card.trigger('mouseleave')
    vi.advanceTimersByTime(5000)
    expect(wrapper.emitted('dismiss')).toBeUndefined()

    await card.trigger('focusout')
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    wrapper.unmount()
  })

  it('keeps the timer held while the window is blurred after the pointer leaves', async () => {
    const wrapper = mount(Toast, { props: { body: 'Message', autoHideDuration: 1000 } })
    const card = wrapper.find('.astryx-toast')
    await card.trigger('mouseenter')
    window.dispatchEvent(new Event('blur'))
    await card.trigger('mouseleave')
    vi.advanceTimersByTime(5000)
    expect(wrapper.emitted('dismiss')).toBeUndefined()

    window.dispatchEvent(new Event('focus'))
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    wrapper.unmount()
  })

  it('starts held when raised while the window is in the background', () => {
    vi.spyOn(document, 'hasFocus').mockReturnValue(false)
    const wrapper = mount(Toast, { props: { body: 'Message', autoHideDuration: 1000 } })
    vi.advanceTimersByTime(5000)
    expect(wrapper.emitted('dismiss')).toBeUndefined()

    window.dispatchEvent(new Event('focus'))
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    wrapper.unmount()
  })

  it('restarts the countdown when timerKey changes', async () => {
    const wrapper = mount(Toast, { props: { body: 'Message', autoHideDuration: 1000, timerKey: 0 } })
    vi.advanceTimersByTime(900)
    await wrapper.setProps({ timerKey: 1 })
    vi.advanceTimersByTime(900)
    expect(wrapper.emitted('dismiss')).toBeUndefined()
    vi.advanceTimersByTime(100)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    wrapper.unmount()
  })
})

describe('toast viewport stack', () => {
  beforeEach(() => {
    purge()
  })

  afterEach(() => {
    vi.useRealTimers()
    purge()
    document.body.innerHTML = ''
  })

  it('starts the auto-hide countdown over when a uniqueID overwrite updates a toast', () => {
    const show = useToast()
    show({ body: 'a', uniqueID: 'u', autoClose: false })
    const before = toastStore.toasts[0].revision
    show({ body: 'b', uniqueID: 'u', autoClose: false })
    expect(toastStore.toasts[0].revision).toBe(before + 1)
  })

  it('hides the viewport box while no toast is shown', async () => {
    const wrapper = mount(ToastViewport, { attachTo: document.body })
    expect(document.querySelector('.astryx-toast-viewport--empty')).not.toBeNull()
    useToast()({ body: 'Hello' })
    await nextTick()
    expect(document.querySelector('.astryx-toast-viewport--empty')).toBeNull()
    wrapper.unmount()
  })

  it('moves focus to the next toast when the focused toast starts leaving', async () => {
    const wrapper = mount(ToastViewport, { attachTo: document.body })
    const show = useToast()
    const dismissFirst = show({ body: 'first', autoClose: false })
    show({ body: 'second', autoClose: false })
    await nextTick()

    const closes = document.querySelectorAll<HTMLButtonElement>('.astryx-toast__close')
    closes[0].focus()
    expect(document.activeElement).toBe(closes[0])

    dismissFirst()
    await nextTick()
    expect(document.activeElement).toBe(closes[1])
    wrapper.unmount()
  })

  it('returns focus to where it came from when the last toast leaves', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    const wrapper = mount(ToastViewport, { attachTo: document.body })
    const dismiss = useToast()({ body: 'only', autoClose: false })
    await nextTick()

    opener.focus()
    const close = document.querySelector<HTMLButtonElement>('.astryx-toast__close')!
    close.focus()
    dismiss()
    await nextTick()
    expect(document.activeElement).toBe(opener)
    wrapper.unmount()
  })

  it('removes a leaving toast pushed past the visible cap at once', async () => {
    const wrapper = mount(LayerProvider, {
      attachTo: document.body,
      props: { toast: { maxVisible: 1 } },
      slots: { default: () => h(ToastViewport) },
    })
    const show = useToast()
    const dismissFirst = show({ body: 'first', autoClose: false })
    await nextTick()
    dismissFirst()
    show({ body: 'second', autoClose: false })
    await nextTick()
    await nextTick()
    // 第一张还在离场，被第二张挤出可见上限：不等行的过渡结束就出栈。
    expect(toastStore.toasts.map(t => t.body)).toEqual(['second'])
    wrapper.unmount()
  })
})
