import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
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

  it('emits close when close button is clicked', async () => {
    const wrapper = mount(Toast, {
      props: { body: 'Message' },
    })

    await wrapper.find('.astryx-toast__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('auto-closes after duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Message', duration: 100, autoClose: true },
    })

    vi.advanceTimersByTime(100)
    expect(wrapper.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('pauses auto-close on mouseenter and resumes on mouseleave', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { body: 'Message', duration: 100, autoClose: true },
    })

    await wrapper.find('.astryx-toast').trigger('mouseenter')
    vi.advanceTimersByTime(200)
    expect(wrapper.emitted('close')).toBeFalsy()

    await wrapper.find('.astryx-toast').trigger('mouseleave')
    vi.advanceTimersByTime(100)
    expect(wrapper.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })
})
