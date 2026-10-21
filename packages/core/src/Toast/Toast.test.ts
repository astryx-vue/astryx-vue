import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Toast from './Toast.vue'

describe('toast', () => {
  it('renders body text and status role', () => {
    const wrapper = mount(Toast, {
      props: { body: 'Saved' },
    })

    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true)
  })

  it('uses alert role for error type', () => {
    const wrapper = mount(Toast, {
      props: { body: 'Failed', type: 'error' },
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.find('[aria-live="assertive"]').exists()).toBe(true)
  })

  it('adds the exiting class while the toast leaves', () => {
    const wrapper = mount(Toast, {
      props: { body: 'Saved', isExiting: true },
    })

    expect(wrapper.find('.astryx-toast--exiting').exists()).toBe(true)
  })

  it('renders end content after the message', () => {
    const wrapper = mount(Toast, {
      props: { body: 'Item deleted' },
      slots: { end: '<button type="button">Undo</button>' },
    })

    expect(wrapper.find('.astryx-toast__end').text()).toBe('Undo')
  })

  it('reports a manual dismissal from the close button', async () => {
    const wrapper = mount(Toast, {
      props: { body: 'Message' },
    })

    await wrapper.find('.astryx-toast__close').trigger('click')
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['manual'])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('hides itself after autoHideDuration and reports the auto reason', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Message', autoHideDuration: 100 },
    })

    vi.advanceTimersByTime(100)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    vi.useRealTimers()
  })

  it('keeps error toasts on screen when isAutoHide is not set', () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Failed', type: 'error', autoHideDuration: 100 },
    })

    vi.advanceTimersByTime(500)
    expect(wrapper.emitted('dismiss')).toBeUndefined()
    vi.useRealTimers()
  })

  it('accepts isAutoHide and autoClose, preferring the original names', () => {
    vi.useFakeTimers()
    const staying = mount(Toast, { props: { body: 'Message', isAutoHide: false, autoClose: true, autoHideDuration: 50 } })
    const leaving = mount(Toast, { props: { body: 'Message', isAutoHide: true, autoClose: false, autoHideDuration: 50 } })

    vi.advanceTimersByTime(100)
    expect(staying.emitted('dismiss')).toBeUndefined()
    expect(leaving.emitted('dismiss')?.[0]).toEqual(['auto'])
    vi.useRealTimers()
  })

  it('pauses auto-dismiss on hover and resumes on leave', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Message', autoHideDuration: 1000 },
    })

    await wrapper.find('.astryx-toast').trigger('mouseenter')
    vi.advanceTimersByTime(2000)
    expect(wrapper.emitted('dismiss')).toBeFalsy()

    await wrapper.find('.astryx-toast').trigger('mouseleave')
    vi.advanceTimersByTime(999)
    expect(wrapper.emitted('dismiss')).toBeUndefined()
    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    vi.useRealTimers()
  })

  it('leaves at least a second to read after a long pause', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Message', autoHideDuration: 1000 },
    })
    await wrapper.find('.astryx-toast').trigger('mouseenter')
    vi.advanceTimersByTime(5000)
    await wrapper.find('.astryx-toast').trigger('mouseleave')

    vi.advanceTimersByTime(999)
    expect(wrapper.emitted('dismiss')).toBeUndefined()
    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    vi.useRealTimers()
  })

  it('pauses while the window is not focused', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Message', autoHideDuration: 1000 },
    })

    window.dispatchEvent(new Event('blur'))
    vi.advanceTimersByTime(2000)
    expect(wrapper.emitted('dismiss')).toBeUndefined()

    window.dispatchEvent(new Event('focus'))
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['auto'])
    vi.useRealTimers()
  })

  it('replaces the whole card through the content slot and drops its own close button', async () => {
    const wrapper = mount(Toast, {
      props: { body: 'Item deleted', type: 'error', autoHideDuration: 1200, endContent: { render: () => 'Undo' } },
      slots: {
        content: `<template #content="{ body, isAutoHide, autoHideDuration, dismiss }">
          <button type="button" class="custom" @click="dismiss">{{ body }}|{{ isAutoHide }}|{{ autoHideDuration }}</button>
        </template>`,
      },
    })

    expect(wrapper.find('.astryx-toast__body').exists()).toBe(false)
    expect(wrapper.find('.astryx-toast__close').exists()).toBe(false)
    expect(wrapper.find('.custom').text()).toBe('Item deleted|false|1200')
    await wrapper.find('.custom').trigger('click')
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['manual'])
  })

  function touchEvent(type: string, x: number, y: number, touches: number): Event {
    const point = { identifier: 1, clientX: x, clientY: y }
    const extra = touches > 1 ? [{ identifier: 2, clientX: x, clientY: y }] : []
    const event = new Event(type, { bubbles: true, cancelable: true })
    const active = type === 'touchend' || type === 'touchcancel' ? [] : [point, ...extra]
    Object.defineProperty(event, 'touches', { value: active })
    Object.defineProperty(event, 'changedTouches', { value: [point] })
    return event
  }

  it('dismisses when a touch swipe passes the edge threshold', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 80,
      width: 200,
      height: 80,
      toJSON: () => ({}),
    })
    const wrapper = mount(Toast, { props: { body: 'Saved', isAutoHide: false } })
    const root = wrapper.get('.astryx-toast').element as HTMLElement

    root.dispatchEvent(touchEvent('touchstart', 0, 0, 1))
    root.dispatchEvent(touchEvent('touchmove', 0, 30, 1))
    root.dispatchEvent(touchEvent('touchend', 0, 60, 1))
    await nextTick()

    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['manual'])
    expect(root.style.getPropertyValue('--_toast-swipe-exit-y')).toBe('120%')
    vi.restoreAllMocks()
  })

  it('leaves a horizontal drag and a second finger to the page', async () => {
    const wrapper = mount(Toast, { props: { body: 'Saved', isAutoHide: false } })
    const root = wrapper.get('.astryx-toast').element as HTMLElement

    root.dispatchEvent(touchEvent('touchstart', 0, 0, 1))
    root.dispatchEvent(touchEvent('touchmove', 40, 2, 1))
    root.dispatchEvent(touchEvent('touchend', 40, 2, 1))
    expect(wrapper.emitted('dismiss')).toBeUndefined()
    expect(root.style.getPropertyValue('--_toast-swipe-y')).toBe('')

    root.dispatchEvent(touchEvent('touchstart', 0, 0, 2))
    root.dispatchEvent(touchEvent('touchmove', 0, 80, 1))
    root.dispatchEvent(touchEvent('touchend', 0, 80, 1))
    expect(wrapper.emitted('dismiss')).toBeUndefined()
  })

  it('does not start a swipe on the close button', async () => {
    const wrapper = mount(Toast, { props: { body: 'Saved', isAutoHide: false } })
    const close = wrapper.get('.astryx-toast__close').element as HTMLElement

    close.dispatchEvent(touchEvent('touchstart', 0, 0, 1))
    close.dispatchEvent(touchEvent('touchmove', 0, 80, 1))
    close.dispatchEvent(touchEvent('touchend', 0, 80, 1))
    await nextTick()
    expect(wrapper.emitted('dismiss')).toBeUndefined()
  })

  it('stops the timer once the toast starts leaving', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Message', autoHideDuration: 100 },
    })
    await wrapper.setProps({ isExiting: true })
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(wrapper.emitted('dismiss')).toBeUndefined()
    vi.useRealTimers()
  })
})
