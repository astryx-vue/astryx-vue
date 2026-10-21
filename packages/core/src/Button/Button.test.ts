import { flushPromises, mount } from '@vue/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Icon from '../Icon/Icon.vue'
import Button from './Button.vue'

function createDeferred(): {
  promise: Promise<void>
  reject: (reason?: unknown) => void
  resolve: () => void
} {
  let rejectPromise: (reason?: unknown) => void = () => {}
  let resolvePromise: () => void = () => {}
  const promise = new Promise<void>((resolve, reject) => {
    rejectPromise = reject
    resolvePromise = resolve
  })

  return {
    promise,
    reject: rejectPromise,
    resolve: resolvePromise,
  }
}

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('button', () => {
  it('renders a secondary medium button with a safe native type by default', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Save changes',
      },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toContain('Save changes')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('maps default, icon, and end content to Vue slots', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Accessible action',
      },
      slots: {
        default: 'Visible action',
        end: '<span data-testid="end">3</span>',
        icon: '<svg data-testid="icon" />',
      },
    })

    expect(wrapper.text()).toContain('Visible action')
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="end"]').exists()).toBe(true)
    expect(wrapper.find('.astryx-button__icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.astryx-button__end').attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Accessible action')
  })

  it('renders icon-only content with label as its accessible name', () => {
    const wrapper = mount(Button, {
      props: {
        isIconOnly: true,
        label: 'Open settings',
      },
      slots: {
        end: '<span data-testid="end">ignored</span>',
        icon: '<svg data-testid="icon" />',
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('Open settings')
    expect(wrapper.attributes('data-icon-only')).toBe('true')
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="end"]').exists()).toBe(false)
    expect(wrapper.find('.astryx-button__label').exists()).toBe(false)
  })

  it('forwards native attributes, class, style, and form properties', () => {
    const wrapper = mount(Button, {
      attrs: {
        'aria-controls': 'dialog',
        'class': 'product-action',
        'data-testid': 'save',
        'id': 'save-button',
        'style': 'margin-top: 4px;',
      },
      props: {
        form: 'settings-form',
        label: 'Save',
        name: 'intent',
        type: 'submit',
        value: 'save',
      },
    })

    expect(wrapper.attributes('aria-controls')).toBe('dialog')
    expect(wrapper.attributes('data-testid')).toBe('save')
    expect(wrapper.attributes('form')).toBe('settings-form')
    expect(wrapper.attributes('id')).toBe('save-button')
    expect(wrapper.attributes('name')).toBe('intent')
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.attributes('value')).toBe('save')
    expect(wrapper.classes()).toContain('product-action')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  })

  it('reflects variant and size as data attributes, not bare value classes', () => {
    const wrapper = mount(Button, { props: { label: 'Save', variant: 'primary', size: 'sm' } })
    expect(wrapper.classes()).toEqual(['astryx-button'])
    expect(wrapper.attributes('data-variant')).toBe('primary')
    expect(wrapper.attributes('data-size')).toBe('sm')
  })

  it('formats numeric width as pixels and preserves CSS string widths', async () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Continue',
        width: 240,
      },
    })

    expect(wrapper.attributes('style')).toContain('--astryx-button-width: 240px')

    await wrapper.setProps({ width: 'min(100%, 32rem)' })

    expect(wrapper.attributes('style')).toContain('--astryx-button-width: min(100%, 32rem)')
  })

  it('emits click before running clickAction', async () => {
    const order: string[] = []
    const clickAction = vi.fn(() => {
      order.push('action')
    })
    const onClick = vi.fn(() => {
      order.push('click')
    })
    const wrapper = mount(Button, {
      props: {
        clickAction,
        label: 'Run',
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(order).toEqual(['click', 'action'])
    expect(clickAction).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('lets a click listener prevent clickAction', async () => {
    const clickAction = vi.fn()
    const wrapper = mount(Button, {
      props: {
        clickAction,
        label: 'Run',
        onClick: (event: MouseEvent) => event.preventDefault(),
      },
    })

    await wrapper.trigger('click')

    expect(clickAction).not.toHaveBeenCalled()
  })

  it('sets loading semantics while clickAction is pending and clears them after settle', async () => {
    const deferred = createDeferred()
    const wrapper = mount(Button, {
      props: {
        clickAction: () => deferred.promise,
        label: 'Save',
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBe('')
    expect(wrapper.attributes('data-delay-spinner')).toBe('true')
    expect(wrapper.find('.astryx-button__spinner').exists()).toBe(true)
    expect(wrapper.find('.astryx-button__content').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.astryx-visually-hidden').text()).toBe('Loading')

    deferred.resolve()
    await flushPromises()

    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.astryx-button__spinner').exists()).toBe(false)
    expect(wrapper.find('.astryx-visually-hidden').text()).toBe('')
  })

  it('deduplicates same-tick clicks for a non-interruptible action', async () => {
    const deferred = createDeferred()
    const clickAction = vi.fn(() => deferred.promise)
    const wrapper = mount(Button, {
      props: {
        clickAction,
        label: 'Pay',
      },
    })
    const firstClick = new MouseEvent('click', { bubbles: true, cancelable: true })
    const secondClick = new MouseEvent('click', { bubbles: true, cancelable: true })

    wrapper.element.dispatchEvent(firstClick)
    wrapper.element.dispatchEvent(secondClick)

    expect(clickAction).toHaveBeenCalledTimes(1)
    expect(secondClick.defaultPrevented).toBe(true)

    deferred.resolve()
    await flushPromises()
  })

  it('allows interruptible actions to overlap and stays busy until all settle', async () => {
    const first = createDeferred()
    const second = createDeferred()
    const actions = [first, second]
    const clickAction = vi.fn(() => actions.shift()?.promise ?? Promise.resolve())
    const wrapper = mount(Button, {
      props: {
        clickAction,
        isInterruptible: true,
        label: 'Toggle',
      },
    })

    wrapper.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    wrapper.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()

    expect(clickAction).toHaveBeenCalledTimes(2)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeUndefined()

    first.resolve()
    await flushPromises()
    expect(wrapper.attributes('aria-busy')).toBe('true')

    second.resolve()
    await flushPromises()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('renders explicit loading immediately unless it is interruptible', async () => {
    const wrapper = mount(Button, {
      props: {
        isLoading: true,
        label: 'Submit',
      },
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('data-delay-spinner')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBe('')

    await wrapper.setProps({ isInterruptible: true })

    expect(wrapper.attributes('data-delay-spinner')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('uses the localized loadingLabel in both status regions', () => {
    const wrapper = mount(Button, {
      props: {
        isLoading: true,
        label: 'Save',
        loadingLabel: '正在保存',
      },
    })

    expect(wrapper.find('.astryx-button__spinner').attributes('aria-label')).toBe('正在保存')
    expect(wrapper.find('.astryx-visually-hidden').text()).toBe('正在保存')
  })

  it('suppresses click and clickAction when disabled', async () => {
    const clickAction = vi.fn()
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        clickAction,
        isDisabled: true,
        label: 'Delete',
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(clickAction).not.toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('keeps a disabled tooltip button focusable while suppressing activation', async () => {
    const onClick = vi.fn()
    const onKeydown = vi.fn()
    const wrapper = mount(Button, {
      attrs: {
        onKeydown,
      },
      props: {
        isDisabled: true,
        label: 'Unavailable action',
        onClick,
        tooltip: 'Requires permission',
      },
    })

    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')

    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: 'Escape' })

    expect(onClick).not.toHaveBeenCalled()
    expect(onKeydown).toHaveBeenCalledTimes(1)
  })

  it('opens a tooltip after the hover delay and composes aria-describedby', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Button, {
      attrs: {
        'aria-describedby': 'existing-description',
      },
      attachTo: document.body,
      props: {
        label: 'More information',
        tooltip: 'Additional context',
      },
    })

    expect(wrapper.attributes('aria-describedby')).toContain('existing-description')
    expect(wrapper.attributes('aria-describedby')).toContain('astryx-button-tooltip-')

    await wrapper.trigger('pointerenter')
    vi.advanceTimersByTime(199)
    await nextTick()
    expect(document.body.querySelector<HTMLElement>('[role="tooltip"]')?.style.display).toBe('none')

    vi.advanceTimersByTime(1)
    await nextTick()

    const tooltip = document.body.querySelector<HTMLElement>('[role="tooltip"]')
    expect(tooltip?.textContent).toBe('Additional context')
    expect(tooltip?.style.display).not.toBe('none')

    wrapper.unmount()
  })

  it('treats an empty tooltip as absent', () => {
    const wrapper = mount(Button, {
      props: {
        isDisabled: true,
        label: 'Unavailable',
        tooltip: '',
      },
    })

    expect(wrapper.attributes('disabled')).toBe('')
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
  })

  it('renders href as a native anchor with link attributes', () => {
    const wrapper = mount(Button, {
      props: {
        href: '/settings',
        label: 'Settings',
        rel: 'noreferrer',
        target: '_blank',
      },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/settings')
    expect(wrapper.attributes('rel')).toBe('noreferrer')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('type')).toBeUndefined()
  })

  it('passes href and to to a custom Vue link component', () => {
    const RouterLink = defineComponent({
      inheritAttrs: false,
      props: {
        href: String,
        to: String,
      },
      setup(linkProps, { attrs, slots: linkSlots }) {
        return () => h('a', {
          ...attrs,
          'data-to': linkProps.to,
          'href': linkProps.href,
        }, linkSlots.default?.())
      },
    })
    const wrapper = mount(Button, {
      props: {
        as: RouterLink,
        href: '/account',
        label: 'Account',
      },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/account')
    expect(wrapper.attributes('data-to')).toBe('/account')
  })

  it('falls back to a real button when a link action is disabled', () => {
    const wrapper = mount(Button, {
      props: {
        href: '/danger',
        isDisabled: true,
        label: 'Delete',
      },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBe('')
  })

  it('reacts when a link becomes disabled and enabled again', async () => {
    const wrapper = mount(Button, {
      props: {
        href: '/docs',
        label: 'Docs',
      },
    })

    expect(wrapper.element.tagName).toBe('A')

    await wrapper.setProps({ isDisabled: true })
    expect(wrapper.element.tagName).toBe('BUTTON')

    await wrapper.setProps({ isDisabled: false })
    expect(wrapper.element.tagName).toBe('A')
  })

  it('marks the button for the touch press model and sizes an unsized icon', () => {
    const wrapper = mount(Button, {
      props: { label: 'Save' },
      slots: { icon: () => h(Icon, { icon: 'search' }) },
    })

    expect(wrapper.attributes('data-astryx-pressable')).toBe('')
    expect(wrapper.get('.astryx-icon').attributes('data-size')).toBe('sm')
  })

  it('refuses a javascript href instead of handing it to the browser', () => {
    const wrapper = mount(Button, {
      props: { href: 'javascript:alert(1)', label: 'Run' },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBeUndefined()
  })
})
