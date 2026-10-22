import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useItemDescriptionId } from './context.js'
import Item from './Item.vue'
import List from './List.vue'
import ListItem from './ListItem.vue'

let controlElement: HTMLElement | null = null

function listOf(items: Array<Record<string, unknown>>, props: Record<string, unknown> = {}) {
  return mount(List, {
    props,
    slots: { default: () => items.map(item => h(ListItem, item)) },
  })
}

describe('list', () => {
  it('renders an unordered list of rows', () => {
    const wrapper = listOf([{ label: 'Notifications' }, { description: 'Manage alerts', label: 'Privacy' }])

    const list = wrapper.find('ul.astryx-list')
    expect(list.exists()).toBe(true)
    expect(list.attributes('role')).toBe('list')
    expect(list.attributes('data-list-style')).toBe('none')
    expect(list.attributes('data-density')).toBe('balanced')
    expect(wrapper.findAll('li.astryx-list-item')).toHaveLength(2)
    expect(wrapper.text()).toContain('Notifications')
    expect(wrapper.find('.astryx-item__description').text()).toBe('Manage alerts')
  })

  it('renders an ordered list and its start attribute for decimal markers', () => {
    const wrapper = listOf([{ label: 'First' }, { label: 'Second' }], { listStyle: 'decimal', start: 3 })

    const list = wrapper.find('ol.astryx-list')
    expect(list.exists()).toBe(true)
    expect(list.attributes('start')).toBe('3')
    expect(list.attributes('data-list-style')).toBe('decimal')
    expect(list.attributes('style')).toContain('counter-reset: astryx-list 2')
  })

  it('leaves the start attribute and counter off a list that starts at one', () => {
    const wrapper = listOf([{ label: 'First' }], { listStyle: 'decimal' })

    const list = wrapper.find('ol.astryx-list')
    expect(list.attributes('start')).toBeUndefined()
    expect(list.attributes('style')).toBeUndefined()
  })

  it('draws a bullet or a number in front of each row', () => {
    const bullet = listOf([{ label: 'Disc' }], { listStyle: 'disc' })
    expect(bullet.find('.astryx-list-marker__glyph').attributes('data-shape')).toBe('disc')

    const circle = listOf([{ label: 'Circle' }], { listStyle: 'circle' })
    expect(circle.find('.astryx-list-marker__glyph').attributes('data-shape')).toBe('circle')

    const decimal = listOf([{ label: 'First' }], { listStyle: 'decimal' })
    expect(decimal.find('.astryx-list-marker__number').attributes('data-style')).toBe('decimal')

    const plain = listOf([{ label: 'None' }])
    expect(plain.find('.astryx-list-marker').exists()).toBe(false)
  })

  it('renders a header in a wrapper and points the list at it', () => {
    const wrapper = mount(List, {
      props: { header: 'Available options' },
      slots: { default: () => h(ListItem, { label: 'Row' }) },
    })

    const root = wrapper.find('.astryx-list-root')
    const header = wrapper.find('.astryx-list-header')
    expect(root.exists()).toBe(true)
    expect(header.text()).toBe('Available options')
    expect(wrapper.find('ul.astryx-list').attributes('aria-labelledby')).toBe(header.attributes('id'))
  })

  it('renders no wrapper without a header and keeps a consumer label', () => {
    const wrapper = mount(List, {
      attrs: { 'aria-labelledby': 'outside-heading' },
      slots: { default: () => h(ListItem, { label: 'Row' }) },
    })

    expect(wrapper.find('.astryx-list-root').exists()).toBe(false)
    expect(wrapper.find('ul.astryx-list').attributes('aria-labelledby')).toBe('outside-heading')
  })

  it('marks a list with dividers on the list element', () => {
    const wrapper = listOf([{ label: 'Row' }], { hasDividers: true })

    expect(wrapper.find('ul.astryx-list').attributes('data-dividers')).toBe('true')
  })

  it('marks the edge compensation opt-in on the list element', () => {
    const wrapper = listOf([{ label: 'Row' }], { edgeCompensation: 'inline' })

    expect(wrapper.find('ul.astryx-list').attributes('data-edge-compensation')).toBe('inline')
  })

  it('forwards consumer attributes and class onto the list element', () => {
    const wrapper = mount(List, {
      attrs: { 'class': 'consumer-list', 'data-testid': 'my-list' },
      slots: { default: () => h(ListItem, { label: 'Row' }) },
    })

    const list = wrapper.find('ul.astryx-list')
    expect(list.classes()).toContain('consumer-list')
    expect(list.attributes('data-testid')).toBe('my-list')
  })

  it('follows the density and marker style of the list after mount', async () => {
    const wrapper = listOf([{ label: 'Row' }], { density: 'compact' })
    expect(wrapper.find('.astryx-list-item').attributes('data-density')).toBe('compact')

    await wrapper.setProps({ density: 'spacious', listStyle: 'disc' })

    expect(wrapper.find('.astryx-list-item').attributes('data-density')).toBe('spacious')
    expect(wrapper.find('.astryx-list-marker').exists()).toBe(true)
  })

  it('lets a row override the density it inherits', () => {
    const wrapper = mount(List, {
      props: { density: 'compact' },
      slots: { default: () => h(ListItem, { density: 'balanced', label: 'Row' }) },
    })

    expect(wrapper.find('.astryx-list-item').attributes('data-density')).toBe('balanced')
  })

  it('exposes the list element', () => {
    const wrapper = listOf([{ label: 'Row' }])

    expect(wrapper.vm.element).toBe(wrapper.find('ul.astryx-list').element)
  })
})

