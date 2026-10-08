import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import Dialog from './Dialog.vue'
import DialogHeader from './DialogHeader.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

describe('dialogHeader', () => {
  it('renders the title as a programmatically focusable heading', () => {
    const wrapper = mount(DialogHeader, { props: { title: 'Delete project' } })
    const title = wrapper.find('.astryx-dialog-header__title')

    expect(title.attributes('role')).toBe('heading')
    expect(title.attributes('aria-level')).toBe('2')
    expect(title.text()).toBe('Delete project')
    expect(title.attributes('tabindex')).toBe('-1')
    expect(title.attributes('data-dialog-default-focus')).toBe('')
  })

  it('renders the subtitle only when it is not empty', () => {
    const withSubtitle = mount(DialogHeader, { props: { title: 'Title', subtitle: 'Details' } })
    expect(withSubtitle.find('.astryx-dialog-header__subtitle').text()).toBe('Details')

    const withoutSubtitle = mount(DialogHeader, { props: { title: 'Title', subtitle: '' } })
    expect(withoutSubtitle.find('.astryx-dialog-header__subtitle').exists()).toBe(false)
  })

  it('omits the close button by default', () => {
    const wrapper = mount(DialogHeader, { props: { title: 'Title' } })

    expect(wrapper.find('.astryx-dialog-header__close').exists()).toBe(false)
  })

  it('emits openChange(false) from the close button', async () => {
    const wrapper = mount(DialogHeader, { props: { title: 'Title', hasCloseButton: true, closeButtonLabel: 'Dismiss' } })
    const close = wrapper.find('.astryx-dialog-header__close')

    expect(close.attributes('aria-label')).toBe('Dismiss')
    await close.trigger('click')

    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('renders start and end content slots', () => {
    const wrapper = mount(DialogHeader, {
      props: { title: 'Title' },
      slots: {
        startContent: () => h('span', { class: 'start-marker' }, 'Back'),
        endContent: () => h('span', { class: 'end-marker' }, 'Help'),
      },
    })

    expect(wrapper.find('.start-marker').exists()).toBe(true)
    expect(wrapper.find('.end-marker').exists()).toBe(true)
  })

  it('does not request default focus when rendered inline', () => {
    const wrapper = mount(Dialog, {
      props: { isOpen: true, isInline: true },
      slots: { default: () => h(DialogHeader, { title: 'Preview' }) },
    })

    expect(wrapper.find('.astryx-dialog-header__title').attributes('data-dialog-default-focus')).toBeUndefined()
  })
})
