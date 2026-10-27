import type { Component } from 'vue'
import type { TransferListOption } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import TransferListSelector from './TransferListSelector.vue'

type Column = 'name' | 'owner' | 'status' | 'updated'

const OPTIONS: readonly TransferListOption<Column>[] = [
  { value: 'name', label: 'Name' },
  { value: 'owner', label: 'Owner' },
  { value: 'status', label: 'Status' },
  { value: 'updated', label: 'Updated' },
]

const Selector = TransferListSelector as unknown as Component

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

async function flush(): Promise<void> {
  await nextTick()
  await flushPromises()
  await nextTick()
}

interface Harness {
  wrapper: ReturnType<typeof mount>
  value: { value: readonly Column[] }
  applied: () => string
  spy: ReturnType<typeof vi.fn>
  changeAction: ReturnType<typeof vi.fn>
  update: (next: Record<string, unknown>) => Promise<void>
}

function mountSelector(options: { initialValue?: readonly Column[], props?: Record<string, unknown>, commitValue?: boolean } = {}): Harness {
  const value = ref<readonly Column[]>(options.initialValue ?? ['name', 'status'])
  const extra = ref<Record<string, unknown>>({ ...options.props })
  const spy = vi.fn()
  const changeAction = vi.fn()
  const Harness = defineComponent({
    name: 'TransferListSelectorHarness',
    setup() {
      return () => h('div', [
        h('output', { 'data-testid': 'applied-value' }, JSON.stringify(value.value)),
        h(Selector, {
          'label': 'Visible fields',
          'options': OPTIONS,
          'modelValue': value.value,
          'changeAction': changeAction,
          'onUpdate:modelValue': (next: readonly Column[]) => {
            if (options.commitValue !== false)
              value.value = next
          },
          'onChange': (next: readonly Column[]) => {
            if (options.commitValue !== false)
              value.value = next
            spy(next)
          },
          ...extra.value,
        }),
      ])
    },
  })
  const wrapper = mount(Harness, { attachTo: document.body })
  return {
    wrapper,
    value: value as { value: readonly Column[] },
    applied: () => wrapper.get('[data-testid="applied-value"]').text(),
    spy,
    changeAction,
    update: async (next) => {
      extra.value = { ...extra.value, ...next }
      await flush()
    },
  }
}

function triggerButton(): HTMLElement {
  const trigger = document.querySelector<HTMLElement>('[aria-haspopup="dialog"]')
  if (trigger == null)
    throw new Error('找不到触发器')
  return trigger
}

function popover(): HTMLElement {
  const node = document.querySelector<HTMLElement>('.astryx-popover')
  if (node == null)
    throw new Error('找不到弹层')
  return node
}

async function openSelector(): Promise<HTMLElement> {
  const trigger = triggerButton()
  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
  await flush()
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  return trigger
}

function buttonInPopover(name: string): HTMLButtonElement | null {
  const buttons = popover().querySelectorAll<HTMLButtonElement>('button')
  for (const button of buttons) {
    if (button.getAttribute('aria-label') === name || button.textContent?.trim() === name)
      return button
  }
  return null
}

async function clickInPopover(name: string): Promise<void> {
  const button = buttonInPopover(name)
  if (button == null)
    throw new Error(`弹层里找不到按钮 ${name}`)
  button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  await flush()
}

