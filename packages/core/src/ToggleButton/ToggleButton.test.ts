import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import ToggleButton from './ToggleButton.vue'
import ToggleButtonGroup from './ToggleButtonGroup.vue'

function createDeferred(): {
  promise: Promise<void>
  resolve: () => void
} {
  let resolvePromise: () => void = () => {}
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve
  })

  return { promise, resolve: resolvePromise }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('toggleButton', () => {
  it('renders a ghost button with the next-size-free defaults and aria-pressed false', () => {
    const wrapper = mount(ToggleButton, { props: { label: 'Bold' } })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('data-pressed')).toBe('false')
    expect(button.attributes('data-variant')).toBe('ghost')
    expect(button.attributes('data-size')).toBe('md')
    expect(button.attributes('data-elevation')).toBe('none')
    expect(button.classes()).toContain('astryx-toggle-button')
    expect(button.classes()).toContain('astryx-button')
    expect(wrapper.text()).toContain('Bold')
  })

  it('reflects the pressed prop and its elevation', () => {
    const wrapper = mount(ToggleButton, {
      props: { label: 'Bold', isPressed: true, elevation: 'high' },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('data-pressed')).toBe('true')
    expect(button.attributes('data-elevation')).toBe('high')
  })

  it('renders the label twice, with a hidden copy reserving the pressed width', () => {
    const wrapper = mount(ToggleButton, { props: { label: 'Bold' } })

    const reserve = wrapper.find('.astryx-toggle-button__label-reserve')
    expect(reserve.exists()).toBe(true)
    expect(reserve.attributes('aria-hidden')).toBe('true')
    expect(reserve.text()).toBe('Bold')
    expect(wrapper.find('.astryx-toggle-button__label-text').text()).toBe('Bold')
  })

  it('keeps the caller class and data-testid on the root', () => {
    const wrapper = mount(ToggleButton, {
      props: { 'label': 'All', 'class': 'my-filter', 'data-testid': 'toggle-all' },
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('my-filter')
    expect(button.classes()).toContain('astryx-toggle-button')
    expect(button.attributes('data-testid')).toBe('toggle-all')
  })

  it('renders slot content instead of the label while the label names the button', () => {
    const wrapper = mount(ToggleButton, {
      props: { label: 'Toggle bold' },
      slots: { default: 'Custom content' },
    })

    const button = wrapper.find('button')
    expect(button.text()).toContain('Custom content')
    expect(button.attributes('aria-label')).toBe('Toggle bold')
  })

  it('renders an icon-only button named by its label, without the width reservation', () => {
    const wrapper = mount(ToggleButton, {
      props: { label: 'Bold', isIconOnly: true },
      slots: { icon: '<svg data-testid="icon" />' },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Bold')
    expect(button.attributes('data-icon-only')).toBe('true')
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    expect(wrapper.find('.astryx-toggle-button__label').exists()).toBe(false)
  })

  it('swaps to pressedIcon while pressed and falls back to icon', () => {
    const slots = {
      icon: '<svg data-testid="outline" />',
      pressedIcon: '<svg data-testid="filled" />',
    }

    const pressed = mount(ToggleButton, { props: { label: 'Record', isPressed: true }, slots })
    expect(pressed.find('[data-testid="filled"]').exists()).toBe(true)
    expect(pressed.find('[data-testid="outline"]').exists()).toBe(false)

    const resting = mount(ToggleButton, { props: { label: 'Record' }, slots })
    expect(resting.find('[data-testid="outline"]').exists()).toBe(true)
    expect(resting.find('[data-testid="filled"]').exists()).toBe(false)

    const fallback = mount(ToggleButton, {
      props: { label: 'Record', isPressed: true },
      slots: { icon: '<svg data-testid="outline" />' },
    })
    expect(fallback.find('[data-testid="outline"]').exists()).toBe(true)
  })

  it('renders no icon container without an icon slot', () => {
    const wrapper = mount(ToggleButton, { props: { label: 'Bold' } })
    expect(wrapper.find('.astryx-button__icon').exists()).toBe(false)
  })

  it('asks for the next pressed state and forwards the click', async () => {
    const wrapper = mount(ToggleButton, { props: { label: 'Bold' } })

    await wrapper.find('button').trigger('click')

    const pressedChange = wrapper.emitted('pressedChange')
    expect(pressedChange).toHaveLength(1)
    expect(pressedChange?.[0]?.[0]).toBe(true)
    expect((pressedChange?.[0]?.[1] as MouseEvent).type).toBe('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('reports the next state through update:isPressed and keeps the controlled value', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(ToggleButton, {
      props: { 'label': 'Bold', 'isPressed': false, 'onUpdate:isPressed': onUpdate },
    })

    await wrapper.find('button').trigger('click')

    expect(onUpdate).toHaveBeenCalledWith(true)
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')

    await wrapper.setProps({ isPressed: true })
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
  })

  it('toggles itself while nothing is bound, and follows a v-model parent', async () => {
    const Host = defineComponent({
      setup() {
        const pressed = ref(false)
        return () => h(ToggleButton, {
          'isPressed': pressed.value,
          'label': 'Bold',
          'onUpdate:isPressed': (value: boolean) => {
            pressed.value = value
          },
        })
      },
    })

    const wrapper = mount(Host)
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
  })

  it('lets the pressedChange handler take over the toggle by preventing the default', async () => {
    const action = vi.fn()
    const wrapper = mount(ToggleButton, {
      props: {
        isPressed: false,
        label: 'Bold',
        onPressedChange: (_isPressed: boolean, event: MouseEvent) => {
          event.preventDefault()
        },
        pressedChangeAction: action,
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('pressedChange')?.[0]?.[0]).toBe(true)
    expect(action).not.toHaveBeenCalled()
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('button').attributes('aria-busy')).toBeUndefined()
  })

  it('does not react to a click while disabled', async () => {
    const onPressedChange = vi.fn()
    const wrapper = mount(ToggleButton, {
      props: { label: 'Bold', isDisabled: true, onPressedChange },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')

    expect(onPressedChange).not.toHaveBeenCalled()
    expect(wrapper.emitted('pressedChange')).toBeUndefined()
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(button.attributes('aria-pressed')).toBe('false')
  })

  it('stays focusable but inert when disabled with a tooltip', async () => {
    const onPressedChange = vi.fn()
    const wrapper = mount(ToggleButton, {
      props: {
        label: 'Bold',
        isDisabled: true,
        onPressedChange,
        tooltip: 'Formatting is locked for this document',
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('disabled')).toBeUndefined()

    await button.trigger('click')

    expect(onPressedChange).not.toHaveBeenCalled()
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull()
  })

  it('shows the loading state with a spinner', () => {
    const wrapper = mount(ToggleButton, { props: { label: 'Bold', isLoading: true } })

    const button = wrapper.find('button')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.astryx-button__spinner-overlay').exists()).toBe(true)
  })

  it('exposes its element and moves focus', () => {
    const wrapper = mount(ToggleButton, {
      props: { label: 'Bold' },
      attachTo: document.body,
    })

    const api = wrapper.vm as unknown as {
      blur: () => void
      element: HTMLElement | null
      focus: () => void
    }
    expect(api.element).toBe(wrapper.find('button').element)

    api.focus()
    expect(document.activeElement).toBe(wrapper.find('button').element)

    api.blur()
    expect(document.activeElement).not.toBe(wrapper.find('button').element)
  })

  describe('pressedChangeAction', () => {
    it('shows the next state and a spinner while pending, and stays clickable', async () => {
      const deferred = createDeferred()
      const action = vi.fn(() => deferred.promise)
      const wrapper = mount(ToggleButton, {
        props: { label: 'Favorite', pressedChangeAction: action },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-pressed')).toBe('false')

      await button.trigger('click')

      expect(action).toHaveBeenCalledWith(true)
      expect(button.attributes('aria-pressed')).toBe('true')
      expect(button.attributes('aria-busy')).toBe('true')
      expect(button.attributes('disabled')).toBeUndefined()

      deferred.resolve()
      await flushPromises()

      expect(button.attributes('aria-busy')).toBeUndefined()
      expect(button.attributes('aria-pressed')).toBe('true')
    })

    it('runs the synchronous callback before the action, with the same next state', async () => {
      const calls: string[] = []
      const action = vi.fn(() => {
        calls.push('action')
      })
      const wrapper = mount(ToggleButton, {
        props: {
          label: 'Favorite',
          onPressedChange: () => {
            calls.push('change')
          },
          pressedChangeAction: action,
        },
      })

      await wrapper.find('button').trigger('click')

      expect(calls).toEqual(['change', 'action'])
      expect(action).toHaveBeenCalledWith(true)
    })

    it('runs a synchronous action without pending feedback', async () => {
      const action = vi.fn()
      const wrapper = mount(ToggleButton, {
        props: { label: 'Favorite', pressedChangeAction: action },
      })

      await wrapper.find('button').trigger('click')

      expect(action).toHaveBeenCalledWith(true)
      expect(wrapper.find('button').attributes('aria-busy')).toBeUndefined()
      expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
    })

    it('reverses a pending toggle on each re-click', async () => {
      const deferreds: ReturnType<typeof createDeferred>[] = []
      const action = vi.fn(() => {
        const deferred = createDeferred()
        deferreds.push(deferred)
        return deferred.promise
      })
      const wrapper = mount(ToggleButton, {
        props: { label: 'Favorite', pressedChangeAction: action },
      })

      const button = wrapper.find('button')
      await button.trigger('click')
      expect(button.attributes('aria-pressed')).toBe('true')

      await button.trigger('click')
      expect(button.attributes('aria-pressed')).toBe('false')

      await button.trigger('click')
      expect(button.attributes('aria-pressed')).toBe('true')

      expect(action).toHaveBeenCalledTimes(3)
      expect(action).toHaveBeenNthCalledWith(1, true)
      expect(action).toHaveBeenNthCalledWith(2, false)
      expect(action).toHaveBeenNthCalledWith(3, true)

      deferreds.forEach(deferred => deferred.resolve())
      await flushPromises()

      expect(button.attributes('aria-busy')).toBeUndefined()
      expect(button.attributes('aria-pressed')).toBe('true')
    })

    it('keeps a rejected action from leaving the button busy', async () => {
      const action = vi.fn(() => Promise.reject(new Error('offline')))
      const wrapper = mount(ToggleButton, {
        props: { label: 'Favorite', pressedChangeAction: action },
        global: { config: { errorHandler: () => {} } },
      })

      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(wrapper.find('button').attributes('aria-busy')).toBeUndefined()
      expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
    })
  })

  it('keeps its own state reactive while a controlled action settles', async () => {
    const deferred = createDeferred()
    const wrapper = mount(ToggleButton, {
      props: {
        'isPressed': false,
        'label': 'Favorite',
        'onUpdate:isPressed': () => {},
        'pressedChangeAction': () => deferred.promise,
      },
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')

    deferred.resolve()
    await flushPromises()

    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
  })
})

describe('toggleButtonGroup', () => {
  function mountGroup(props: Record<string, unknown> = {}) {
    return mount(ToggleButtonGroup, {
      props: { label: 'View mode', value: 'list', ...props },
      slots: {
        default: () => [
          h(ToggleButton, { label: 'List', value: 'list' }),
          h(ToggleButton, { label: 'Grid', value: 'grid' }),
          h(ToggleButton, { label: 'Card', value: 'card' }),
        ],
      },
    })
  }

  function buttonNamed(wrapper: ReturnType<typeof mountGroup>, name: string) {
    return wrapper.findAll('button').find(button => button.attributes('aria-label') === name)
  }

  it('renders a labelled group and marks the selected member pressed', () => {
    const wrapper = mountGroup()

    const group = wrapper.find('[role="group"]')
    expect(group.attributes('aria-label')).toBe('View mode')
    expect(group.attributes('data-orientation')).toBe('horizontal')
    expect(group.attributes('data-size')).toBe('md')
    expect(buttonNamed(wrapper, 'List')?.attributes('aria-pressed')).toBe('true')
    expect(buttonNamed(wrapper, 'Grid')?.attributes('aria-pressed')).toBe('false')
  })

  it('selects one member at a time and allows clearing the selection', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountGroup({ 'onUpdate:value': onUpdate })

    await buttonNamed(wrapper, 'Grid')!.trigger('click')
    expect(onUpdate).toHaveBeenLastCalledWith('grid')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['grid'])

    await wrapper.setProps({ value: 'grid' })
    expect(buttonNamed(wrapper, 'Grid')?.attributes('aria-pressed')).toBe('true')
    expect(buttonNamed(wrapper, 'List')?.attributes('aria-pressed')).toBe('false')

    await buttonNamed(wrapper, 'Grid')!.trigger('click')
    expect(onUpdate).toHaveBeenLastCalledWith(null)
    expect(wrapper.emitted('change')?.at(-1)).toEqual([null])
  })

  it('adds and removes values in multiple mode', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(ToggleButtonGroup, {
      props: { 'type': 'multiple', 'label': 'Columns', 'value': ['list'], 'onUpdate:value': onUpdate },
      slots: {
        default: () => [
          h(ToggleButton, { label: 'List', value: 'list' }),
          h(ToggleButton, { label: 'Grid', value: 'grid' }),
        ],
      },
    })

    expect(buttonNamed(wrapper, 'List')?.attributes('aria-pressed')).toBe('true')

    await buttonNamed(wrapper, 'Grid')!.trigger('click')
    expect(onUpdate).toHaveBeenLastCalledWith(['list', 'grid'])

    await buttonNamed(wrapper, 'List')!.trigger('click')
    expect(onUpdate).toHaveBeenLastCalledWith([])
  })

  it('keeps the members in step with the group after the group updates', async () => {
    const wrapper = mountGroup()

    await wrapper.setProps({ value: 'card' })

    expect(buttonNamed(wrapper, 'Card')?.attributes('aria-pressed')).toBe('true')
    expect(buttonNamed(wrapper, 'List')?.attributes('aria-pressed')).toBe('false')
  })

  it('passes the group size to its members and lets a member override it', async () => {
    const wrapper = mount(ToggleButtonGroup, {
      props: { label: 'View mode', value: 'list', size: 'lg' },
      slots: {
        default: () => [
          h(ToggleButton, { label: 'List', value: 'list' }),
          h(ToggleButton, { label: 'Grid', value: 'grid', size: 'sm' }),
        ],
      },
    })

    expect(buttonNamed(wrapper, 'List')?.attributes('data-size')).toBe('lg')
    expect(buttonNamed(wrapper, 'Grid')?.attributes('data-size')).toBe('sm')

    await wrapper.setProps({ size: 'sm' })
    expect(buttonNamed(wrapper, 'List')?.attributes('data-size')).toBe('sm')
  })

  it('disables every member from the group, and never re-enables a self-disabled one', async () => {
    const wrapper = mount(ToggleButtonGroup, {
      props: { label: 'View mode', value: 'list' },
      slots: {
        default: () => [
          h(ToggleButton, { label: 'List', value: 'list', isDisabled: true }),
          h(ToggleButton, { label: 'Grid', value: 'grid' }),
        ],
      },
    })

    expect(buttonNamed(wrapper, 'List')?.attributes('disabled')).toBeDefined()
    expect(buttonNamed(wrapper, 'Grid')?.attributes('disabled')).toBeUndefined()

    await wrapper.setProps({ isDisabled: true })
    expect(buttonNamed(wrapper, 'Grid')?.attributes('disabled')).toBeDefined()
  })

  it('owns the pressed state of a member that also carries standalone handlers', async () => {
    const onChange = vi.fn()
    const onPressedChange = vi.fn()
    const pressedChangeAction = vi.fn()
    const wrapper = mount(ToggleButtonGroup, {
      props: { 'label': 'View', 'value': 'list', 'onUpdate:value': onChange },
      slots: {
        default: () => [
          h(ToggleButton, {
            isPressed: true,
            label: 'Grid',
            onPressedChange,
            pressedChangeAction,
            value: 'grid',
          }),
        ],
      },
    })

    const grid = buttonNamed(wrapper, 'Grid')
    expect(grid?.attributes('aria-pressed')).toBe('false')

    await grid!.trigger('click')

    expect(onChange).toHaveBeenCalledWith('grid')
    expect(onPressedChange).not.toHaveBeenCalled()
    expect(pressedChangeAction).not.toHaveBeenCalled()
    expect(grid?.attributes('aria-pressed')).toBe('false')
    expect(grid?.attributes('aria-busy')).toBeUndefined()
  })

  it('stacks its members when it is vertical', () => {
    const wrapper = mountGroup({ orientation: 'vertical' })
    expect(wrapper.find('[role="group"]').attributes('data-orientation')).toBe('vertical')
  })
})
