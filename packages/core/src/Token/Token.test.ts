import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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

  it('does not remove a disabled token', async () => {
    const wrapper = mount(Token, { props: { label: 'Ada', removable: true, disabled: true } })
    await wrapper.get('button').trigger('click')
    await wrapper.trigger('keydown', { key: 'Delete' })
    expect(wrapper.emitted('remove')).toBeUndefined()
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
