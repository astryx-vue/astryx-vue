import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import Token from './Token.vue'

describe('token', () => {
  it('renders the label and a prefix icon slot', () => {
    const wrapper = mount(Token, {
      props: { label: 'Ada' },
      slots: { icon: '<span class="icon">*</span>', end: '<span class="end">ok</span>' },
    })

    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.find('.icon').exists()).toBe(true)
    expect(wrapper.find('.end').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('exposes a focusable remove button and removes from the keyboard', async () => {
    const wrapper = mount(Token, { props: { label: 'Ada', removable: true } })
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Remove Ada')
    expect(button.attributes('disabled')).toBeUndefined()

    await button.trigger('click')
    await wrapper.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('remove')).toHaveLength(2)
  })

  it('keeps the remove button focusable and inert when disabled', async () => {
    const wrapper = mount(Token, {
      attachTo: document.body,
      props: { label: 'Ada', removable: true, disabled: true },
    })
    const button = wrapper.get('button.astryx-token-remove')

    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')

    ;(button.element as HTMLElement).focus()
    expect(document.activeElement).toBe(button.element)

    for (const key of ['Enter', ' ']) {
      const keydown = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      button.element.dispatchEvent(keydown)
      expect(keydown.defaultPrevented).toBe(true)
    }

    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    button.element.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    await wrapper.trigger('keydown', { key: 'Delete' })
    expect(wrapper.emitted('remove')).toBeUndefined()

    wrapper.unmount()
  })

  it('keeps the activation button focusable and inert when disabled', async () => {
    const onClick = vi.fn()
    const ancestorClick = vi.fn()
    const wrapper = mount(defineComponent({
      render: () => h('div', { onClick: ancestorClick }, [
        h(Token, { label: 'Ada', disabled: true, onClick }),
      ]),
    }), { attachTo: document.body })
    const button = wrapper.get('button.astryx-token-action')

    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')

    ;(button.element as HTMLElement).focus()
    expect(document.activeElement).toBe(button.element)

    for (const key of ['Enter', ' ']) {
      const keydown = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      button.element.dispatchEvent(keydown)
      expect(keydown.defaultPrevented).toBe(true)
    }

    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    button.element.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
    expect(ancestorClick).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('renders a link without nesting the remove button inside it', () => {
    const wrapper = mount(Token, { props: { label: 'Ada', href: '/ada', removable: true } })
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/ada')
    expect(link.element.contains(wrapper.get('button').element)).toBe(false)
  })

  it('renders the endContent slot after the label, before the remove button', () => {
    const wrapper = mount(Token, {
      props: { label: 'Ada', removable: true },
      slots: { endContent: '<span class="extra">2</span>' },
    })

    const children = [...(wrapper.element as HTMLElement).children]
    const extra = children.findIndex(child => child.classList.contains('extra'))
    const remove = children.findIndex(child => child.classList.contains('astryx-token-remove'))
    expect(extra).toBeGreaterThan(-1)
    expect(extra).toBeLessThan(remove)
  })

  it('uses a button for a click handler so the token can take focus', () => {
    const wrapper = mount(Token, { props: { label: 'Ada' }, attrs: { onClick: () => {} } })
    expect(wrapper.find('button.astryx-token-action').exists()).toBe(true)
  })
})
