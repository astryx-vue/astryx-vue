import type { ReorderMove } from '@astryx-vue/core'
import type { Component } from 'vue'
import type { TransferListOption } from './types.js'
import { createReorderable } from '@astryx-vue/core'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import TransferList from './TransferList.vue'

const OPTIONS: readonly TransferListOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'owner', label: 'Owner' },
  { value: 'status', label: 'Status' },
  { value: 'updated', label: 'Updated' },
]

const ListComponent = TransferList as unknown as Component
const mounted: Array<{ unmount: () => void }> = []

afterEach(() => {
  while (mounted.length > 0)
    mounted.pop()!.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

interface MountOptions {
  initialValue?: readonly string[]
  options?: readonly TransferListOption[]
  props?: Record<string, unknown>
}

function mountList(options: MountOptions = {}) {
  const value = ref<readonly string[]>(options.initialValue ?? ['name', 'owner', 'status'])
  const onChange = vi.fn((next: readonly string[]) => {
    value.value = next
  })
  const Harness = defineComponent({
    setup: () => () => h(ListComponent, {
      'label': 'Columns',
      'options': options.options ?? OPTIONS,
      'modelValue': value.value,
      'onUpdate:modelValue': (next: readonly string[]) => {
        value.value = next
      },
      onChange,
      ...options.props,
    }),
  })
  mounted.push(mount(Harness, { attachTo: document.body }))
  return { value, onChange }
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

function selectedList(): HTMLElement {
  return document.querySelector<HTMLElement>('[data-transfer-list-panel-body="selected"] ul')!
}

function rowOf(value: string): HTMLElement | null {
  return [...document.querySelectorAll<HTMLElement>('[data-transfer-list-row]:not([data-astryx-reorder-preview])')].find(row => row.dataset.transferListRow === value) ?? null
}

function handleOf(value: string): HTMLButtonElement | null {
  return rowOf(value)?.querySelector<HTMLButtonElement>('button[data-astryx-list-reorder]') ?? null
}

function shown(): string[] {
  return [...selectedList().querySelectorAll<HTMLElement>(':scope > li:not([data-astryx-reorder-preview])')]
    .map(row => row.dataset.transferListRow ?? '')
}

async function key(target: Element, name: string): Promise<void> {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }))
  await settle()
}

async function click(target: HTMLElement): Promise<void> {
  target.click()
  await settle()
}

/** happy-dom 不排版：每行 44px 高，从视口 300px 处往下排。 */
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

describe('transferList reordering', () => {
  it('moves a selected value in reorder mode and commits the new order through v-model', async () => {
    const harness = mountList()
    await settle()
    const owner = handleOf('owner')!
    owner.focus()
    await click(owner)
    expect(owner.getAttribute('aria-pressed')).toBe('true')
    await key(owner, 'ArrowDown')
    expect(harness.onChange).toHaveBeenCalledTimes(1)
    expect(harness.onChange).toHaveBeenCalledWith(['name', 'status', 'owner'])
    expect(shown()).toEqual(['name', 'status', 'owner'])
    expect(document.activeElement).toBe(owner)
  })

  it('drags a selected value with a mouse under a preview and a line, and commits once on release', async () => {
    const harness = mountList()
    await settle()
    const list = selectedList()
    layOut(list)
    const name = handleOf('name')!
    pointer(name, 'pointerdown', 322)
    pointer(name, 'pointermove', 330)
    pointer(name, 'pointermove', 322 + 70)
    expect(rowOf('name')?.hasAttribute('data-astryx-reorder-source')).toBe(true)
    expect(list.querySelector('[data-astryx-reorder-preview]')).not.toBeNull()
    expect(list.hasAttribute('data-astryx-reorder-line')).toBe(true)
    pointer(name, 'pointerup', 322 + 70)
    await settle()
    expect(harness.onChange).toHaveBeenCalledTimes(1)
    expect(harness.onChange).toHaveBeenCalledWith(['owner', 'status', 'name'])
  })

  it('gives a reorder-disabled value no handle, and other values do not move past it at the end', async () => {
    const options = OPTIONS.map(option => option.value === 'status' ? { ...option, isReorderDisabled: true } : option)
    const harness = mountList({ options })
    await settle()
    expect(handleOf('status')).toBeNull()
    const owner = handleOf('owner')!
    owner.focus()
    await click(owner)
    await key(owner, 'ArrowDown')
    expect(harness.onChange).not.toHaveBeenCalled()
    await key(owner, 'ArrowUp')
    expect(harness.onChange).toHaveBeenCalledWith(['owner', 'name', 'status'])
  })

  it('hands moves to `reorderable` in the value\'s terms, with its isReorderable', async () => {
    const onReorder = vi.fn<(move: ReorderMove<string>) => void>()
    const reorderable = createReorderable<string>({ onReorder, isReorderable: value => value !== 'name' })
    // `ghost` 没有选项，不显示，但留在值里原来的位置。
    const harness = mountList({ initialValue: ['name', 'ghost', 'owner', 'status'], props: { reorderable } })
    await settle()
    expect(handleOf('name')).toBeNull()
    const status = handleOf('status')!
    status.focus()
    await click(status)
    await key(status, 'ArrowUp')
    expect(onReorder).toHaveBeenCalledWith({ key: 'status', to: 2 })
    expect(harness.onChange).not.toHaveBeenCalled()
  })

  it('pauses reordering while a search filters the panels', async () => {
    mountList({ props: { hasSearch: true } })
    await settle()
    expect(handleOf('owner')).not.toBeNull()
    const search = document.querySelector<HTMLInputElement>('[role="searchbox"]')!
    search.value = 'own'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()
    expect(handleOf('owner')).toBeNull()
    expect(rowOf('owner')?.getAttribute('data-reorder')).toBeNull()
  })

  it('keeps a disabled list\'s handles focusable but inert, described by why they do not move', async () => {
    const harness = mountList({ props: { isDisabled: true } })
    await settle(3)
    const owner = handleOf('owner')!
    expect(owner.getAttribute('aria-disabled')).toBe('true')
    owner.focus()
    expect(document.activeElement).toBe(owner)
    await click(owner)
    await key(owner, 'ArrowDown')
    expect(owner.getAttribute('aria-pressed')).toBe('false')
    expect(harness.onChange).not.toHaveBeenCalled()
    const ids = (owner.getAttribute('aria-describedby') ?? '').split(' ')
    const described = ids.map(id => document.getElementById(id)?.textContent ?? '').join(' ')
    expect(described).toContain('Owner cannot be reordered')
  })
})
