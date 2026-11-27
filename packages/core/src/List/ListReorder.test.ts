import type { ReorderMove } from '../reorderable/createReorderable.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import { useReorderable } from '../composables/useReorderable.js'
import { createReorderable } from '../reorderable/createReorderable.js'
import List from './List.vue'
import ListItem from './ListItem.vue'
import { INSERTION_LINE_THICKNESS, MOUSE_DRAG_SLOP } from './reorder/reorderDom.js'

type Key = string | number

function moveKey<T extends Key>(items: readonly T[], key: Key, to: number): T[] {
  const next = items.filter(item => item !== key)
  next.splice(to, 0, key as T)
  return next
}

interface RowsOptions {
  fixed?: readonly string[]
  isDisabled?: readonly string[]
  onReorder?: (move: ReorderMove) => void
  /** The app keeps its order: the rows never move. */
  keepsOrder?: boolean
}

const mounted: Array<{ unmount: () => void }> = []

function mountRows(initial: readonly string[], options: RowsOptions = {}) {
  const { fixed = [], isDisabled = [], onReorder, keepsOrder = false } = options
  const items = ref([...initial])
  const reorderable = createReorderable<string>({
    onReorder: (move) => {
      onReorder?.(move)
      if (!keepsOrder)
        items.value = moveKey(items.value, move.key, move.to)
    },
    isReorderable: key => !fixed.includes(key),
  })
  const Rows = defineComponent({
    setup: () => () => h(List, { reorderable }, () => items.value.map(item =>
      h(ListItem, { key: item, itemKey: item, label: item, isDisabled: isDisabled.includes(item) }),
    )),
  })
  const wrapper = mount(Rows, { attachTo: document.body })
  mounted.push(wrapper)
  return { wrapper, items, reorderable }
}

function listElement(): HTMLElement {
  return document.querySelector<HTMLElement>('ul.astryx-list')!
}

/** The rows' labels, without what the reorder draws over them. */
function labels(): string[] {
  return Array.from(listElement().querySelectorAll(':scope > li:not([data-astryx-reorder-preview])'))
    .map(row => row.querySelector('.astryx-item__label')?.textContent ?? '')
}

/** A button's accessible name, as its `aria-labelledby` or `aria-label` gives it. */
function accessibleName(element: Element): string {
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy != null) {
    return labelledBy.split(' ').map((id) => {
      const target = document.getElementById(id)
      return target === element ? (element.getAttribute('aria-label') ?? '') : (target?.textContent ?? '')
    }).join(' ').replace(/\s+/g, ' ').trim()
  }
  return element.getAttribute('aria-label') ?? ''
}

function handles(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('.astryx-list-reorder-handle'))
}

function handleOf(name: string): HTMLButtonElement {
  const handle = handles().find(button => accessibleName(button) === name)
  expect(handle, `handle ${name}`).toBeDefined()
  return handle!
}

function hintButton(name: string): HTMLElement | null {
  return Array.from(document.querySelectorAll<HTMLElement>('.astryx-list-reorder-hint button'))
    .find(button => button.textContent?.trim() === name || button.getAttribute('aria-label') === name) ?? null
}

async function key(target: Element, name: string): Promise<void> {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }))
  await settle()
}

async function click(target: Element): Promise<void> {
  ;(target as HTMLElement).click()
  await settle()
}

/** Lets Vue render, the commit run, and the next frames pass. */
async function settle(frames = 2): Promise<void> {
  await flushPromises()
  await nextTick()
  for (let frame = 0; frame < frames; frame += 1)
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => setTimeout(resolve, 0))
  await flushPromises()
}

async function announced(text: string): Promise<void> {
  await vi.waitFor(() => expect(document.body.textContent).toContain(text), { timeout: 500 })
}

/** jsdom lays nothing out: 44 px rows from 300 px down the viewport. */
function layOut(list: HTMLElement): void {
  const place = (row: Element): number => Array.from(list.children).indexOf(row)
  for (const row of Array.from(list.children)) {
    Object.defineProperty(row, 'offsetParent', { configurable: true, get: () => list })
    Object.defineProperty(row, 'offsetTop', { configurable: true, get: () => place(row) * 44 })
    Object.defineProperty(row, 'offsetHeight', { configurable: true, value: 44 })
    row.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 300 + place(row) * 44, width: 300, height: 44 })
  }
}

