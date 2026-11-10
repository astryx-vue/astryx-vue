import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetScrollLockForTest } from '../composables/internal/scrollLock.js'
import { pushLayer, resetDismissStackForTests } from '../layer/dismissStack.js'
import MobileNav from './MobileNav.vue'
import MobileNavToggle from './MobileNavToggle.vue'

afterEach(() => {
  resetScrollLockForTest()
  resetDismissStackForTests()
  document.body.style.overflow = ''
  vi.useRealTimers()
})

describe('mobile-nav', () => {
  it('opens from the toggle, names the dialog, and closes from the close button', async () => {
    const Host = defineComponent({
      setup() {
        const open = ref(false)
        return () => h('div', [
          h(MobileNavToggle, {
            'isOpen': open.value,
            'onUpdate:isOpen': (value: boolean) => {
              open.value = value
            },
          }),
          h(MobileNav, {
            'header': 'Menu',
            'isOpen': open.value,
            'onUpdate:isOpen': (value: boolean) => {
              open.value = value
            },
          }, () => 'Inbox'),
        ])
      },
    })
    vi.useFakeTimers()
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('[aria-label="Open menu"]').trigger('click')
    await nextTick()

    const dialog = document.body.querySelector('dialog')
    expect(dialog?.hasAttribute('open')).toBe(true)
    expect(dialog?.classList.contains('astryx-layer')).toBe(true)
    expect(dialog?.textContent).toContain('Menu')
    expect(dialog?.textContent).toContain('Inbox')

    await wrapper.get('.astryx-mobile-nav__close').trigger('click')
    await nextTick()
    expect(document.body.querySelector('dialog')?.hasAttribute('open')).toBe(true)
    await vi.advanceTimersByTimeAsync(300)
    expect(document.body.querySelector('dialog')?.hasAttribute('open')).toBe(false)
    wrapper.unmount()
  })

  it('closes when the dialog cancels', async () => {
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Navigation' },
    })
    await nextTick()
    await wrapper.get('dialog').trigger('cancel')
    await nextTick()
    expect(wrapper.emitted('openChange')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('locks body scroll while open and gives it back on close', async () => {
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { isOpen: true },
    })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    vi.useFakeTimers()
    await wrapper.setProps({ isOpen: false })
    expect(document.body.style.overflow).toBe('')
    await vi.advanceTimersByTimeAsync(300)
    wrapper.unmount()
  })

  it('releases the scroll lock when an open drawer unmounts', async () => {
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { isOpen: true },
    })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('returns focus to the toggle that opened it', async () => {
    const Host = defineComponent({
      setup() {
        const open = ref(false)
        return () => h('div', [
          h(MobileNavToggle, {
            'isOpen': open.value,
            'onUpdate:isOpen': (value: boolean) => {
              open.value = value
            },
          }),
          h(MobileNav, {
            'isOpen': open.value,
            'onUpdate:isOpen': (value: boolean) => {
              open.value = value
            },
          }, () => 'Inbox'),
        ])
      },
    })
    vi.useFakeTimers()
    const wrapper = mount(Host, { attachTo: document.body })
    const toggle = wrapper.get('[aria-label="Open menu"]')
    ;(toggle.element as HTMLButtonElement).focus()
    await toggle.trigger('click')
    await nextTick()
    expect(document.body.querySelector('dialog')?.hasAttribute('open')).toBe(true)

    await wrapper.get('.astryx-mobile-nav__close').trigger('click')
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    expect(document.activeElement).toBe(toggle.element)
    wrapper.unmount()
  })

  it('keeps the native dialog and exit styling until the close delay ends', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { isOpen: true },
    })
    await nextTick()
    await wrapper.setProps({ isOpen: false })
    await nextTick()

    const dialog = wrapper.get('dialog')
    expect(dialog.attributes('open')).toBe('')
    expect(dialog.classes()).toContain('astryx-mobile-nav--closing')
    await vi.advanceTimersByTimeAsync(299)
    expect(dialog.attributes('open')).toBe('')
    await vi.advanceTimersByTimeAsync(1)
    expect(dialog.attributes('open')).toBeUndefined()
    expect(dialog.classes()).not.toContain('astryx-mobile-nav--closing')
    wrapper.unmount()
  })

  it('cancels a pending close when the drawer reopens', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { isOpen: true },
    })
    await nextTick()
    await wrapper.setProps({ isOpen: false })
    await nextTick()
    await wrapper.setProps({ isOpen: true })
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)

    expect(wrapper.get('dialog').attributes('open')).toBe('')
    expect(wrapper.get('dialog').classes()).not.toContain('astryx-mobile-nav--closing')
    wrapper.unmount()
  })

  it('closes without a delay when reduced motion is requested', async () => {
    const original = window.matchMedia
    window.matchMedia = vi.fn(() => ({ matches: true })) as unknown as typeof window.matchMedia
    try {
      const wrapper = mount(MobileNav, {
        attachTo: document.body,
        props: { isOpen: true },
      })
      await nextTick()
      await wrapper.setProps({ isOpen: false })
      await nextTick()

      expect(wrapper.get('dialog').attributes('open')).toBeUndefined()
      expect(wrapper.get('dialog').classes()).not.toContain('astryx-mobile-nav--closing')
      wrapper.unmount()
    }
    finally {
      window.matchMedia = original
    }
  })

  it('lets a nested layer take Escape before the drawer closes', async () => {
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Navigation' },
    })
    await nextTick()
    let nested = 0
    const stop = pushLayer({
      depth: 1,
      dismissOnEscape: 'close',
      dismissOnPointerOutside: true,
      getContainer: () => document.body.querySelector('dialog'),
      onDismiss: () => {
        nested += 1
      },
      token: {},
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(nested).toBe(1)
    expect(wrapper.emitted('openChange')).toBeFalsy()

    stop()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(wrapper.emitted('openChange')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})
