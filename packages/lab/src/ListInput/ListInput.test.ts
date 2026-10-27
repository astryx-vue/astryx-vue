import type { Component, VNodeChild } from 'vue'
import type { ListInputColumn } from './types.js'
import { TextInput } from '@astryx-vue/core'
import { renderToString } from '@vue/server-renderer'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import ListInput from './ListInput.vue'

interface Guest {
  id: string
  name: string
}

const guests: Guest[] = [
  { id: 'ada', name: 'Ada' },
  { id: 'grace', name: 'Grace' },
]

const createdGuest: Guest = { id: 'linus', name: 'Linus' }

function textFieldColumn(): ListInputColumn<Guest> {
  return {
    key: 'name',
    header: 'Name',
    renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h('input', {
      'aria-label': label,
      'aria-invalid': status?.type === 'error' || undefined,
      'data-label-hidden': String(isLabelHidden),
      'data-status-type': status?.type,
      'data-status-message': status?.message,
      'data-status-variant': statusVariant,
      'disabled': isDisabled || isLoading,
      'value': item.name,
      'onInput': (event: Event) => updateItem({ ...item, name: (event.target as HTMLInputElement).value }, 'name'),
    }) as VNodeChild,
  }
}

/** 用 core 的 TextInput 画单元格，这样状态走它自带的 tooltip 变体。 */
function nativeTextFieldColumn(onBlur?: (item: Guest) => void): ListInputColumn<Guest> {
  return {
    key: 'name',
    header: 'Name',
    renderInput: ({ item, label, isLabelHidden, status, statusVariant, isDisabled, isLoading, updateItem }) => h(TextInput, {
      label,
      isLabelHidden,
      modelValue: item.name,
      status,
      statusVariant,
      isDisabled,
      isLoading,
      onChange: (name: string) => updateItem({ ...item, name }, 'name'),
      onBlur: () => onBlur?.(item),
    }) as VNodeChild,
  }
}

const ListComponent = ListInput as unknown as Component

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

async function flush(): Promise<void> {
  await nextTick()
  await flushPromises()
  await nextTick()
}

interface ListHarness {
  wrapper: ReturnType<typeof mount>
  value: { value: Guest[] }
  spy: ReturnType<typeof vi.fn>
  update: (next: Record<string, unknown>) => Promise<void>
}

function mountList(options: { initialValue?: Guest[], props?: Record<string, unknown>, columns?: ListInputColumn<Guest>[] } = {}): ListHarness {
  const value = ref<Guest[]>([...(options.initialValue ?? guests)])
  const extra = ref<Record<string, unknown>>({ ...options.props })
  const spy = vi.fn()
  const Harness = defineComponent({
    name: 'ListInputHarness',
    setup() {
      return () => h(ListComponent, {
        'label': 'Guests',
        'itemName': 'guest',
        'modelValue': value.value,
        'getItemKey': (item: Guest) => item.id,
        'createItem': () => createdGuest,
        'columns': options.columns ?? [textFieldColumn()],
        'onUpdate:modelValue': (next: Guest[]) => {
          if (extra.value.commitValue === false)
            return
          value.value = next
        },
        'onChange': (next: Guest[], change: unknown) => {
          spy(next, change)
          if (extra.value.commitValue === false)
            return
          value.value = next
        },
        ...extra.value,
      })
    },
  })
  const wrapper = mount(Harness, { attachTo: document.body })
  return {
    wrapper,
    value: value as { value: Guest[] },
    spy,
    update: async (next) => {
      extra.value = { ...extra.value, ...next }
      await flush()
    },
  }
}

function group(): HTMLElement {
  const node = document.querySelector<HTMLElement>('[role="group"]')
  if (node == null)
    throw new Error('找不到 role=group')
  return node
}

