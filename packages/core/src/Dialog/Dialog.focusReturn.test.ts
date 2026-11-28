import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Dialog from './Dialog.vue'
import { ensureDialogModalApi } from './testUtils.js'

enableAutoUnmount(afterEach)
beforeAll(ensureDialogModalApi)

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

function toolbar() {
  const bar = document.createElement('div')
  const before = document.createElement('button')
  before.textContent = 'Before'
  const opener = document.createElement('button')
  opener.textContent = 'Open'
  const after = document.createElement('button')
  after.textContent = 'After'
  bar.append(before, opener, after)
  document.body.append(bar)
  return { bar, before, opener, after }
}

function renderDialog() {
  return mount(Dialog, {
    attachTo: document.body,
    props: { 'isOpen': false, 'aria-label': 'Settings' },
    slots: { default: () => h('button', { 'data-autofocus': '' }, 'Inside') },
  })
}

describe('dialog focus return', () => {
  it('leaves focus where the caller moved it before closing', async () => {
    const { opener, after } = toolbar()
    opener.focus()
    const wrapper = renderDialog()
    await wrapper.setProps({ isOpen: true })
    expect(document.activeElement?.textContent).toBe('Inside')

    after.focus()
    await wrapper.setProps({ isOpen: false })
    expect(document.activeElement).toBe(after)
  })

  it('goes to the tab stop that took the opener\'s place when the opener is gone', async () => {
    const { opener, after } = toolbar()
    opener.focus()
    const wrapper = renderDialog()
    await wrapper.setProps({ isOpen: true })

    opener.remove()
    await wrapper.setProps({ isOpen: false })
    expect(document.activeElement).toBe(after)
  })

  it('returns focus to its opener when it unmounts while open', async () => {
    const { opener } = toolbar()
    opener.focus()
    const Host = defineComponent({
      setup() {
        const isShown = ref(true)
        return { isShown }
      },
      render() {
        return this.isShown
          ? h(Dialog, { 'isOpen': true, 'aria-label': 'Settings' }, () => h('button', { 'data-autofocus': '' }, 'Inside'))
          : null
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await flushPromises()
    expect(document.activeElement?.textContent).toBe('Inside')

    ;(wrapper.vm as unknown as { isShown: boolean }).isShown = false
    await flushPromises()
    expect(document.activeElement).toBe(opener)
  })
})