const MOUSE = { pointerType: 'mouse', pointerId: 1, button: 0, clientX: 280, bubbles: true, cancelable: true }

function pointer(target: Element, type: string, clientY: number): void {
  target.dispatchEvent(new PointerEvent(type, { ...MOUSE, clientY }))
}

/** A mouse presses `handle` at `from`, moves past the slop, then to `to`. */
function mouseDrag(handle: Element, from: number, to: number): void {
  pointer(handle, 'pointerdown', from)
  pointer(handle, 'pointermove', from + MOUSE_DRAG_SLOP)
  pointer(handle, 'pointermove', to)
}

describe('list reorderable', () => {
  afterEach(() => {
    while (mounted.length > 0)
      mounted.pop()!.unmount()
    resetLiveRegionsForTest()
    document.body.innerHTML = ''
  })

  it('adds no handle without reorderable', () => {
    const wrapper = mount(List, {
      slots: { default: () => [h(ListItem, { itemKey: 'inbox', label: 'Inbox' }), h(ListItem, { itemKey: 'sent', label: 'Sent' })] },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    expect(handles()).toHaveLength(0)
    expect(document.querySelector('[data-astryx-list-reorder]')).toBeNull()
  })

  it('gives each row with an item key a handle named after it and described by the instructions', async () => {
    mountRows(['Inbox', 'Sent', 'Drafts'])
    await settle()
    const handle = handleOf('Reorder Inbox')
    expect(handle.getAttribute('type')).toBe('button')
    expect(handle.getAttribute('aria-pressed')).toBe('false')
    const hint = document.getElementById(handle.getAttribute('aria-describedby') ?? '')
    expect(hint?.textContent).toBe(
      'Drag to move this item, or press Space or Enter, then the arrow keys to move it one place at a time. Press Escape when you are done.',
    )
    expect(hint?.closest('ul')).toBeNull()
    expect(handles()).toHaveLength(3)
    expect(listElement().children).toHaveLength(3)
  })

  it('adds only the handle to a row without end content, and puts it after end content otherwise', async () => {
    const reorderable = createReorderable({ onReorder: () => {} })
    const wrapper = mount(List, {
      props: { reorderable },
      slots: {
        default: () => [
          h(ListItem, { itemKey: 'a', label: 'A' }),
          h(ListItem, { itemKey: 'b', label: 'B' }, { endContent: () => h('span', { class: 'badge' }, '3') }),
        ],
      },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    await settle()
    const [a, b] = Array.from(listElement().children)
    const handleA = a.querySelector('.astryx-list-reorder-handle')!
    expect(handleA.closest('.astryx-item__end')).toBeNull()
    expect(handleA.getAttribute('data-row-align')).toBe('center')
    const handleB = b.querySelector('.astryx-list-reorder-handle')!
    expect(handleB.closest('.astryx-item__end')).not.toBeNull()
    expect(handleB.previousElementSibling?.classList.contains('badge')).toBe(true)
    expect(handleB.hasAttribute('data-row-align')).toBe(false)
  })

  it('names a handle "Reorder" then the row label for a rich label, and after the row aria-label when given', async () => {
    const reorderable = createReorderable({ onReorder: () => {} })
    const wrapper = mount(List, {
      props: { reorderable },
      slots: {
        default: () => [
          h(ListItem, { itemKey: 'sent' }, { label: () => h('span', [h('strong', 'Sent'), ' mail']) }),
          h(ListItem, { 'itemKey': 'a', 'aria-label': 'Account' }, { label: () => h('span', 'A') }),
        ],
      },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    await settle()
    const sent = handleOf('Reorder Sent mail')
    expect(sent.getAttribute('aria-labelledby')?.split(' ')).toHaveLength(2)
    expect(handleOf('Reorder Account')).toBeDefined()
  })

  it('names the handle of a row that shows no text after its place, and warns once in development', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const reorderable = createReorderable({ onReorder: () => {} })
    const count = ref(0)
    const Rows = defineComponent({
      setup: () => () => h(List, { reorderable, 'data-count': count.value }, () => [
        h(ListItem, { itemKey: 'inbox', label: 'Inbox' }),
        h(ListItem, { itemKey: 'dot' }, { label: () => h('svg', { 'aria-hidden': 'true' }) }),
      ]),
    })
    mounted.push(mount(Rows, { attachTo: document.body }))
    await settle()
    expect(handleOf('Reorder item 2')).toBeDefined()
    count.value += 1
    await settle()
    const nameless = warn.mock.calls.filter(([message]) => String(message).includes('no accessible name'))
    expect(nameless).toHaveLength(1)
    warn.mockRestore()
  })

  it('keeps a row the object rejects in place: no handle', async () => {
    mountRows(['Pinned', 'Inbox'], { fixed: ['Pinned'] })
    await settle()
    const [pinned, inbox] = Array.from(listElement().children)
    expect(pinned.querySelector('.astryx-list-reorder-handle')).toBeNull()
    expect(inbox.querySelector('.astryx-list-reorder-handle')).not.toBeNull()
  })

  it('turns reorder mode on with a click, and the arrows move the row', async () => {
    const onReorder = vi.fn()
    mountRows(['Inbox', 'Sent', 'Drafts'], { onReorder })
    await settle()
    const handle = handleOf('Reorder Sent')
    handle.focus()
    await click(handle)
    expect(handle.getAttribute('aria-pressed')).toBe('true')
    await key(handle, 'ArrowUp')
    expect(onReorder).toHaveBeenCalledWith({ key: 'Sent', to: 0 })
    expect(labels()).toEqual(['Sent', 'Inbox', 'Drafts'])
    expect(document.activeElement).toBe(handle)
  })

  it('leaves reorder mode with Escape, keeping its moves, and announces where the row is', async () => {
    const onReorder = vi.fn()
    mountRows(['Inbox', 'Sent', 'Drafts'], { onReorder })
    await settle()
    const handle = handleOf('Reorder Inbox')
    handle.focus()
    await click(handle)
    await key(handle, 'ArrowDown')
    await key(handle, 'ArrowDown')
    await key(handle, 'Escape')
    expect(handle.getAttribute('aria-pressed')).toBe('false')
    expect(onReorder).toHaveBeenCalledTimes(2)
    expect(labels()).toEqual(['Sent', 'Drafts', 'Inbox'])
    await announced('Done, Inbox at position 3 of 3')
    await key(handle, 'ArrowUp')
    expect(onReorder).toHaveBeenCalledTimes(2)
  })

  it('moves nothing with the arrows outside reorder mode, or with a modifier', async () => {
    const onReorder = vi.fn()
    mountRows(['Inbox', 'Sent', 'Drafts'], { onReorder })
    await settle()
    const handle = handleOf('Reorder Inbox')
    handle.focus()
    await key(handle, 'ArrowDown')
    await click(handle)
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', metaKey: true, bubbles: true }))
    await settle()
    expect(onReorder).not.toHaveBeenCalled()
    expect(labels()).toEqual(['Inbox', 'Sent', 'Drafts'])
  })

  it('marks the row place with the insertion line for the whole mode', async () => {
    mountRows(['Inbox', 'Sent', 'Drafts'])
    await settle()
    const list = listElement()
    layOut(list)
    const handle = handleOf('Reorder Inbox')
    handle.focus()
    await click(handle)
    expect(list.hasAttribute('data-astryx-reorder-line')).toBe(true)
    expect(list.style.getPropertyValue('--astryx-reorder-line-y')).toBe(`${-INSERTION_LINE_THICKNESS / 2}px`)
    await key(handle, 'ArrowDown')
    layOut(list)
    expect(list.hasAttribute('data-astryx-reorder-line')).toBe(true)
    expect(list.children).toHaveLength(3)
    await key(handle, 'Escape')
    expect(list.hasAttribute('data-astryx-reorder-line')).toBe(false)
    expect(list.style.getPropertyValue('--astryx-reorder-line-y')).toBe('')
  })

  it('refuses a move into a row the object rejects at either end, announcing it, and passes one in the middle', async () => {
    const onReorder = vi.fn()
    mountRows(['Pinned', 'Inbox', 'Sent', 'Locked', 'Drafts', 'Trash'], { fixed: ['Pinned', 'Locked', 'Trash'], onReorder })
    await settle()
    const handle = handleOf('Reorder Inbox')
    handle.focus()
    await click(handle)
    await key(handle, 'ArrowUp')
    expect(onReorder).not.toHaveBeenCalled()
    await announced('Can\'t move past Pinned')
    await key(handle, 'ArrowDown')
    await key(handle, 'ArrowDown')
    expect(onReorder).toHaveBeenLastCalledWith({ key: 'Inbox', to: 3 })
    await announced('Inbox, position 4 of 6, after Locked, before Drafts')
    await key(handle, 'ArrowDown')
    await key(handle, 'ArrowDown')
    expect(onReorder).toHaveBeenCalledTimes(3)
    expect(labels()).toEqual(['Pinned', 'Sent', 'Locked', 'Drafts', 'Inbox', 'Trash'])
    await announced('Can\'t move past Trash')
  })

  it('announces a move only once it lands, and a declined one with the place the row kept', async () => {
    const onReorder = vi.fn()
    mountRows(['Inbox', 'Sent', 'Drafts'], { onReorder, keepsOrder: true })
    await settle()
    const handle = handleOf('Reorder Drafts')
    handle.focus()
    await click(handle)
    await key(handle, 'ArrowUp')
    expect(onReorder).toHaveBeenCalledWith({ key: 'Drafts', to: 1 })
    await announced('Drafts, position 3 of 3, after Sent, at the end')
    expect(document.body.textContent).not.toContain('position 2 of 3')
    expect(handle.getAttribute('aria-pressed')).toBe('true')
  })

  it('starts reorder mode from the app\'s own UI with start(key): the focus moves to the handle', async () => {
    const onReorder = vi.fn()
    const { reorderable } = mountRows(['Inbox', 'Sent', 'Drafts'], { onReorder })
    await settle()
    reorderable.start('Sent')
    await settle(4)
    const handle = handleOf('Reorder Sent')
    expect(handle.getAttribute('aria-pressed')).toBe('true')
    expect(document.activeElement).toBe(handle)
    await key(handle, 'ArrowDown')
    expect(onReorder).toHaveBeenCalledWith({ key: 'Sent', to: 2 })
    await announced('Sent, position 3 of 3, after Drafts, at the end')
  })

  it('shows a hint with the moves and Done while a row is in reorder mode, and reorders by taps alone', async () => {
    const onReorder = vi.fn()
    mountRows(['Inbox', 'Sent', 'Drafts'], { onReorder })
    await settle()
    expect(hintButton('Move down')).toBeNull()
    const handle = handleOf('Reorder Inbox')
    handle.focus()
    await click(handle)
    const down = hintButton('Move down')!
    expect(down).not.toBeNull()
    expect(hintButton('Move up')).not.toBeNull()
    expect(down.closest('ul')).toBeNull()
    expect(down.getAttribute('tabindex')).toBe('-1')
    await click(down)
    expect(onReorder).toHaveBeenLastCalledWith({ key: 'Inbox', to: 1 })
    expect(labels()).toEqual(['Sent', 'Inbox', 'Drafts'])
    await click(hintButton('Done')!)
    expect(handle.getAttribute('aria-pressed')).toBe('false')
    expect(hintButton('Done')).toBeNull()
    await announced('Done, Inbox at position 2 of 3')
  })

  it('drags with a mouse once it moves the slop; a smaller move stays a click', async () => {
    const onReorder = vi.fn()
    mountRows(['A', 'B', 'C'], { onReorder })
    await settle()
    const list = listElement()
    layOut(list)
    const handle = handleOf('Reorder A')
    pointer(handle, 'pointerdown', 322)
    pointer(handle, 'pointermove', 322 + MOUSE_DRAG_SLOP - 1)
    expect(list.hasAttribute('data-astryx-reordering')).toBe(false)
    pointer(handle, 'pointerup', 322 + MOUSE_DRAG_SLOP - 1)
    await settle()
    expect(document.body.textContent).not.toContain('Picked up')

    mouseDrag(handle, 322, 322 + 70)
    expect(list.hasAttribute('data-astryx-reordering')).toBe(true)
    await announced('Picked up, position 1 of 3')
    pointer(handle, 'pointerup', 322 + 70)
    await settle()
    expect(onReorder).toHaveBeenCalledTimes(1)
    expect(onReorder).toHaveBeenCalledWith({ key: 'A', to: 2 })
    expect(labels()).toEqual(['B', 'C', 'A'])
    await click(handle)
    expect(handle.getAttribute('aria-pressed')).toBe('false')
    await announced('Dropped, position 3 of 3')
  })

  it('keeps the other rows still during a drag: the source dims, a preview follows, and a line marks the drop', async () => {
    mountRows(['A', 'B', 'C'])
    await settle()
    const list = listElement()
    layOut(list)
    const [a] = Array.from(list.querySelectorAll('li'))
    mouseDrag(handleOf('Reorder A'), 322, 322 + 70)
    expect(a.hasAttribute('data-astryx-reorder-source')).toBe(true)
    const preview = list.querySelector<HTMLElement>('[data-astryx-reorder-preview]')!
    expect(preview).not.toBeNull()
    expect(preview.getAttribute('aria-hidden')).toBe('true')
    expect(preview.nextElementSibling).toBe(a)
    expect(a.style.counterIncrement).toBe('none')
    expect(list.hasAttribute('data-astryx-reorder-line')).toBe(true)
    expect(list.style.getPropertyValue('--astryx-reorder-line-y')).toBe('131px')
    expect(list.children).toHaveLength(4)
    pointer(handleOf('Reorder A'), 'pointerup', 322 + 70)
    await settle()
    expect(labels()).toEqual(['B', 'C', 'A'])
    expect(list.querySelector('[data-astryx-reorder-preview]')).toBeNull()
    expect(list.hasAttribute('data-astryx-reorder-line')).toBe(false)
    expect(a.hasAttribute('data-astryx-reorder-source')).toBe(false)
    expect(a.style.counterIncrement).toBe('')
  })

  it('restores a cancelled drag at once: no preview, no line, nothing moved', async () => {
    const onReorder = vi.fn()
    mountRows(['A', 'B', 'C'], { onReorder })
    await settle()
    const list = listElement()
    layOut(list)
    const a = list.querySelector('li')!
    mouseDrag(handleOf('Reorder A'), 322, 322 + 70)
    expect(list.querySelector('[data-astryx-reorder-preview]')).not.toBeNull()
    pointer(handleOf('Reorder A'), 'pointercancel', 322 + 70)
    await settle()
    expect(list.querySelector('[data-astryx-reorder-preview]')).toBeNull()
    expect(list.hasAttribute('data-astryx-reorder-line')).toBe(false)
    expect(a.hasAttribute('data-astryx-reorder-source')).toBe(false)
    expect(onReorder).not.toHaveBeenCalled()
    expect(labels()).toEqual(['A', 'B', 'C'])
  })

  it('useReorderable reads its latest options: a new onReorder or isReorderable needs no new object', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const options = ref<{ onReorder: (move: ReorderMove) => void, isReorderable?: (key: Key) => boolean }>({ onReorder: first })
    const Rows = defineComponent({
      setup() {
        const reorderable = useReorderable(options)
        return () => h(List, { reorderable }, () => ['A', 'B', 'C'].map(item => h(ListItem, { key: item, itemKey: item, label: item })))
      },
    })
    mounted.push(mount(Rows, { attachTo: document.body }))
    await settle()
    options.value = { onReorder: second, isReorderable: key => key !== 'C' }
    await settle()
    expect(handles()).toHaveLength(2)
    const handle = handleOf('Reorder A')
    handle.focus()
    await click(handle)
    await key(handle, 'ArrowDown')
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith({ key: 'A', to: 1 })
  })

  it('does not activate an interactive row from its handle', async () => {
    const onClick = vi.fn()
    const reorderable = createReorderable({ onReorder: () => {} })
    mounted.push(mount(List, {
      props: { reorderable },
      slots: { default: () => [h(ListItem, { itemKey: 'a', label: 'A', onClick })] },
      attachTo: document.body,
    }))
    await settle()
    await click(handleOf('Reorder A'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
