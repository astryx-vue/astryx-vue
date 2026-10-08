import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { ensureDialogModalApi } from './testUtils.js'
import { useImperativeDialog } from './useImperativeDialog.js'

enableAutoUnmount(afterEach)
beforeAll(ensureDialogModalApi)

afterEach(() => {
  document.body.innerHTML = ''
})

const Demo = defineComponent({
  setup() {
    const dialog = useImperativeDialog({ purpose: 'form' })
    return () => h('div', [
      h('button', { class: 'open', onClick: () => dialog.show(() => h('p', { class: 'content' }, 'Shown')) }),
      h('button', { class: 'close', onClick: () => dialog.hide() }),
      h(dialog.Host),
    ])
  },
})

describe('useImperativeDialog', () => {
  it('shows content on show and hides it on hide', async () => {
    const wrapper = mount(Demo, { attachTo: document.body })
    const dialog = document.querySelector('dialog') as HTMLDialogElement

    expect(dialog.hasAttribute('open')).toBe(false)

    await wrapper.find('.open').trigger('click')
    await flushPromises()
    expect(dialog.hasAttribute('open')).toBe(true)
    expect(wrapper.find('.content').text()).toBe('Shown')

    await wrapper.find('.close').trigger('click')
    await flushPromises()
    expect(dialog.hasAttribute('open')).toBe(false)
  })

  it('closes when the dialog requests dismissal', async () => {
    const wrapper = mount(Demo, { attachTo: document.body })
    const dialog = document.querySelector('dialog') as HTMLDialogElement

    await wrapper.find('.open').trigger('click')
    await flushPromises()
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    await flushPromises()

    expect(dialog.hasAttribute('open')).toBe(false)
  })
})
