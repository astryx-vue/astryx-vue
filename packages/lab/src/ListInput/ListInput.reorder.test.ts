import type { ReorderMove } from '@astryx-vue/core'
import type { Component, VNodeChild } from 'vue'
import type { ListInputColumn } from './types.js'
import { createReorderable } from '@astryx-vue/core'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import ListInput from './ListInput.vue'

interface Guest {
  id: string
  name: string
}

const guests: Guest[] = [
  { id: 'ada', name: 'Ada' },
  { id: 'grace', name: 'Grace' },
  { id: 'linus', name: 'Linus' },
]

const nameColumn: ListInputColumn<Guest> = {
  key: 'name',
  header: 'Name',
  renderInput: ({ item, label }) => h('input', { 'aria-label': label, 'value': item.name }) as VNodeChild,
}

const ListComponent = ListInput as unknown as Component
const mounted: Array<{ unmount: () => void }> = []

afterEach(() => {
  while (mounted.length > 0)
    mounted.pop()!.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function moveGuest(value: readonly Guest[], key: string | number, to: number): Guest[] {
  const moved = value.find(guest => guest.id === key)!
  const next = value.filter(guest => guest !== moved)
  next.splice(to, 0, moved)
  return next
}

interface MountOptions {
  props?: Record<string, unknown>
  fixed?: readonly string[]
  /** 不传 `reorderable`，只用旧的 `isReorderable` 写法。 */
  isLegacy?: boolean
}

function mountList(options: MountOptions = {}) {
  const value = ref<Guest[]>([...guests])
  const extra = ref<Record<string, unknown>>({ ...options.props })
  const onReorder = vi.fn((move: ReorderMove) => {
    value.value = moveGuest(value.value, move.key, move.to)
  })
  const onChange = vi.fn()
  const reorderable = createReorderable({ onReorder, isReorderable: key => !(options.fixed ?? []).includes(String(key)) })
  const Harness = defineComponent({
    setup: () => () => h(ListComponent, {
      'label': 'Guests',
      'itemName': 'guest',
      'modelValue': value.value,
      'getItemKey': (item: Guest) => item.id,
      'createItem': () => ({ id: 'new', name: '' }),
      'columns': [nameColumn],
      'reorderable': options.isLegacy ? undefined : reorderable,
      'onUpdate:modelValue': (next: Guest[]) => {
        value.value = next
      },
      onChange,
      ...extra.value,
    }),
  })
  const wrapper = mount(Harness, { attachTo: document.body })
  mounted.push(wrapper)
  return {
    value,
    onReorder,
    onChange,
    update: async (next: Record<string, unknown>) => {
      extra.value = { ...extra.value, ...next }
      await settle()
    },
  }
}

/** 等 Vue 渲染、重排会话提交、再过两帧。 */
async function settle(frames = 2): Promise<void> {
  await flushPromises()
  await nextTick()
  for (let frame = 0; frame < frames; frame += 1)
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => setTimeout(resolve, 0))
  await flushPromises()
}

function list(): HTMLElement {
  return document.querySelector<HTMLElement>('ol.astryx-list-input__list')!
}

function handle(name: string): HTMLButtonElement {
  const found = [...document.querySelectorAll<HTMLButtonElement>('button[data-astryx-list-reorder]')]
    .find(button => button.getAttribute('aria-label') === name)
  expect(found, name).toBeDefined()
  return found!
}

function names(): string[] {
  return [...list().querySelectorAll<HTMLInputElement>(':scope > li:not([data-astryx-reorder-preview]) input')].map(input => input.value)
}

async function key(target: Element, name: string): Promise<void> {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }))
  await settle()
}

async function click(target: HTMLElement): Promise<void> {
  target.click()
  await settle()
}

async function announced(text: string): Promise<void> {
  await vi.waitFor(() => expect(document.body.textContent).toContain(text), { timeout: 500 })
}

/** happy-dom 不排版：每条记录 44px 高，从视口 300px 处往下排。 */
function layOut(element: HTMLElement): void {
  const place = (row: Element): number => [...element.children].indexOf(row)
  for (const row of [...element.children]) {
    Object.defineProperty(row, 'offsetParent', { configurable: true, get: () => element })
    Object.defineProperty(row, 'offsetTop', { configurable: true, get: () => place(row) * 44 })
    Object.defineProperty(row, 'offsetHeight', { configurable: true, value: 44 })
    row.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 300 + place(row) * 44, width: 300, height: 44 })
  }
}

const MOUSE = { pointerType: 'mouse', pointerId: 1, button: 0, clientX: 280, bubbles: true, cancelable: true }

function pointer(target: Element, type: string, clientY: number): void {
  target.dispatchEvent(new PointerEvent(type, { ...MOUSE, clientY }))
}

