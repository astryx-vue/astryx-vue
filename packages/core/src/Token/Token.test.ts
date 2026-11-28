import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { linkComponentKey } from '../LinkProvider/context.js'
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

describe('token disabled state', () => {
  it('reflects the disabled state on the root in every structure', () => {
    const structures = [
      { label: 'Static' },
      { label: 'Clickable', onClick: () => {} },
      { label: 'Link', href: '/docs' },
      { label: 'Link with remove', href: '/docs', removable: true },
    ]
    for (const props of structures) {
      const wrapper = mount(Token, { props: { ...props, disabled: true } })
      expect(wrapper.attributes('data-disabled'), props.label).toBe('true')
    }
    expect(mount(Token, { props: { label: 'Enabled', href: '/docs' } }).attributes('data-disabled')).toBeUndefined()
  })

  it('keeps a disabled link token a focusable link with no destination', () => {
    const LinkStub = defineComponent({
      props: { to: String },
      setup: (_, { slots }) => () => h('a', { 'data-router': '' }, slots.default?.()),
    })
    const onRemove = vi.fn()
    const wrapper = mount(defineComponent({
      render: () => h('div', [
        h(Token, { label: 'Docs', href: '/docs', disabled: true }),
        h(Token, { label: 'Guide', href: '/guide', disabled: true, removable: true, onRemove }),
      ]),
    }), { attachTo: document.body, global: { provide: { [linkComponentKey as symbol]: LinkStub } } })

    const links = wrapper.findAll('[role="link"]')
    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(link.element.tagName).toBe('A')
      expect(link.attributes('data-router')).toBeUndefined()
      expect(link.attributes('aria-disabled')).toBe('true')
      expect(link.attributes('href')).toBeUndefined()
      expect(link.attributes('tabindex')).toBe('0')
    }

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    links[1]!.element.dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    expect(onRemove).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('passes other keys to a disabled link token\'s keydown listener, but not Enter or Space', async () => {
    const onKeydown = vi.fn()
    const wrapper = mount(Token, { props: { label: 'Docs', href: '/docs', disabled: true }, attrs: { onKeydown } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(onKeydown).toHaveBeenCalledTimes(1)
    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(onKeydown).toHaveBeenCalledTimes(1)
  })
})

describe('token link click listener', () => {
  function stopNavigation(element: Element): void {
    element.addEventListener('click', event => event.preventDefault())
  }

  it('calls a click listener once when a link token is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Token, { props: { label: 'Tag', href: '/test' }, attrs: { onClick } })
    stopNavigation(wrapper.element)
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.attributes('href')).toBe('/test')
  })

  it('calls a click listener once when the link of a removable token is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Token, { props: { label: 'Tag', href: '/test', removable: true }, attrs: { onClick } })
    const link = wrapper.get('a')
    stopNavigation(link.element)
    await link.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call the click listener when the remove button is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Token, { props: { label: 'Tag', href: '/test', removable: true }, attrs: { onClick } })
    await wrapper.get('button.astryx-token-remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('token action attributes', () => {
  const ACTION_ARIA = ['aria-labelledby', 'aria-describedby', 'aria-haspopup', 'aria-expanded', 'aria-pressed']

  it('passes naming, popup and pressed attributes to a clickable token\'s inner button', () => {
    const wrapper = mount(Token, {
      props: { label: 'Status' },
      attrs: {
        'onClick': () => {},
        'aria-labelledby': 'field-label',
        'aria-describedby': 'field-hint',
        'aria-haspopup': 'dialog',
        'aria-expanded': false,
        'aria-pressed': true,
      },
    })
    const button = wrapper.get('button.astryx-token-action')
    expect(button.attributes('aria-labelledby')).toBe('field-label')
    expect(button.attributes('aria-describedby')).toBe('field-hint')
    expect(button.attributes('aria-haspopup')).toBe('dialog')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(button.attributes('aria-pressed')).toBe('true')
    for (const name of ACTION_ARIA)
      expect(wrapper.attributes(name), name).toBeUndefined()
  })

  it('keeps those attributes on the root of a static token', () => {
    const wrapper = mount(Token, { props: { label: 'Status' }, attrs: { 'aria-describedby': 'hint' } })
    expect(wrapper.attributes('aria-describedby')).toBe('hint')
  })
})

describe('token label direction', () => {
  it('lays out a label with no right-to-left letter left to right', () => {
    expect(mount(Token, { props: { label: '@alice' } }).get('.astryx-token-label').attributes('dir')).toBe('ltr')
    expect(mount(Token, { props: { label: 'C++', removable: true } }).get('.astryx-token-label').attributes('dir')).toBe('ltr')
    expect(mount(Token, { props: { label: 'iPhone \u062C\u062F\u064A\u062F' } }).get('.astryx-token-label').attributes('dir')).toBeUndefined()
  })
})
