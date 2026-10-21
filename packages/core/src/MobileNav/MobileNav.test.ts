import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import MobileNav from './MobileNav.vue'
import MobileNavToggle from './MobileNavToggle.vue'

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
})
