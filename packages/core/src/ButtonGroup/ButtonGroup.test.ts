import { mount } from '@vue/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Button from '../Button/Button.vue'
import ButtonGroup from './ButtonGroup.vue'

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function renderButtons(): ReturnType<typeof h>[] {
  return [
    h(Button, { label: 'First' }),
    h(Button, { isDisabled: true, label: 'Second' }),
    h(Button, { label: 'Third' }),
  ]
}

describe('buttonGroup', () => {
  it('renders an accessible horizontal medium group by default', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        label: 'Editing actions',
      },
      slots: {
        default: () => renderButtons(),
      },
    })

    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Editing actions')
    expect(wrapper.findAll('.astryx-button')).toHaveLength(3)
  })

  it('provides size and disabled state to child buttons', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        isDisabled: true,
        label: 'Actions',
        size: 'lg',
      },
      slots: {
        default: () => [
          h(Button, { label: 'Inherited' }),
          h(Button, { label: 'Explicit', size: 'sm' }),
        ],
      },
    })
    const [inherited, explicit] = wrapper.findAll('.astryx-button')

    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(inherited?.attributes('data-size')).toBe('lg')
    expect(inherited?.attributes('disabled')).toBe('')
    expect(explicit?.attributes('data-size')).toBe('sm')
    expect(explicit?.attributes('disabled')).toBe('')
  })

  it('renders vertical orientation and group-owned elevation', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        elevation: 'high',
        label: 'Formatting',
        orientation: 'vertical',
      },
      slots: {
        default: () => [
          h(Button, { elevation: 'low', label: 'Bold' }),
          h(Button, { label: 'Italic' }),
        ],
      },
    })

    expect(wrapper.attributes('data-orientation')).toBe('vertical')
    expect(wrapper.attributes('data-elevation')).toBe('high')
    expect(wrapper.find('.astryx-button').attributes('data-elevation')).toBe('none')
  })

  it('moves horizontal focus, skips disabled items, and wraps', async () => {
    const wrapper = mount(ButtonGroup, {
      attachTo: document.body,
      props: {
        label: 'Actions',
      },
      slots: {
        default: () => renderButtons(),
      },
    })
    const [first, , third] = wrapper.findAll<HTMLButtonElement>('.astryx-button')

    first?.element.focus()
    await first?.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(third?.element)

    await third?.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(first?.element)

    wrapper.unmount()
  })

  it('supports Home, End, and vertical arrow navigation', async () => {
    const wrapper = mount(ButtonGroup, {
      attachTo: document.body,
      props: {
        label: 'Actions',
        orientation: 'vertical',
      },
      slots: {
        default: () => renderButtons(),
      },
    })
    const [first, , third] = wrapper.findAll<HTMLButtonElement>('.astryx-button')

    first?.element.focus()
    await first?.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(third?.element)

    await third?.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(first?.element)

    await first?.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(third?.element)

    wrapper.unmount()
  })

  it('reverses horizontal arrow direction in RTL', async () => {
    const wrapper = mount(ButtonGroup, {
      attachTo: document.body,
      attrs: {
        style: 'direction: rtl;',
      },
      props: {
        label: 'Actions',
      },
      slots: {
        default: () => renderButtons(),
      },
    })
    const [first, , third] = wrapper.findAll<HTMLButtonElement>('.astryx-button')

    first?.element.focus()
    await first?.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(third?.element)

    wrapper.unmount()
  })

  it('lets a consumer prevent built-in keyboard navigation', async () => {
    const onKeydown = vi.fn((event: KeyboardEvent) => event.preventDefault())
    const wrapper = mount(ButtonGroup, {
      attachTo: document.body,
      attrs: {
        onKeydown,
      },
      props: {
        label: 'Actions',
      },
      slots: {
        default: () => renderButtons(),
      },
    })
    const [first] = wrapper.findAll<HTMLButtonElement>('.astryx-button')

    first?.element.focus()
    await first?.trigger('keydown', { key: 'ArrowRight' })

    expect(onKeydown).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(first?.element)

    wrapper.unmount()
  })

  it('keeps tooltip layers outside the direct group item list', () => {
    const wrapper = mount(ButtonGroup, {
      attachTo: document.body,
      props: {
        label: 'Actions',
      },
      slots: {
        default: () => [
          h(Button, { label: 'First', tooltip: 'First action' }),
          h(Button, { label: 'Last', tooltip: 'Last action' }),
        ],
      },
    })

    const children = Array.from(wrapper.element.children) as Element[]
    expect(children).toHaveLength(2)
    expect(children.every(child => child.classList.contains('astryx-button'))).toBe(true)

    wrapper.unmount()
  })
})