describe('transferListSelector', () => {
  it('commits each edit immediately by default and renders no footer', async () => {
    const harness = mountSelector()
    const trigger = await openSelector()

    expect(buttonInPopover('Apply')).toBeNull()
    expect(buttonInPopover('Cancel')).toBeNull()

    await clickInPopover('Add Owner')

    expect(harness.spy).toHaveBeenCalledTimes(1)
    expect(harness.spy).toHaveBeenCalledWith(['name', 'status', 'owner'])
    expect(harness.changeAction).toHaveBeenCalledTimes(1)
    expect(harness.changeAction).toHaveBeenCalledWith(['name', 'status', 'owner'])
    expect(harness.applied()).toBe('["name","status","owner"]')
    expect(trigger.textContent).toContain('3 selected')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    // Escape 关掉弹层，再打开时新值已经在列表里。
    popover().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flush()
    expect(triggerButton().getAttribute('aria-expanded')).toBe('false')

    await openSelector()
    expect(buttonInPopover('Remove Owner')).not.toBeNull()
    expect(harness.applied()).toBe('["name","status","owner"]')
  })

  it('discards a staged draft whenever commit behavior changes', async () => {
    const harness = mountSelector({ props: { commitBehavior: 'staged' } })
    await openSelector()

    await clickInPopover('Add Owner')
    expect(buttonInPopover('Remove Owner')).not.toBeNull()

    await harness.update({ commitBehavior: 'immediate' })
    expect(buttonInPopover('Add Owner')).not.toBeNull()
    expect(harness.spy).not.toHaveBeenCalled()

    await harness.update({ commitBehavior: 'staged' })
    expect(buttonInPopover('Add Owner')).not.toBeNull()
    expect(buttonInPopover('Remove Name')).not.toBeNull()
    expect(buttonInPopover('Remove Status')).not.toBeNull()
    expect(harness.spy).not.toHaveBeenCalled()
  })

  it('keeps edits in a staged draft and commits a changed ordered copy once', async () => {
    const harness = mountSelector({ props: { commitBehavior: 'staged' } })
    const trigger = await openSelector()
    await clickInPopover('Add Owner')

    expect(harness.applied()).toBe('["name","status"]')
    expect(trigger.textContent).toContain('2 selected')
    expect(harness.spy).not.toHaveBeenCalled()

    await clickInPopover('Apply')

    expect(harness.spy).toHaveBeenCalledTimes(1)
    expect(harness.spy).toHaveBeenCalledWith(['name', 'status', 'owner'])
    expect(harness.changeAction).toHaveBeenCalledTimes(1)
    expect(harness.changeAction).toHaveBeenCalledWith(['name', 'status', 'owner'])
    expect(harness.applied()).toBe('["name","status","owner"]')
    expect(trigger.textContent).toContain('3 selected')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes unchanged Apply without calling onChange or changeAction', async () => {
    const harness = mountSelector({ props: { commitBehavior: 'staged' } })
    const trigger = await openSelector()
    await clickInPopover('Apply')

    expect(harness.spy).not.toHaveBeenCalled()
    expect(harness.changeAction).not.toHaveBeenCalled()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('discards drafts after Cancel and Escape', async () => {
    const harness = mountSelector({ props: { commitBehavior: 'staged' } })

    let trigger = await openSelector()
    await clickInPopover('Remove Name')
    await clickInPopover('Cancel')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    trigger = await openSelector()
    expect(buttonInPopover('Remove Name')).not.toBeNull()
    await clickInPopover('Remove Status')
    popover().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flush()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await openSelector()
    expect(buttonInPopover('Remove Status')).not.toBeNull()
    expect(harness.applied()).toBe('["name","status"]')
    expect(harness.spy).not.toHaveBeenCalled()
  })

  it('syncs differing applied values without clearing a dirty draft for equal arrays', async () => {
    const harness = mountSelector({ props: { commitBehavior: 'staged' } })
    await openSelector()

    await clickInPopover('Add Owner')
    expect(buttonInPopover('Remove Owner')).not.toBeNull()

    // 外部给了一个内容相同但引用不同的数组：草稿留着。
    harness.value.value = ['name', 'status']
    await flush()
    expect(buttonInPopover('Remove Owner')).not.toBeNull()

    // 外部给了不同的值：草稿丢掉，换成新值。
    harness.value.value = ['owner', 'updated']
    await flush()
    expect(buttonInPopover('Remove Updated')).not.toBeNull()
    expect(buttonInPopover('Remove Owner')).not.toBeNull()
    expect(buttonInPopover('Add Name')).not.toBeNull()
  })

  it('defaults the trigger label to the applied selected count', () => {
    mountSelector({ initialValue: ['name', 'owner', 'updated'] })
    expect(triggerButton().textContent).toContain('3 selected')
  })

  it('disables list controls when disabled, but never when merely busy', async () => {
    const harness = mountSelector({ initialValue: ['name'], props: { commitBehavior: 'staged' } })
    await openSelector()

    await harness.update({ isDisabled: true })
    const fieldset = popover().querySelector('fieldset')
    expect(fieldset).not.toBeNull()
    expect(fieldset?.hasAttribute('disabled')).toBe(true)

    const cancel = buttonInPopover('Cancel')
    const apply = buttonInPopover('Apply')
    expect(cancel?.hasAttribute('disabled')).toBe(false)
    expect(fieldset?.contains(cancel)).toBe(false)
    expect(apply?.hasAttribute('disabled')).toBe(true)
    expect(triggerButton().hasAttribute('disabled')).toBe(true)

    await harness.update({ isDisabled: false, isLoading: true })
    expect(popover().querySelector('[aria-busy="true"]')).not.toBeNull()
    // 提交中只用 aria-busy 表示，不禁用整个字段区：禁用会把刚点的那一行按钮
    // 的焦点丢掉，焦点会掉回 body。
    expect(popover().querySelector('fieldset')?.hasAttribute('disabled')).toBe(false)
    expect(buttonInPopover('Cancel')?.hasAttribute('disabled')).toBe(false)
    expect(buttonInPopover('Apply')?.hasAttribute('disabled')).toBe(true)
  })

  it('keeps focus inside the popup while a change is pending', async () => {
    const harness = mountSelector({ initialValue: ['name'] })
    await openSelector()

    const addStatus = buttonInPopover('Add Status')
    expect(addStatus).not.toBeNull()
    ;(addStatus as HTMLButtonElement).focus()
    await clickInPopover('Add Status')
    // core 的 ComplexSelector 会先乐观更新自己的值，所以这一行会立刻搬到已选栏，
    // 焦点按「转移后落到同侧下一个操作」的规则交给下一个可选行的加一项按钮。
    // 原版在这里断言焦点留在刚点的那个按钮上，依赖它自己的 Popover 不做乐观更新。
    expect(popover().contains(document.activeElement)).toBe(true)
    expect(document.activeElement).not.toBe(document.body)

    await harness.update({ isLoading: true })
    expect(popover().querySelector('[aria-busy="true"]')).not.toBeNull()
    // 关键点：提交中不禁用字段区，所以焦点不会掉回 body。
    expect(document.activeElement).not.toBe(document.body)
  })

  it('forwards intentional selector shell and transfer-list content props', async () => {
    mountSelector({
      initialValue: ['name'],
      props: {
        label: 'Table columns',
        description: 'Choose the columns shown in the table.',
        triggerLabel: 'Customize columns',
        size: 'sm',
        placement: 'below',
        selectedLabel: 'Shown',
        availableLabel: 'Hidden',
        hasSearch: true,
        searchPlaceholder: 'Find a column',
        isReorderable: false,
        hasSelectAll: true,
        hasClear: true,
        commitBehavior: 'staged',
        applyLabel: 'Save columns',
        cancelLabel: 'Discard changes',
      },
    })

    expect(document.body.textContent).toContain('Choose the columns shown in the table.')
    // `data-size` 落在触发器按钮上，宽度变量落在字段外壳上。
    expect(triggerButton().getAttribute('data-size')).toBe('sm')
    expect(triggerButton().textContent).toContain('Customize columns')
    expect(document.querySelector<HTMLElement>('.astryx-field')?.style.getPropertyValue('--astryx-field-width'))
      .toBe('min(41rem, calc(100vw - 32px))')

    await openSelector()
    expect(popover().querySelector<HTMLInputElement>('input[placeholder="Find a column"]')).not.toBeNull()
    expect(popover().textContent).toContain('Shown')
    expect(popover().textContent).toContain('Hidden')
    expect(buttonInPopover('Save columns')).not.toBeNull()
    expect(buttonInPopover('Discard changes')).not.toBeNull()
    expect(buttonInPopover('Reorder Name')).toBeNull()
    expect(buttonInPopover('Add all')).not.toBeNull()
    expect(buttonInPopover('Clear')).not.toBeNull()
  })

  it.todo('replaces a staged draft in the same render pass as an external value change 的原版断言用 React Profiler 数渲染帧，Vue 没有等价物；草稿同步改成同步 watcher 实现，行为已由「syncs differing applied values」覆盖')

  it('renders on the server', async () => {
    const app = createSSRApp({
      render: () => h(Selector, {
        label: 'Visible fields',
        options: OPTIONS,
        modelValue: ['name'],
      }),
    })
    const html = await renderToString(app)
    expect(html).toContain('astryx-complex-selector')
    expect(html).toContain('1 selected')
  })
})
