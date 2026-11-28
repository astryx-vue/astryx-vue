import type { ReorderMove } from '@astryx-vue/core'
import type { Component } from 'vue'
import type { TransferListOption } from './types.js'
import { createReorderable } from '@astryx-vue/core'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import TransferListSelector from './TransferListSelector.vue'

type Column = 'name' | 'owner' | 'status'

const OPTIONS: readonly TransferListOption<Column>[] = [
  { value: 'name', label: 'Name' },
  { value: 'owner', label: 'Owner' },
  { value: 'status', label: 'Status' },
]

const Selector = TransferListSelector as unknown as Component
const mounted: Array<{ unmount: () => void }> = []

afterEach(() => {
  while (mounted.length > 0)
    mounted.pop()!.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function mountSelector(props: Record<string, unknown> = {}) {
  const value = ref<readonly Column[]>(['name', 'owner', 'status'])
  const extra = ref<Record<string, unknown>>({ ...props })
  const onChange = vi.fn((next: readonly Column[]) => {
    value.value = next
  })
  const Harness = defineComponent({
    setup: () => () => h(Selector, {
      'label': 'Visible fields',
      'options': OPTIONS,
      'modelValue': value.value,
      'onUpdate:modelValue': (next: readonly Column[]) => {
        value.value = next
      },
      onChange,
      ...extra.value,
    }),
  })
  mounted.push(mount(Harness, { attachTo: document.body }))
  return {
    value,
    onChange,
    update: async (next: Record<string, unknown>) => {
      extra.value = { ...extra.value, ...next }
      await settle()
    },
  }
}

/** 等 Vue 渲染、重排会话提交、再过两帧。 */
async function settle(): Promise<void> {
  await flushPromises()
  await nextTick()
  for (let frame = 0; frame < 2; frame += 1)
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => setTimeout(resolve, 0))
  await flushPromises()
}

async function openSelector(): Promise<void> {
  const trigger = document.querySelector<HTMLElement>('[aria-haspopup="dialog"]')!
  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
  await settle()
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
}

function rows(): string[] {
  return [...document.querySelectorAll<HTMLElement>('.astryx-popover [data-transfer-list-row]:not([data-astryx-reorder-preview])')]
    .map(row => row.dataset.transferListRow ?? '')
}

function handleOf(value: Column): HTMLButtonElement {
  const handle = document.querySelector<HTMLButtonElement>(
    `.astryx-popover [data-transfer-list-row="${value}"]:not([data-astryx-reorder-preview]) button[data-astryx-list-reorder]`,
  )
  expect(handle, value).not.toBeNull()
  return handle!
}

async function key(target: Element, name: string): Promise<void> {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }))
  await settle()
}

/** 在重排模式里把 `value` 往下挪一格。 */
async function moveDown(value: Column): Promise<void> {
  const handle = handleOf(value)
  handle.focus()
  handle.click()
  await settle()
  await key(handle, 'ArrowDown')
}

async function clickButton(text: string): Promise<void> {
  const button = [...document.querySelectorAll<HTMLButtonElement>('.astryx-popover button')]
    .find(candidate => candidate.textContent?.trim() === text)!
  button.click()
  await settle()
}

describe('transferListSelector reordering', () => {
  it('keeps a staged move in the draft until Apply commits it once', async () => {
    const harness = mountSelector({ commitBehavior: 'staged' })
    await openSelector()
    await moveDown('name')
    expect(rows()).toEqual(['owner', 'name', 'status'])
    expect(harness.onChange).not.toHaveBeenCalled()
    await clickButton('Apply')
    expect(harness.onChange).toHaveBeenCalledTimes(1)
    expect(harness.onChange).toHaveBeenCalledWith(['owner', 'name', 'status'])
  })

  it('drops a staged move on Cancel', async () => {
    const harness = mountSelector({ commitBehavior: 'staged' })
    await openSelector()
    await moveDown('name')
    await clickButton('Cancel')
    expect(harness.onChange).not.toHaveBeenCalled()
    expect(harness.value.value).toEqual(['name', 'owner', 'status'])
  })

  it('moves the draft for a caller\'s `reorderable` while staged, and hands immediate moves to it', async () => {
    const onReorder = vi.fn<(move: ReorderMove<Column>) => void>()
    const reorderable = createReorderable<Column>({ onReorder })
    const harness = mountSelector({ commitBehavior: 'staged', reorderable })
    await openSelector()
    await moveDown('name')
    expect(onReorder).not.toHaveBeenCalled()
    expect(rows()).toEqual(['owner', 'name', 'status'])
    await clickButton('Apply')
    expect(harness.onChange).toHaveBeenCalledWith(['owner', 'name', 'status'])

    await harness.update({ commitBehavior: 'immediate' })
    await openSelector()
    await moveDown('owner')
    expect(onReorder).toHaveBeenCalledWith({ key: 'owner', to: 1 })
  })

  it('ignores a caller\'s move while a commit is pending', async () => {
    const onReorder = vi.fn<(move: ReorderMove<Column>) => void>()
    const reorderable = createReorderable<Column>({ onReorder })
    const harness = mountSelector({ reorderable })
    await openSelector()
    const handle = handleOf('name')
    handle.focus()
    handle.click()
    await settle()
    await harness.update({ isLoading: true })
    await key(handle, 'ArrowDown')
    expect(onReorder).not.toHaveBeenCalled()
  })
})
