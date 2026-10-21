import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { provideAstryxLocale } from '../locale/context.js'
import { defineTheme } from '../Theme/defineTheme.js'
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

  it('puts theme targets on the row, slots, title block, and close icon', () => {
    const wrapper = mount(DialogHeader, {
      props: { title: 'Title', hasCloseButton: true },
      slots: {
        startContent: () => h('span', 'Back'),
        endContent: () => h('span', 'Help'),
      },
    })

    expect(wrapper.get('.astryx-dialog-header-start-content').text()).toContain('Back')
    expect(wrapper.get('.astryx-dialog-header-title-block').text()).toContain('Title')
    expect(wrapper.get('.astryx-dialog-header-end-content').text()).toContain('Help')
    expect(wrapper.find('.astryx-dialog-header-close-icon').exists()).toBe(true)

    const theme = defineTheme({
      name: 'dialog-header-targets-test',
      components: {
        'dialog-header': { base: { gap: '8px' } },
        'dialog-header-start-content': { base: { gap: '5px' } },
        'dialog-header-title-block': { base: { gap: '4px' } },
        'dialog-header-end-content': { base: { gap: '6px' } },
        'dialog-header-close-icon': { base: { color: 'red' } },
      },
    })
    expect(theme.css).toContain('.astryx-dialog-header {')
    expect(theme.css).toContain('.astryx-dialog-header-start-content {')
    expect(theme.css).toContain('.astryx-dialog-header-title-block {')
    expect(theme.css).toContain('.astryx-dialog-header-end-content {')
    expect(theme.css).toContain('.astryx-dialog-header-close-icon {')
  })

  it('renders rich title and subtitle slots, and skips an empty subtitle', () => {
    const rich = mount(DialogHeader, {
      props: { title: 'Fallback', subtitle: '' },
      slots: {
        title: () => h('span', { class: 'rich-title' }, 'Rich'),
        subtitle: () => h('span', { class: 'rich-sub' }, 'More'),
      },
    })
    expect(rich.get('.rich-title').text()).toBe('Rich')
    expect(rich.get('.rich-sub').text()).toBe('More')
    expect(rich.get('.astryx-dialog-header__title').text()).toBe('Rich')

    const empty = mount(DialogHeader, { props: { title: 'Title', subtitle: '' } })
    expect(empty.find('.astryx-dialog-header__subtitle').exists()).toBe(false)
  })

  it('compensates the end slot on the axes that were asked for', () => {
    const automatic = mount(DialogHeader, { props: { title: 'Title', hasCloseButton: true } })
    const end = automatic.get('.astryx-dialog-header-end-content')
    expect(end.classes()).toContain('astryx-dialog-header__actions--compensate-block')
    expect(end.classes()).toContain('astryx-dialog-header__actions--compensate-inline')

    const inlineOnly = mount(DialogHeader, {
      props: { title: 'Title', hasCloseButton: true, endContentEdgeCompensation: 'inline' },
    })
    const inlineEnd = inlineOnly.get('.astryx-dialog-header-end-content')
    expect(inlineEnd.classes()).toContain('astryx-dialog-header__actions--compensate-inline')
    expect(inlineEnd.classes()).not.toContain('astryx-dialog-header__actions--compensate-block')

    const noClose = mount(DialogHeader, {
      props: { title: 'Title' },
      slots: { endContent: () => h('span', 'Help') },
    })
    const plainEnd = noClose.get('.astryx-dialog-header-end-content')
    expect(plainEnd.classes()).not.toContain('astryx-dialog-header__actions--compensate-inline')
    expect(plainEnd.classes()).not.toContain('astryx-dialog-header__actions--compensate-block')
  })

  it('names the close button in the active language', () => {
    const english = mount(DialogHeader, { props: { title: 'Title', hasCloseButton: true } })
    expect(english.get('.astryx-dialog-header__close').attributes('aria-label')).toBe('Close')

    const Host = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(DialogHeader, { title: '标题', hasCloseButton: true })
      },
    })
    expect(mount(Host).get('.astryx-dialog-header__close').attributes('aria-label')).toBe('关闭')
  })

  it('draws a bottom divider only when hasDivider is set', () => {
    const plain = mount(DialogHeader, { props: { title: 'Title' } })
    expect(plain.get('.astryx-dialog-header').classes()).not.toContain('astryx-dialog-header--divider')

    const divided = mount(DialogHeader, { props: { title: 'Title', hasDivider: true } })
    expect(divided.get('.astryx-dialog-header').classes()).toContain('astryx-dialog-header--divider')
  })
})
