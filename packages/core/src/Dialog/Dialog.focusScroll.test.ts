import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Dialog from './Dialog.vue'
import { ensureDialogModalApi } from './testUtils.js'

enableAutoUnmount(afterEach)
beforeAll(ensureDialogModalApi)

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('dialog focus return scrolling', () => {
  it('returns focus to the opener without scrolling the page', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: { 'isOpen': false, 'aria-label': 'Settings' },
      slots: { default: () => h('button', { 'data-autofocus': '' }, 'Inside') },
    })
    await wrapper.setProps({ isOpen: true })

    const focus = vi.spyOn(opener, 'focus')
    await wrapper.setProps({ isOpen: false })

    expect(focus).toHaveBeenCalledWith(expect.objectContaining({ preventScroll: true }))
    expect(document.activeElement).toBe(opener)
  })
})
