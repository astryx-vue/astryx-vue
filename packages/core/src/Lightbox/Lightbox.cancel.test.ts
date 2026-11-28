import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Lightbox from './Lightbox.vue'

const media = [{ alt: 'Coast', src: '/coast.png' }]

describe('lightbox cancel', () => {
  it('ignores a cancel bubbling up from inside, such as a dismissed file picker', () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media } })

    const inner = new Event('cancel', { bubbles: true, cancelable: true })
    wrapper.get('img').element.dispatchEvent(inner)
    expect(inner.defaultPrevented).toBe(false)
    expect(wrapper.emitted('update:isOpen')).toBeUndefined()

    wrapper.unmount()
  })

  it('treats the cancel fired at the dialog itself as a close request', () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media } })

    const own = new Event('cancel', { cancelable: true })
    wrapper.get('dialog').element.dispatchEvent(own)
    expect(own.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:isOpen')?.[0]).toEqual([false])

    wrapper.unmount()
  })
})