describe('list item', () => {
  it('renders start and end content around the label area', () => {
    const wrapper = mount(List, {
      slots: {
        default: () => h(ListItem, { label: 'Row' }, {
          endContent: () => h('span', { class: 'trailing' }, 'Now'),
          startContent: () => h('span', { class: 'leading' }, 'L'),
        }),
      },
    })

    const row = wrapper.find('.astryx-list-item')
    const children = Array.from(row.element.children).map(child => child.className)
    expect(wrapper.find('.astryx-item__start .leading').exists()).toBe(true)
    expect(wrapper.find('.astryx-item__end .trailing').exists()).toBe(true)
    expect(children).toEqual(['astryx-item__start', 'astryx-item__content', 'astryx-item__end'])
  })

  it('lets the label and description slots replace their props', () => {
    const wrapper = mount(List, {
      slots: {
        default: () => h(ListItem, { label: 'Ignored' }, {
          description: () => h('span', { class: 'rich' }, 'Rich description'),
          label: () => h('strong', { class: 'rich' }, 'Rich label'),
        }),
      },
    })

    expect(wrapper.find('.astryx-item__label strong').text()).toBe('Rich label')
    expect(wrapper.find('.astryx-item__description .rich').text()).toBe('Rich description')
    expect(wrapper.text()).not.toContain('Ignored')
  })

  it('conveys selection through aria-current on a listitem', () => {
    const wrapper = listOf([{ isSelected: true, label: 'Row' }])

    const row = wrapper.find('.astryx-list-item')
    expect(row.attributes('aria-current')).toBe('true')
    expect(row.attributes('aria-selected')).toBeUndefined()
    expect(row.attributes('data-selected')).toBe('true')
  })

  it('conveys selection through aria-selected on a role that permits it', () => {
    const wrapper = listOf([{ isSelected: true, label: 'Row', role: 'option' }])

    const row = wrapper.find('.astryx-list-item')
    expect(row.attributes('aria-selected')).toBe('true')
    expect(row.attributes('aria-current')).toBeUndefined()
  })

  it('keeps a consumer-provided aria-current and renders no selection state when unselected', () => {
    const labelled = listOf([{ 'aria-current': 'page', 'label': 'Row' }])
    expect(labelled.find('.astryx-list-item').attributes('aria-current')).toBe('page')

    const plain = listOf([{ label: 'Row' }])
    expect(plain.find('.astryx-list-item').attributes('aria-current')).toBeUndefined()
    expect(plain.find('.astryx-list-item').attributes('aria-selected')).toBeUndefined()
  })

  it('renders a button when a click handler is given and fires it once per click', async () => {
    const onClick = vi.fn()
    const wrapper = listOf([{ label: 'Row', onClick }])

    const button = wrapper.find('button.astryx-item__content')
    expect(button.exists()).toBe(true)
    expect(wrapper.find('.astryx-list-item').attributes('data-interactive')).toBe('true')

    await button.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('fires the click handler from the row surface', async () => {
    const onClick = vi.fn()
    const wrapper = listOf([{ label: 'Row', onClick }])

    await wrapper.find('.astryx-list-item').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('leaves a control in the end content to handle its own click', async () => {
    const onClick = vi.fn()
    const control = vi.fn()
    const wrapper = mount(List, {
      slots: {
        default: () => h(ListItem, { label: 'Row', onClick }, {
          endContent: () => h('button', { class: 'control', onClick: control }, 'Act'),
        }),
      },
    })

    await wrapper.find('.control').trigger('click')
    expect(control).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders an anchor for href and merges the rel tokens for a blank target', () => {
    const wrapper = listOf([
      { href: '/docs', label: 'Docs', rel: 'alternate', target: '_blank' },
    ])

    const anchor = wrapper.find('a.astryx-item__content')
    expect(anchor.attributes('href')).toBe('/docs')
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')?.split(' ').sort()).toEqual(['alternate', 'noopener', 'noreferrer'])
  })

  it('renders no control for a static row', () => {
    const wrapper = listOf([{ label: 'Row' }])

    expect(wrapper.find('button.astryx-item__content').exists()).toBe(false)
    expect(wrapper.find('a.astryx-item__content').exists()).toBe(false)
    expect(wrapper.find('span.astryx-item__content').exists()).toBe(true)
  })

  it('disables a row and ignores its click handler', async () => {
    const onClick = vi.fn()
    const wrapper = listOf([{ isDisabled: true, label: 'Row', onClick }])

    const row = wrapper.find('.astryx-list-item')
    expect(row.attributes('aria-disabled')).toBe('true')
    expect(row.attributes('data-disabled')).toBe('true')
    expect(row.attributes('data-inert')).toBe('true')
    expect(wrapper.find('button.astryx-item__content').attributes('disabled')).toBeDefined()

    await row.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('keeps the row inert only while it has no parent role', () => {
    const wrapper = listOf([{ isDisabled: true, label: 'Row', role: 'menuitem' }])

    expect(wrapper.find('.astryx-list-item').attributes('data-inert')).toBeUndefined()
  })

  it('delegates a row click to the control named by interactiveRef', async () => {
    const control = vi.fn()
    const wrapper = mount(List, {
      slots: {
        default: () => h(ListItem, { interactiveRef: () => controlElement, label: 'Row' }, {
          startContent: () => h('input', { class: 'control', onClick: control, ref: 'control', type: 'checkbox' }),
        }),
      },
    })

    // 等 List 把 interactiveRef 传到 ListItem，再等 Item 依据它切换成委托模式。
    // 少等一轮时，点击会落在还没进入委托状态的根元素上。
    await flushPromises()
    controlElement = wrapper.find<HTMLInputElement>('.control').element
    await flushPromises()

    expect(wrapper.find('button.astryx-item__content').exists()).toBe(false)

    await wrapper.find('.astryx-list-item').trigger('click')
    expect(control).toHaveBeenCalledTimes(1)

    await wrapper.find('.control').trigger('click')
    expect(control).toHaveBeenCalledTimes(2)
  })
})

describe('item', () => {
  it('renders as a div by default and exposes its element', () => {
    const wrapper = mount(Item, { props: { label: 'Standalone' } })

    expect(wrapper.find('div.astryx-item').exists()).toBe(true)
    expect(wrapper.vm.element).toBe(wrapper.element)
  })

  it('renders as the element the as prop names', () => {
    const wrapper = mount(Item, { props: { as: 'span', label: 'Inline' } })

    expect(wrapper.find('span.astryx-item').exists()).toBe(true)
  })

  it('truncates a string label to one line and clamps requested lines', () => {
    const single = mount(Item, { props: { label: 'A long label' } })
    expect(single.find('.astryx-item__label').classes()).toContain('astryx-item__ellipsis')

    const clamped = mount(Item, { props: { descriptionLines: 2, label: 'A label', labelLines: 3 } })
    const label = clamped.find('.astryx-item__label')
    expect(label.classes()).toContain('astryx-item__clamp')
    expect(label.attributes('style')).toContain('--astryx-item-clamp-lines: 3')
  })

  it('installs the description id into the content of its slots', () => {
    const Probed = defineComponent({
      setup() {
        const id = useItemDescriptionId()
        return () => h('span', { 'class': 'probe', 'data-described-by': id.value ?? undefined })
      },
    })
    const wrapper = mount(Item, {
      props: { description: 'Supporting text', label: 'Row' },
      slots: { endContent: () => h(Probed) },
    })

    expect(wrapper.find('.probe').attributes('data-described-by'))
      .toBe(wrapper.find('.astryx-item__description').attributes('id'))
  })

  it('publishes no description id when there is no description', () => {
    const Probed = defineComponent({
      setup() {
        const id = useItemDescriptionId()
        return () => h('span', { 'class': 'probe', 'data-described-by': id.value ?? undefined })
      },
    })
    const wrapper = mount(Item, {
      props: { label: 'Row' },
      slots: { endContent: () => h(Probed) },
    })

    expect(wrapper.find('.probe').attributes('data-described-by')).toBeUndefined()
  })

  it('keeps the label and description on one row for an inline layout', () => {
    const wrapper = mount(Item, { props: { description: 'Supporting', label: 'Row', layout: 'inline' } })

    expect(wrapper.find('.astryx-item__content').classes()).toContain('astryx-item__content--inline')
  })
})

describe('list item template listener', () => {
  it('accepts a click listener written with the v-on shorthand', async () => {
    const handler = vi.fn()
    const Host = defineComponent({
      components: { List, ListItem },
      setup() {
        return { handler }
      },
      template: '<List><ListItem label="Row" @click="handler" /></List>',
    })

    const wrapper = mount(Host)
    await wrapper.find('button.astryx-item__content').trigger('click')

    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('item swipe actions', () => {
  it('reveals a trailing action after a touch drag and runs it from the button', async () => {
    vi.useFakeTimers()
    const onActivate = vi.fn()
    const wrapper = mount(Item, {
      props: {
        label: 'Invoice 1042',
        swipeActions: {
          trailing: [{ label: 'Archive', onActivate }],
        },
      },
    })

    const row = wrapper.get('.astryx-item')
    expect(row.attributes('data-swipe')).toBe('idle')
    await row.trigger('pointerdown', { pointerType: 'mouse', pointerId: 1, clientX: 200, clientY: 20 })
    document.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientX: 80, clientY: 20, bubbles: true }))
    expect(row.attributes('data-swipe')).toBe('idle')

    await row.trigger('pointerdown', { pointerType: 'touch', pointerId: 2, clientX: 200, clientY: 20 })
    document.dispatchEvent(new PointerEvent('pointermove', { pointerId: 2, clientX: 120, clientY: 20, bubbles: true }))
    document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2, clientX: 120, clientY: 20, bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)

    expect(row.attributes('data-swipe')).toBe('resting')
    const action = wrapper.get('.astryx-item__swipe-action')
    expect(action.element.closest('[inert]')).toBeNull()
    await action.trigger('click')
    expect(onActivate).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('commits the outer action when the drag passes the row', async () => {
    vi.useFakeTimers()
    const onActivate = vi.fn()
    const wrapper = mount(Item, {
      attachTo: document.body,
      props: {
        label: 'Draft',
        swipeBehavior: 'commit',
        swipeActions: {
          trailing: [
            { id: 'keep', label: 'Keep', onActivate: vi.fn() },
            { id: 'delete', label: 'Delete', onActivate, variant: 'destructive' },
          ],
        },
      },
    })

    expect(wrapper.findAll('.astryx-item__swipe-action')).toHaveLength(1)
    const row = wrapper.get('.astryx-item').element as HTMLElement
    Object.defineProperty(row, 'offsetWidth', { configurable: true, value: 300 })
    await wrapper.get('.astryx-item').trigger('pointerdown', { pointerType: 'touch', pointerId: 3, clientX: 500, clientY: 10 })
    document.dispatchEvent(new PointerEvent('pointermove', { pointerId: 3, clientX: 0, clientY: 12, bubbles: true }))
    document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 3, clientX: 0, clientY: 12, bubbles: true }))
    expect(onActivate).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('closes a resting row when the pointer goes down outside it', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Item, {
      attachTo: document.body,
      props: {
        label: 'Invoice 1042',
        swipeActions: { trailing: [{ label: 'Archive', onActivate: vi.fn() }] },
      },
    })
    const row = wrapper.get('.astryx-item')
    await row.trigger('pointerdown', { pointerType: 'touch', pointerId: 4, clientX: 200, clientY: 20 })
    document.dispatchEvent(new PointerEvent('pointermove', { pointerId: 4, clientX: 120, clientY: 20, bubbles: true }))
    document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 4, clientX: 120, clientY: 20, bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)
    expect(row.attributes('data-swipe')).toBe('resting')

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }))
    await vi.advanceTimersByTimeAsync(200)
    expect(row.attributes('data-swipe')).toBe('idle')
    wrapper.unmount()
    vi.useRealTimers()
  })
})

describe('item link safety and press', () => {
  it('does not render a link for a blocked destination', () => {
    const wrapper = mount(Item, { props: { label: 'Bad', href: 'javascript:alert(1)' } })
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.attributes('data-astryx-pressable')).toBeUndefined()
  })

  it('marks an interactive row as pressable and leaves a disabled row unmarked', () => {
    const active = mount(Item, { props: { label: 'Open', onClick: () => {} } })
    expect(active.attributes('data-astryx-pressable')).toBe('')
    const disabled = mount(Item, { props: { label: 'Open', onClick: () => {}, isDisabled: true } })
    expect(disabled.attributes('data-astryx-pressable')).toBeUndefined()
  })
})