function buttonByLabel(name: string): HTMLButtonElement | null {
  const buttons = document.querySelectorAll<HTMLButtonElement>('button')
  for (const button of buttons) {
    if (button.getAttribute('aria-label') === name || button.textContent?.trim() === name)
      return button
  }
  return null
}

async function clickButton(name: string): Promise<HTMLButtonElement> {
  const button = buttonByLabel(name)
  if (button == null)
    throw new Error(`找不到按钮 ${name}`)
  button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  await flush()
  return button
}

async function pressKey(element: Element, key: string, init: KeyboardEventInit = {}): Promise<void> {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }))
  await flush()
}

function firePointer(element: Element, type: string, init: PointerEventInit = {}): void {
  element.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, ...init }))
}

/** 只看列表里的输入框，拖动预览里的克隆体不算。 */
function inputs(): HTMLInputElement[] {
  return [...group().querySelectorAll<HTMLInputElement>('input')]
}

function inputValues(): string[] {
  return inputs().map(input => input.value)
}

function liveRegionTexts(): string[] {
  return [...document.querySelectorAll('[aria-live="polite"]')].map(node => node.textContent ?? '')
}

describe('listInput', () => {
  it('uses list semantics and shows field labels only on the first record', async () => {
    mountList()
    await flush()

    expect(document.querySelector('[role="table"]')).toBeNull()
    expect(document.querySelector('[role="columnheader"]')).toBeNull()
    // happy-dom 不解析隐式角色，`ol` 就是这里的列表语义锚点。
    expect(document.querySelectorAll('ol.astryx-list-input__list')).toHaveLength(1)

    const all = inputs()
    expect(all[0]?.getAttribute('data-label-hidden')).toBe('true')
    expect(all[0]?.getAttribute('aria-label')).toBe('Name')
    expect(all[1]?.getAttribute('data-label-hidden')).toBe('true')
    expect(all[1]?.getAttribute('aria-label')).toBe('Name, guest 2 of 2')
    expect(all[0]?.getAttribute('data-status-variant')).toBe('tooltip')

    const primary = document.querySelector('[data-list-input-column-label="primary"]')
    const responsive = document.querySelector('[data-list-input-column-label="responsive"]')
    expect(primary?.textContent).toBe('Name')
    expect(primary?.getAttribute('aria-hidden')).toBe('true')
    expect(responsive?.textContent).toBe('Name')
    expect(responsive?.getAttribute('aria-hidden')).toBe('true')
    expect(primary?.closest('[data-list-input-cell]')?.contains(all[0]!)).toBe(true)
    expect(responsive?.closest('[data-list-input-cell]')?.contains(all[1]!)).toBe(true)
  })

  it('never renders aria-required on the group, even when isRequired is set (#4958)', async () => {
    mountList({ props: { isRequired: true } })
    await flush()
    expect(group().hasAttribute('aria-required')).toBe(false)
  })

  it('renders a compact EmptyState and keeps Add available', async () => {
    mountList({ initialValue: [] })
    await flush()

    const emptyState = document.querySelector('.astryx-empty-state')
    expect(emptyState).not.toBeNull()
    expect(emptyState?.getAttribute('data-variant')).toBe('compact')
    // 居中是 styles/list-input.css 里给的，测试环境不加载样式表，这里只查结构。
    const title = document.querySelector('.astryx-empty-state-title')
    expect(title?.textContent).toBe('No guests yet')
    expect(document.body.textContent).toContain('Add a guest to get started.')
    expect(buttonByLabel('Add guest')?.hasAttribute('disabled')).toBe(false)
  })

  it('emits add and remove changes with the affected item and index', async () => {
    // 原版这里只挂一个 spy、不更新受控值，所以两次改动都基于最初那两条记录。
    const harness = mountList({ props: { commitValue: false } })

    await clickButton('Add guest')
    expect(harness.spy).toHaveBeenCalledWith([...guests, createdGuest], { type: 'add', item: createdGuest, index: 2 })

    harness.spy.mockClear()
    await clickButton('Remove guest 1')
    expect(harness.spy).toHaveBeenCalledWith([guests[1]], { type: 'remove', item: guests[0], index: 0 })
  })

  it('renders list/item messages and presents field messages in a tooltip', async () => {
    mountList({
      columns: [nativeTextFieldColumn()],
      props: {
        status: { type: 'error', message: 'Add at least three guests' },
        getItemStatus: (guest: Guest) => guest.id === 'ada' ? { type: 'error', message: 'This guest is duplicated' } : undefined,
        getFieldStatus: (guest: Guest, columnKey: string) => guest.id === 'ada' && columnKey === 'name'
          ? { type: 'error', message: 'Enter a different name' }
          : undefined,
      },
    })
    await flush()

    expect(document.body.textContent).toContain('Add at least three guests')
    expect(document.body.textContent).toContain('This guest is duplicated')

    const firstInput = inputs()[0]!
    expect(firstInput.getAttribute('aria-invalid')).toBe('true')
    // core 的 tooltip 变体把文案渲染成视觉隐藏的状态文本，再接成 aria-describedby，
    // 同时画一个「错误详情」按钮，键盘和读屏都能摸到同一句话。
    expect(document.getElementById(firstInput.getAttribute('aria-describedby')!)?.textContent).toContain('Enter a different name')

    const fieldCell = firstInput.closest('[data-list-input-cell]')
    // core 的 tooltip 变体保留状态文本但整块视觉隐藏，另外画一个信息按钮；
    // 所以这里查的是「它不可见」而不是「它不存在」。
    expect(fieldCell?.querySelector('.astryx-field-status')?.getAttribute('data-hidden')).toBe('true')
    // core 把信息按钮的无障碍名直接写成那句状态文案（原版是「Error details」），更直白。
    expect(buttonByLabel('Enter a different name')).not.toBeNull()
    expect(firstInput.closest('[role="group"][aria-invalid="true"]')).toBeNull()

    const itemStatus = [...document.querySelectorAll('[data-list-input-item-status]')][0]
    const itemRow = document.querySelector('[data-list-input-row="ada"]')
    expect(itemStatus).toBeDefined()
    expect(itemStatus?.parentElement).toBe(itemRow)
    expect(document.querySelectorAll('.astryx-list-input__item')[0]?.getAttribute('aria-describedby')).toContain(itemStatus?.id)
  })

  it('fills the fields track with Add and omits reorder handles by default', async () => {
    mountList()
    await flush()

    const addContent = document.querySelector('[data-list-input-add-content]')
    expect(addContent?.contains(buttonByLabel('Add guest'))).toBe(true)
    expect(buttonByLabel('Add guest')?.getAttribute('data-size')).toBe('md')
    expect(buttonByLabel('Remove guest 1')?.getAttribute('data-size')).toBe('md')
    expect(buttonByLabel('Reorder guest 1')).toBeNull()
  })

  it('supports consumer-owned validation that appears after blur', async () => {
    const touched = ref(new Set<string>())
    const columns: ListInputColumn<Guest>[] = [nativeTextFieldColumn((item) => {
      const next = new Set(touched.value)
      next.add(item.id)
      touched.value = next
    })]
    mountList({
      initialValue: [guests[0]!],
      columns,
      props: {
        createItem: () => ({ id: 'blank', name: '' }),
        getFieldStatus: (guest: Guest, columnKey: string) =>
          touched.value.has(guest.id) && columnKey === 'name' && guest.name.trim() === ''
            ? { type: 'error', message: 'Enter a name' }
            : undefined,
      },
    })

    await clickButton('Add guest')
    // core 的 TextInput 用可见的 label 元素做无障碍名，所以按下标取第二个输入框。
    const added = inputs()[1]
    expect(added).not.toBeNull()
    expect(document.activeElement).toBe(added)
    expect(added?.hasAttribute('aria-invalid')).toBe(false)

    added!.dispatchEvent(new FocusEvent('blur'))
    await flush()
    expect(inputs()[1]?.getAttribute('aria-invalid')).toBe('true')
    const addedInputElement = inputs()[1]
    expect(document.getElementById(addedInputElement?.getAttribute('aria-describedby') ?? '')?.textContent).toContain('Enter a name')
  })

  it('disables Add at maxItems while keeping removal available', async () => {
    const harness = mountList({ props: { maxItems: 2 } })

    expect(buttonByLabel('Add guest')?.hasAttribute('disabled')).toBe(true)
    const remove = buttonByLabel('Remove guest 1')
    expect(remove?.hasAttribute('disabled')).toBe(false)

    await clickButton('Remove guest 1')
    expect(harness.spy).toHaveBeenCalledWith([guests[1]], { type: 'remove', item: guests[0], index: 0 })
  })

  it('moves a focused handle with arrow keys without showing a tooltip', async () => {
    const harness = mountList({ props: { isReorderable: true } })
    const handle = buttonByLabel('Reorder guest 1')!
    expect(handle.getAttribute('data-size')).toBe('md')
    expect(handle.getAttribute('aria-describedby')).not.toContain('tooltip')
    expect(handle.getAttribute('aria-describedby')).toBeTruthy()

    handle.focus()
    await pressKey(handle, 'ArrowDown', { altKey: true })
    expect(harness.spy).not.toHaveBeenCalled()

    await pressKey(handle, 'ArrowUp')
    expect(harness.spy).not.toHaveBeenCalled()

    await pressKey(handle, 'ArrowDown')
    expect(harness.spy).toHaveBeenCalledTimes(1)
    expect(harness.spy).toHaveBeenCalledWith([guests[1], guests[0]], { type: 'reorder', item: guests[0], fromIndex: 0, toIndex: 1 })
    expect(inputValues()).toEqual(['Grace', 'Ada'])
    expect(document.activeElement).toBe(handle)
    // 立刻提交之后手柄属于第二条记录。
    expect(buttonByLabel('Reorder guest 2')).not.toBeNull()
    expect(document.querySelector('[data-list-input-reorder-source]')).toBeNull()
  })

  it('commits a keyboard reorder with change metadata', async () => {
    const harness = mountList({ props: { isReorderable: true } })
    const handle = buttonByLabel('Reorder guest 1')!
    expect(handle.querySelectorAll('circle')).toHaveLength(6)

    handle.focus()
    await pressKey(handle, ' ', { code: 'Space' })
    let source = document.querySelector('[data-list-input-reorder-source]')
    expect(source?.closest('li')?.getAttribute('aria-posinset')).toBe('1')
    expect(source?.querySelector('input')?.value).toBe('Ada')

    await pressKey(handle, 'ArrowDown')
    source = document.querySelector('[data-list-input-reorder-source]')
    expect(source?.closest('li')?.getAttribute('aria-posinset')).toBe('2')
    expect(source?.querySelector('input')?.value).toBe('Ada')

    await pressKey(handle, 'Enter')

    expect(harness.spy).toHaveBeenCalledWith([guests[1], guests[0]], { type: 'reorder', item: guests[0], fromIndex: 0, toIndex: 1 })
    expect(document.querySelector('[data-list-input-reorder-source]')).toBeNull()
  })

  it('moves a picked-up record to the first and last positions with Home and End', async () => {
    const harness = mountList({ initialValue: [...guests, createdGuest], props: { isReorderable: true } })
    const handle = buttonByLabel('Reorder guest 3')!
    handle.focus()
    await pressKey(handle, ' ', { code: 'Space' })

    await pressKey(handle, 'Home')
    expect(document.querySelector('[data-list-input-reorder-source]')?.closest('li')?.getAttribute('aria-posinset')).toBe('1')

    await pressKey(handle, 'End')
    expect(document.querySelector('[data-list-input-reorder-source]')?.closest('li')?.getAttribute('aria-posinset')).toBe('3')

    await pressKey(handle, 'Home')
    await pressKey(handle, 'Enter')
    expect(harness.spy).toHaveBeenCalledWith([createdGuest, guests[0], guests[1]], { type: 'reorder', item: createdGuest, fromIndex: 2, toIndex: 0 })
  })

  it('cancels a keyboard reorder with Escape', async () => {
    const harness = mountList({ props: { isReorderable: true } })
    const handle = buttonByLabel('Reorder guest 1')!
    handle.focus()
    await pressKey(handle, 'Enter')
    await pressKey(handle, 'ArrowDown')
    await pressKey(handle, 'Escape')

    expect(harness.spy).not.toHaveBeenCalled()
    expect(document.querySelector('[data-list-input-reorder-source]')).toBeNull()
    expect(inputValues()).toEqual(['Ada', 'Grace'])
  })

  it('keeps pointer order stationary and commits once on release', async () => {
    const harness = mountList({ initialValue: [...guests, createdGuest], props: { isReorderable: true } })
    const rows = [...document.querySelectorAll<HTMLElement>('[data-list-input-row]')]
    rows.forEach((row, index) => {
      const top = index * 40
      vi.spyOn(row, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: top,
        top,
        right: 400,
        bottom: top + 40,
        left: 0,
        width: 400,
        height: 40,
        toJSON: () => {},
      } as DOMRect)
    })
    const handle = buttonByLabel('Reorder guest 2')!

    firePointer(handle, 'pointerdown', { button: 0, pointerId: 7, clientX: 300, clientY: 50 })
    await flush()

    const source = document.querySelector('[data-list-input-reorder-source]')
    const preview = document.querySelector<HTMLElement>('[data-list-input-drag-preview]')
    expect(source).toBe(rows[1])
    expect(preview).not.toBeNull()
    expect(preview?.getAttribute('aria-hidden')).toBe('true')
    expect(preview?.querySelector('input')?.value).toBe('Grace')
    expect(preview?.style.top).toBe('40px')
    expect(document.querySelector('[data-list-input-drop-target]')).toBeNull()

    firePointer(handle, 'pointermove', { pointerId: 7, clientX: 345, clientY: 5 })
    await flush()
    expect(preview?.style.top).toBe('-5px')
    expect(preview?.style.left).toBe('45px')
    expect([...document.querySelectorAll<HTMLElement>('[data-list-input-row]')]).toEqual(rows)
    expect(inputValues()).toEqual(['Ada', 'Grace', 'Linus'])
    expect(harness.spy).not.toHaveBeenCalled()
    expect(rows[0]?.closest('li')?.getAttribute('data-list-input-drop-target')).toBe('before')

    firePointer(handle, 'pointermove', { pointerId: 7, clientX: 245, clientY: 115 })
    await flush()
    expect(rows[0]?.closest('li')?.getAttribute('data-list-input-drop-target')).toBeNull()
    expect(rows[2]?.closest('li')?.getAttribute('data-list-input-drop-target')).toBe('after')
    expect(harness.spy).not.toHaveBeenCalled()

    firePointer(handle, 'pointerup', { pointerId: 7, clientX: 245, clientY: 115 })
    await flush()

    expect(harness.spy).toHaveBeenCalledTimes(1)
    expect(harness.spy).toHaveBeenCalledWith([guests[0], createdGuest, guests[1]], { type: 'reorder', item: guests[1], fromIndex: 1, toIndex: 2 })
    expect(document.querySelector('[data-list-input-drop-target]')).toBeNull()
    expect(document.querySelector('[data-list-input-drag-preview]')).toBeNull()
  })

  it('clears a sub-threshold pointer drag without reordering', async () => {
    const harness = mountList({ props: { isReorderable: true } })
    const handle = buttonByLabel('Reorder guest 1')!

    firePointer(handle, 'pointerdown', { button: 0, pointerId: 8, clientX: 10, clientY: 10 })
    await flush()
    firePointer(handle, 'pointermove', { pointerId: 8, clientX: 14, clientY: 10 })
    await flush()

    expect(document.querySelector('[data-list-input-reorder-source]')).not.toBeNull()
    expect(document.querySelector('[data-list-input-drag-preview]')).not.toBeNull()
    expect(document.querySelector('[data-list-input-drop-target]')).toBeNull()

    firePointer(handle, 'pointerup', { pointerId: 8, clientX: 14, clientY: 10 })
    await flush()

    expect(harness.spy).not.toHaveBeenCalled()
    expect(document.querySelector('[data-list-input-reorder-source]')).toBeNull()
    expect(document.querySelector('[data-list-input-drag-preview]')).toBeNull()
  })

  it('activates a pointer drag after horizontal threshold movement and announces a return', async () => {
    const harness = mountList({ props: { isReorderable: true } })
    const rows = [...document.querySelectorAll<HTMLElement>('[data-list-input-row]')]
    rows.forEach((row, index) => {
      const top = index * 40
      vi.spyOn(row, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: top,
        top,
        right: 400,
        bottom: top + 40,
        left: 0,
        width: 400,
        height: 40,
        toJSON: () => {},
      } as DOMRect)
    })
    const handle = buttonByLabel('Reorder guest 1')!

    firePointer(handle, 'pointerdown', { button: 0, pointerId: 9, clientX: 10, clientY: 10 })
    await flush()
    firePointer(handle, 'pointermove', { pointerId: 9, clientX: 15, clientY: 10 })
    await flush()
    firePointer(handle, 'pointerup', { pointerId: 9, clientX: 15, clientY: 10 })
    await flush()

    expect(harness.spy).not.toHaveBeenCalled()
    expect(liveRegionTexts()).toContain('guest returned to position 1.')
  })

  it('locks every field and mutation control when isDisabled is set', async () => {
    const harness = mountList({ props: { isDisabled: true, isReorderable: true } })

    expect(group().getAttribute('aria-disabled')).toBe('true')
    expect(group().hasAttribute('aria-busy')).toBe(false)

    for (const field of inputs())
      expect(field.hasAttribute('disabled')).toBe(true)
    expect(buttonByLabel('Add guest')?.hasAttribute('disabled')).toBe(true)
    expect(buttonByLabel('Reorder guest 1')?.hasAttribute('disabled')).toBe(true)
    // Remove 带提示气泡，所以走 aria 禁用，仍然能聚焦读到原因。
    expect(buttonByLabel('Remove guest 1')?.getAttribute('aria-disabled')).toBe('true')

    expect(inputs()[0]?.value).toBe('Ada')
    expect(harness.spy).not.toHaveBeenCalled()
  })

  it('marks the list busy and locks the same controls when isLoading is set', async () => {
    mountList({ props: { isLoading: true, isReorderable: true } })

    expect(group().getAttribute('aria-busy')).toBe('true')
    expect(group().hasAttribute('aria-disabled')).toBe(false)

    for (const field of inputs())
      expect(field.hasAttribute('disabled')).toBe(true)
    expect(buttonByLabel('Add guest')?.hasAttribute('disabled')).toBe(true)
    expect(buttonByLabel('Reorder guest 1')?.hasAttribute('disabled')).toBe(true)
    expect(buttonByLabel('Remove guest 1')?.getAttribute('aria-disabled')).toBe('true')
  })

  it('cancels an in-flight keyboard reorder when the list becomes busy', async () => {
    const harness = mountList({ props: { isReorderable: true } })
    const handle = buttonByLabel('Reorder guest 1')!
    handle.focus()
    await pressKey(handle, ' ', { code: 'Space' })
    expect(document.querySelector('[data-list-input-reorder-source]')).not.toBeNull()

    await harness.update({ isLoading: true })

    // 拿起被放弃，而不是提交，所以不会有顺序改动漏出去。
    expect(document.querySelector('[data-list-input-reorder-source]')).toBeNull()
    expect(harness.spy).not.toHaveBeenCalled()
  })

  it('describes list status from the group and item status from its row', async () => {
    const harness = mountList({ props: { status: { type: 'warning', message: 'Two guests share a name.' } } })

    const describedBy = group().getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)?.textContent).toContain('Two guests share a name.')

    await harness.update({ status: { type: 'success', message: 'Every guest is confirmed.' } })
    expect(document.body.textContent).toContain('Every guest is confirmed.')

    await harness.update({
      status: { type: 'error', message: 'Add at least three guests.' },
      getItemStatus: (guest: Guest) => guest.id === 'grace' ? { type: 'error', message: 'Grace is already invited.' } : undefined,
    })

    const listDescribedBy = group().getAttribute('aria-describedby')
    expect(document.getElementById(listDescribedBy!)?.textContent).toContain('Add at least three guests.')

    // 行级状态属于那一行，读第二条记录时不会串到第一条的消息。
    const rows = document.querySelectorAll('.astryx-list-input__item')
    expect(rows[0]?.hasAttribute('aria-invalid')).toBe(false)
    expect(rows[1]?.getAttribute('aria-invalid')).toBe('true')
    const rowDescribedBy = rows[1]?.getAttribute('aria-describedby')
    expect(document.getElementById(rowDescribedBy!)?.textContent).toContain('Grace is already invited.')
  })

  it('moves focus to the next record after a removal, and to Add when the list empties', async () => {
    mountList({ initialValue: [guests[0]!] })
    await clickButton('Add guest')
    expect(document.activeElement).toBe(document.querySelector('input[aria-label="Name, guest 2 of 2"]'))

    await clickButton('Remove guest 1')
    expect(document.querySelectorAll('.astryx-list-input__item')).toHaveLength(1)
    // 删掉第一条之后，焦点落到顶上来的那条的删除按钮，键盘用户能连着删。
    expect(document.activeElement).toBe(document.querySelector('[data-list-input-remove]'))

    await clickButton('Remove guest 1')
    expect(document.querySelectorAll('.astryx-list-input__item')).toHaveLength(0)
    expect(document.activeElement).toBe(buttonByLabel('Add guest'))
  })

  it('warns when getItemKey returns a duplicate key', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mountList({ initialValue: [guests[0]!, { ...guests[1]!, id: guests[0]!.id }] })
    await flush()
    expect(warn.mock.calls.flat().join(' ')).toContain('ListInput: getItemKey returned duplicate key')
  })

  it.todo('keeps Add under the pointer in the nearest newly scrollable container 依赖浏览器滚动几何与 rAF，测试环境量不到，滚动锚定按上游算法实现在 ListInput.vue 里')
  it.todo('anchors from pointer down before blur-driven validation changes layout 同上，属于滚动锚定的分支')
  it.todo('checks every clipping ancestor before preserving focused-field visibility 同上')
  it.todo('animates live add and removal reflow after the controlled change 原版用 Web Animations 做列表重排动画，本实现没搬动效（见回报第 3 节）')
  it.todo('uses instant add and remove changes when reduced motion is requested 同上，没有动效就没有降级路径')

  it('renders on the server', async () => {
    const app = createSSRApp({
      render: () => h(ListComponent, {
        label: 'Guests',
        itemName: 'guest',
        modelValue: guests,
        getItemKey: (item: Guest) => item.id,
        createItem: () => createdGuest,
        columns: [textFieldColumn()],
      }),
    })
    const html = await renderToString(app)
    expect(html).toContain('astryx-list-input')
    expect(html).toContain('role="group"')
    expect(html).toContain('Add guest')
  })
})