describe('listInput reorderable', () => {
  it('puts core List\'s reorder handle after Remove, in the row\'s revealed control cell', async () => {
    mountList()
    await settle()
    expect(document.querySelector('.astryx-list-input')?.getAttribute('data-reorderable')).toBe('true')
    const first = handle('Reorder guest 1')
    expect(first.classList.contains('astryx-list-reorder-handle')).toBe(true)
    expect(first.getAttribute('aria-pressed')).toBe('false')

    const cell = first.parentElement!
    expect(cell.classList.contains('astryx-list-input__control-cell')).toBe(true)
    expect(cell.classList.contains('astryx-reveal__content--preserve')).toBe(true)
    expect(cell.firstElementChild?.getAttribute('aria-label')).toBe('Remove guest 1')
    expect(cell.closest('[data-list-input-row]')?.classList.contains('astryx-reveal')).toBe(true)

    const hint = document.getElementById(first.getAttribute('aria-describedby') ?? '')
    expect(hint?.textContent).toContain('Press Escape when you are done.')
    expect(hint?.closest('ol')).toBeNull()
  })

  it('leaves records the object rejects in place, without a handle', async () => {
    mountList({ fixed: ['grace'] })
    await settle()
    const rows = [...document.querySelectorAll('[data-list-input-row]')]
    expect(rows[1]?.querySelector('[data-astryx-list-reorder]')).toBeNull()
    expect(rows[1]?.querySelector('[data-list-input-remove]')).not.toBeNull()
    expect(rows[0]?.querySelector('[data-astryx-list-reorder]')).not.toBeNull()
  })

  it('moves a record in reorder mode, keeps focus on its handle and announces its new place', async () => {
    const harness = mountList()
    await settle()
    const ada = handle('Reorder guest 1')
    ada.focus()
    await click(ada)
    expect(ada.getAttribute('aria-pressed')).toBe('true')
    await key(ada, 'ArrowDown')
    expect(harness.onReorder).toHaveBeenCalledTimes(1)
    expect(harness.onReorder).toHaveBeenCalledWith({ key: 'ada', to: 1 })
    expect(names()).toEqual(['Grace', 'Ada', 'Linus'])
    expect(document.activeElement).toBe(ada)
    expect(ada.getAttribute('aria-label')).toBe('Reorder guest 2')
    await announced('position 2 of 3')
    await key(ada, 'Escape')
    expect(ada.getAttribute('aria-pressed')).toBe('false')
    await key(ada, 'ArrowDown')
    expect(harness.onReorder).toHaveBeenCalledTimes(1)
  })

  it('drags with a mouse: the rows stay still under a preview and a line, then the drop commits once', async () => {
    const harness = mountList()
    await settle()
    const element = list()
    layOut(element)
    const ada = handle('Reorder guest 1')
    const source = element.children[0]!
    pointer(ada, 'pointerdown', 322)
    pointer(ada, 'pointermove', 330)
    pointer(ada, 'pointermove', 322 + 70)
    expect(element.hasAttribute('data-astryx-reordering')).toBe(true)
    expect(source.hasAttribute('data-astryx-reorder-source')).toBe(true)
    expect(element.querySelector('[data-astryx-reorder-preview]')).not.toBeNull()
    expect(element.hasAttribute('data-astryx-reorder-line')).toBe(true)
    pointer(ada, 'pointerup', 322 + 70)
    await settle()
    expect(harness.onReorder).toHaveBeenCalledTimes(1)
    expect(harness.onReorder).toHaveBeenCalledWith({ key: 'ada', to: 2 })
    expect(names()).toEqual(['Grace', 'Linus', 'Ada'])
    expect(element.querySelector('[data-astryx-reorder-preview]')).toBeNull()
    expect(element.hasAttribute('data-astryx-reorder-line')).toBe(false)
  })

  it.each([{ isDisabled: true }, { isLoading: true }])('keeps a focusable but inert handle with %o', async (props) => {
    const harness = mountList({ props })
    await settle()
    const element = list()
    layOut(element)
    const ada = handle('Reorder guest 1')
    expect(ada.getAttribute('aria-disabled')).toBe('true')
    ada.focus()
    expect(document.activeElement).toBe(ada)
    await click(ada)
    await key(ada, 'ArrowDown')
    pointer(ada, 'pointerdown', 322)
    pointer(ada, 'pointermove', 322 + 70)
    pointer(ada, 'pointerup', 322 + 70)
    await settle()
    expect(ada.getAttribute('aria-pressed')).toBe('false')
    expect(harness.onReorder).not.toHaveBeenCalled()
    expect(names()).toEqual(['Ada', 'Grace', 'Linus'])
  })

  it('ends reorder mode without a move when the list turns busy', async () => {
    const harness = mountList()
    await settle()
    const ada = handle('Reorder guest 1')
    ada.focus()
    await click(ada)
    expect(ada.getAttribute('aria-pressed')).toBe('true')
    await harness.update({ isLoading: true })
    expect(ada.getAttribute('aria-pressed')).toBe('false')
    await key(ada, 'ArrowDown')
    expect(harness.onReorder).not.toHaveBeenCalled()
  })

  it('still reorders through the deprecated isReorderable, with v-model and a reorder change, and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const harness = mountList({ isLegacy: true, props: { isReorderable: true } })
    await settle()
    const ada = handle('Reorder guest 1')
    ada.focus()
    await click(ada)
    await key(ada, 'ArrowDown')
    expect(names()).toEqual(['Grace', 'Ada', 'Linus'])
    expect(harness.onChange).toHaveBeenCalledWith(
      [guests[1], guests[0], guests[2]],
      { type: 'reorder', item: guests[0], fromIndex: 0, toIndex: 1 },
    )
    await key(ada, 'ArrowDown')
    const deprecations = warn.mock.calls.filter(([message]) => String(message).includes('isReorderable'))
    expect(deprecations).toHaveLength(1)
  })

  it('has no handles without reorderable or isReorderable', async () => {
    mountList({ isLegacy: true })
    await settle()
    expect(document.querySelector('[data-astryx-list-reorder]')).toBeNull()
    expect(document.querySelector('.astryx-list-input')?.hasAttribute('data-reorderable')).toBe(false)
  })
})
