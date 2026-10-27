import type { Component } from 'vue'
import type { TransferListOption } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import TransferList from './TransferList.vue'

const OPTIONS: readonly TransferListOption[] = [
  { value: 'name', label: 'Name', description: 'Primary identifier', group: 'Identity' },
  { value: 'owner', label: 'Owner', group: 'Identity' },
  { value: 'status', label: 'Status', group: 'Details' },
  { value: 'updated', label: 'Updated', group: 'Details' },
]

const LOCKED_OPTIONS: readonly TransferListOption[] = [
  OPTIONS[0]!,
  { value: 'owner', label: 'Owner', group: 'Identity', isTransferDisabled: true, isReorderDisabled: true, disabledMessage: 'Owner is required and fixed in position.' },
  OPTIONS[2]!,
  OPTIONS[3]!,
]

const TRANSFER_LOCKED_OPTIONS: readonly TransferListOption[] = [
  OPTIONS[0]!,
  { value: 'owner', label: 'Owner', group: 'Identity', isTransferDisabled: true, disabledMessage: 'Owner is required.' },
  OPTIONS[2]!,
  OPTIONS[3]!,
]

const REORDER_LOCKED_OPTIONS: readonly TransferListOption[] = [
  OPTIONS[0]!,
  { value: 'owner', label: 'Owner', group: 'Identity', isReorderDisabled: true, disabledMessage: 'Owner has a fixed position.' },
  OPTIONS[2]!,
  OPTIONS[3]!,
]

const ListComponent = TransferList as unknown as Component

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

async function flush(): Promise<void> {
  await nextTick()
  await flushPromises()
  await nextTick()
}

interface HarnessOptions {
  initialValue?: readonly string[]
  options?: readonly TransferListOption[]
  spy?: (value: readonly string[]) => void
  extra?: Record<string, unknown>
  slots?: Record<string, (scope: { option: TransferListOption }) => unknown>
}

function makeHarness(options: HarnessOptions = {}): Component {
  return defineComponent({
    name: 'TransferListHarness',
    setup() {
      const value = ref<readonly string[]>(options.initialValue ?? [])
      return () => h(ListComponent, {
        'label': 'Columns',
        'selectedLabel': 'Selected columns',
        'availableLabel': 'Available columns',
        'options': options.options ?? OPTIONS,
        'modelValue': value.value,
        'onUpdate:modelValue': (next: readonly string[]) => {
          value.value = next
        },
        'onChange': (next: readonly string[]) => {
          value.value = next
          options.spy?.(next)
        },
        ...options.extra,
      }, options.slots)
    },
  })
}

function mountList(options: HarnessOptions = {}) {
  return mount(makeHarness(options), { attachTo: document.body })
}

function panel(wrapper: ReturnType<typeof mountList>, side: 'selected' | 'available') {
  return wrapper.get(`.astryx-transfer-list-panel[data-side="${side}"]`)
}

/** 按无障碍名找 `role="list"`：名字来自 `aria-labelledby` 指向的元素。 */
function listByName(wrapper: ReturnType<typeof mountList>, name: string) {
  const list = wrapper.findAll('[role="list"]').find((node) => {
    const id = node.attributes('aria-labelledby')
    if (id == null)
      return false
    const node2 = wrapper.element.querySelector(`[id="${id}"]`)
    return node2?.textContent?.trim() === name
  })
  if (list == null)
    throw new Error(`找不到名为 ${name} 的列表`)
  return list
}

function rowTexts(wrapper: ReturnType<typeof mountList>) {
  return panel(wrapper, 'selected').findAll('li.astryx-transfer-list-item').map(row => row.text().trim())
}

function findButton(wrapper: ReturnType<typeof mountList>, name: string) {
  return wrapper.findAll('button').find(node =>
    node.attributes('aria-label') === name || node.text().trim() === name,
  )
}

function buttonByName(wrapper: ReturnType<typeof mountList>, name: string) {
  const button = findButton(wrapper, name)
  if (button == null)
    throw new Error(`找不到按钮 ${name}`)
  return button
}

function firePointer(element: Element, type: string, init: PointerEventInit = {}): void {
  element.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, ...init }))
}

/** 原生派发一次点击。`trigger` 在这条链路上会把焦点弄丢，和真实浏览器不一致。 */
async function clickElement(element: Element): Promise<void> {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  await flush()
}

/** 原生派发一次按键。按钮上的 Enter / 空格在浏览器里会变成一次 click。 */
async function pressKey(element: Element, key: string): Promise<void> {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await flush()
}

function mockRowBounds(rows: ReadonlyArray<Element>): void {
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
}

function selectedRows(wrapper: ReturnType<typeof mountList>): Element[] {
  return [...panel(wrapper, 'selected').element.querySelectorAll('[data-transfer-list-row]')]
}

describe('transferList', () => {
  describe('semantics and content', () => {
    it('renders a labelled pair of semantic lists without listbox roles', () => {
      const wrapper = mountList({
        initialValue: ['name', 'status'],
        extra: {
          label: 'Table columns',
          description: 'Choose and order the columns shown in the table.',
          selectedLabel: 'Shown columns',
          availableLabel: 'Hidden columns',
        },
      })

      expect(wrapper.text()).toContain('Table columns')
      expect(wrapper.text()).toContain('Choose and order the columns shown in the table.')
      expect(listByName(wrapper, 'Shown columns').exists()).toBe(true)
      expect(listByName(wrapper, 'Hidden columns').exists()).toBe(true)
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(wrapper.find('[role="option"]').exists()).toBe(false)
    })

    it('uses one divided collection with direction-neutral row actions', () => {
      const wrapper = mountList({ initialValue: ['name', 'status'], extra: { hasClear: true, hasSelectAll: true } })

      const collection = wrapper.get('.astryx-transfer-list-collection')
      expect(collection.element.querySelectorAll(':scope > .astryx-transfer-list-panel')).toHaveLength(2)
      expect(wrapper.text()).not.toContain('2 items')

      expect(buttonByName(wrapper, 'Clear').attributes('data-transfer-list-header-action')).toBe('true')
      expect(buttonByName(wrapper, 'Add all').attributes('data-transfer-list-header-action')).toBe('true')

      const addButton = buttonByName(wrapper, 'Add Owner')
      const removeButton = buttonByName(wrapper, 'Remove Name')
      expect(addButton.element.querySelector('.astryx-icon')).not.toBeNull()
      expect(addButton.element.querySelector('svg')).not.toBeNull()
      expect(removeButton.element.querySelector('.astryx-icon')).not.toBeNull()
      // core 的 `close` 是内置字形，画成 CSS 遮罩的 span，不是内联 svg；图标原语照样在。
      expect(removeButton.element.querySelector('.astryx-icon__glyph')).not.toBeNull()

      const nameRow = panel(wrapper, 'selected').findAll('li.astryx-transfer-list-item')[0]!
      const rowButtons = nameRow.findAll('button')
      expect(rowButtons[0]!.attributes('aria-label')).toBe('Reorder Name')
      expect(rowButtons[0]!.element.querySelector('.astryx-icon')).not.toBeNull()
      expect(rowButtons[1]!.attributes('aria-label')).toBe('Remove Name')
    })

    it('keeps support metadata out of rows while retaining search and groups', async () => {
      const wrapper = mountList({ initialValue: ['name', 'status'], extra: { hasSearch: true } })

      expect(wrapper.text()).not.toContain('Primary identifier')
      expect(wrapper.text()).toContain('Identity')
      expect(wrapper.text()).toContain('Details')

      const search = wrapper.get('[role="searchbox"]')
      await search.setValue('primary identifier')
      await flush()
      expect(wrapper.text()).toContain('Name')
      expect(wrapper.text()).not.toContain('Owner')
    })

    it('renders custom option content for selected and available values', () => {
      const wrapper = mountList({
        initialValue: ['name'],
        slots: {
          option: ({ option }) => h('span', { 'data-testid': `custom-${option.value}` }, `Custom ${option.label}`),
        },
      })

      expect(wrapper.get('[data-testid="custom-name"]').text()).toBe('Custom Name')
      expect(wrapper.get('[data-testid="custom-status"]').text()).toBe('Custom Status')
    })

    it('renders custom empty-state copy for both panels', () => {
      const wrapper = mountList({
        initialValue: [],
        extra: { selectedEmptyText: 'Nothing is shown', availableEmptyText: 'Nothing else is available' },
      })

      expect(wrapper.text()).toContain('Nothing is shown')

      // 换一个受控值：全部选中之后可选栏空了。
      const all = mountList({
        initialValue: OPTIONS.map(option => option.value),
        extra: { selectedEmptyText: 'Nothing is shown', availableEmptyText: 'Nothing else is available' },
      })
      expect(all.text()).toContain('Nothing else is available')
    })
  })

  describe('transfers and filtering', () => {
    it('appends an added value and preserves selected order when removing', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['status', 'name'], spy })

      await buttonByName(wrapper, 'Add Owner').trigger('click')
      await flush()
      expect(spy).toHaveBeenLastCalledWith(['status', 'name', 'owner'])

      await buttonByName(wrapper, 'Remove Name').trigger('click')
      await flush()
      expect(spy).toHaveBeenLastCalledWith(['status', 'owner'])
    })

    it('filters both panels with the shared search field', async () => {
      const wrapper = mountList({
        initialValue: ['name', 'status'],
        extra: { hasSearch: true, searchLabel: 'Filter columns', searchPlaceholder: 'Find a column', noResultsText: 'No matching columns' },
      })

      const search = wrapper.get('[role="searchbox"]')
      expect(search.attributes('placeholder')).toBe('Find a column')

      await search.setValue('owner')
      await flush()
      expect(wrapper.text()).toContain('Owner')
      expect(wrapper.text()).not.toContain('Updated')
      expect(wrapper.text()).toContain('No matching columns')
    })

    it('disables search and enables reordering by default', () => {
      const wrapper = mountList({ initialValue: ['name'] })

      expect(wrapper.find('[role="searchbox"]').exists()).toBe(false)
      expect(findButton(wrapper, 'Reorder Name')).toBeDefined()
    })

    it('can turn on search and turn off reordering', () => {
      const wrapper = mountList({ initialValue: ['name'], extra: { hasSearch: true, isReorderable: false } })

      expect(wrapper.find('[role="searchbox"]').exists()).toBe(true)
      expect(findButton(wrapper, 'Reorder Name')).toBeUndefined()
    })
  })

  describe('option constraints and bulk actions', () => {
    it('keeps locked controls visible and disabled', () => {
      const wrapper = mountList({ options: LOCKED_OPTIONS, initialValue: ['owner', 'status'] })

      expect(buttonByName(wrapper, 'Remove Owner').attributes('aria-disabled')).toBe('true')
      expect(buttonByName(wrapper, 'Reorder Owner').attributes('aria-disabled')).toBe('true')
    })

    it('applies transfer and reorder constraints independently', async () => {
      const spy = vi.fn()
      const constrainedOptions: readonly TransferListOption[] = [
        { ...OPTIONS[1]!, isTransferDisabled: true, disabledMessage: 'Owner is required.' },
        { ...OPTIONS[2]!, isReorderDisabled: true, disabledMessage: 'Status has a fixed position.' },
      ]
      const wrapper = mountList({ options: constrainedOptions, initialValue: ['owner', 'status'], spy })

      expect(buttonByName(wrapper, 'Remove Owner').attributes('aria-disabled')).toBe('true')
      expect(buttonByName(wrapper, 'Reorder Owner').attributes('aria-disabled')).toBeUndefined()
      expect(buttonByName(wrapper, 'Remove Status').attributes('aria-disabled')).toBeUndefined()
      expect(buttonByName(wrapper, 'Reorder Status').attributes('aria-disabled')).toBe('true')

      await buttonByName(wrapper, 'Remove Status').trigger('click')
      await flush()
      expect(spy).toHaveBeenCalledWith(['owner'])
    })

    it('adds all transfer-enabled available values in option order', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ options: TRANSFER_LOCKED_OPTIONS, initialValue: ['status'], spy, extra: { hasSelectAll: true } })

      await buttonByName(wrapper, 'Add all').trigger('click')
      await flush()
      expect(spy).toHaveBeenCalledWith(['status', 'name', 'updated'])
    })

    it('clears removable values but retains transfer-disabled values', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ options: TRANSFER_LOCKED_OPTIONS, initialValue: ['status', 'owner', 'updated'], spy, extra: { hasClear: true } })

      await buttonByName(wrapper, 'Clear').trigger('click')
      await flush()
      expect(spy).toHaveBeenCalledWith(['owner'])
    })
  })

  describe('root customization', () => {
    it('provides a theme target and forwards root props and style', () => {
      const onClick = vi.fn()
      const wrapper = mountList({
        initialValue: ['name'],
        extra: { 'data-testid': 'transfer-list', 'data-owner': 'tables', 'class': 'consumer-class', 'style': { marginTop: '12px' }, 'onClick': onClick },
      })

      const root = wrapper.get('[data-testid="transfer-list"]')
      expect(root.classes()).toContain('astryx-transfer-list')
      expect(root.classes()).toContain('consumer-class')
      expect(root.attributes('data-owner')).toBe('tables')
      expect((root.element as HTMLElement).style.marginTop).toBe('12px')
      ;(root.element as HTMLElement).click()
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('transfer updates', () => {
    it('commits individual and bulk changes immediately', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['name'], spy, extra: { hasClear: true, hasSelectAll: true } })

      await buttonByName(wrapper, 'Add Owner').trigger('click')
      await flush()
      expect(spy).toHaveBeenLastCalledWith(['name', 'owner'])
      expect(panel(wrapper, 'selected').text()).toContain('Owner')

      await buttonByName(wrapper, 'Remove Owner').trigger('click')
      await flush()
      expect(spy).toHaveBeenLastCalledWith(['name'])

      await buttonByName(wrapper, 'Add all').trigger('click')
      await flush()
      expect(spy).toHaveBeenLastCalledWith(['name', 'owner', 'status', 'updated'])

      await buttonByName(wrapper, 'Clear').trigger('click')
      await flush()
      expect(spy).toHaveBeenLastCalledWith([])
    })
  })

  describe('pointer reordering', () => {
    it.todo('promotes the drag preview to the top layer from inside a popover host 的原版断言依赖 React 版 Layer 的 popover 宿主，我们的浮层是 Teleport 到 body 的固定定位元素，没有 popover 属性。行为已在「keeps rows stationary…」里覆盖')

    it('keeps rows stationary, locks X, follows pointer Y, and commits once', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['name', 'owner', 'status'], spy })
      const rows = selectedRows(wrapper)
      mockRowBounds(rows)
      const handle = buttonByName(wrapper, 'Reorder Owner')
      const previewBox = (): HTMLElement | null => document.querySelector('[data-transfer-list-drag-preview]')

      firePointer(handle.element, 'pointerdown', { button: 0, pointerId: 7, clientX: 300, clientY: 50 })
      await flush()

      const source = wrapper.get('[data-transfer-list-reorder-source]')
      const preview = previewBox()
      expect(source.element).toBe(rows[1])
      // 源行和克隆体都是半透明；具体取值来自 styles/transfer-list.css。
      expect(source.attributes('data-transfer-list-reorder-source')).toBe('true')
      expect(preview).not.toBeNull()
      expect(preview!.getAttribute('aria-hidden')).toBe('true')
      expect(preview!.textContent).toContain('Owner')
      // 位置是按 getBoundingClientRect 算出来的视口坐标，纵向跟着指针、横向锁死。
      expect(preview!.style.top).toBe('40px')
      expect(preview!.style.left).toBe('0px')
      expect(wrapper.find('[data-transfer-list-drop-target]').exists()).toBe(false)

      firePointer(handle.element, 'pointermove', { pointerId: 7, clientX: 345, clientY: 5 })
      await flush()

      expect(previewBox()!.style.top).toBe('-5px')
      expect(previewBox()!.style.left).toBe('0px')
      expect(selectedRows(wrapper)).toEqual(rows)
      expect(rowTexts(wrapper)).toEqual(['Name', 'Owner', 'Status'])
      expect(spy).not.toHaveBeenCalled()
      expect(rows[0]!.getAttribute('data-transfer-list-drop-target')).toBe('before')

      firePointer(handle.element, 'pointermove', { pointerId: 7, clientX: 245, clientY: 115 })
      await flush()

      expect(previewBox()!.style.top).toBe('105px')
      expect(rows[0]!.getAttribute('data-transfer-list-drop-target')).toBeNull()
      expect(rows[2]!.getAttribute('data-transfer-list-drop-target')).toBe('after')
      expect(spy).not.toHaveBeenCalled()

      firePointer(handle.element, 'pointerup', { pointerId: 7, clientX: 245, clientY: 115 })
      await flush()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(['name', 'status', 'owner'])
      expect(document.querySelector('[data-transfer-list-drop-target]')).toBeNull()
      expect(previewBox()).toBeNull()
    })

    it('ignores a horizontal-only gesture without changing the value', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['name', 'owner'], spy })
      const rows = selectedRows(wrapper)
      mockRowBounds(rows)
      const handle = buttonByName(wrapper, 'Reorder Name')

      firePointer(handle.element, 'pointerdown', { button: 0, pointerId: 8, clientX: 10, clientY: 10 })
      await flush()
      firePointer(handle.element, 'pointermove', { pointerId: 8, clientX: 210, clientY: 10 })
      await flush()

      expect(wrapper.find('[data-transfer-list-reorder-source]').exists()).toBe(true)
      expect(document.querySelector('[data-transfer-list-drag-preview]')).not.toBeNull()
      // 只有横向移动时不能把克隆体带离原来那一行：拖动锁在竖直方向。
      const preview = document.querySelector<HTMLElement>('[data-transfer-list-drag-preview]')
      expect(preview!.style.top).toBe('0px')
      expect(preview!.style.left).toBe('0px')
      expect(wrapper.find('[data-transfer-list-drop-target]').exists()).toBe(false)

      firePointer(handle.element, 'pointerup', { pointerId: 8, clientX: 210, clientY: 10 })
      await flush()

      expect(spy).not.toHaveBeenCalled()
      expect(wrapper.find('[data-transfer-list-reorder-source]').exists()).toBe(false)
      expect(document.querySelector('[data-transfer-list-drag-preview]')).toBeNull()
    })

    it('cancels on pointer cancellation and does not suppress the next activation', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['name', 'owner', 'status'], spy })
      const rows = selectedRows(wrapper)
      mockRowBounds(rows)
      const handle = buttonByName(wrapper, 'Reorder Owner')

      firePointer(handle.element, 'pointerdown', { button: 0, pointerId: 9, clientX: 300, clientY: 50 })
      await flush()
      firePointer(handle.element, 'pointermove', { pointerId: 9, clientX: 300, clientY: 5 })
      await flush()
      firePointer(handle.element, 'pointercancel', { pointerId: 9 })
      await flush()

      expect(spy).not.toHaveBeenCalled()
      expect(document.querySelector('[data-transfer-list-drag-preview]')).toBeNull()
      expect(wrapper.find('[data-transfer-list-reorder-source]').exists()).toBe(false)

      await buttonByName(wrapper, 'Reorder Owner').trigger('click')
      await flush()
      expect(buttonByName(wrapper, 'Reorder Owner').attributes('aria-pressed')).toBe('true')
      expect(spy).not.toHaveBeenCalled()
    })

    it('keeps reorder-disabled selected options as pointer-order barriers', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ options: REORDER_LOCKED_OPTIONS, initialValue: ['name', 'owner', 'status', 'updated'], spy })
      const rows = selectedRows(wrapper)
      mockRowBounds(rows)
      const handle = buttonByName(wrapper, 'Reorder Updated')

      firePointer(handle.element, 'pointerdown', { button: 0, pointerId: 10, clientX: 300, clientY: 130 })
      await flush()
      firePointer(handle.element, 'pointermove', { pointerId: 10, clientX: 300, clientY: 5 })
      await flush()

      expect(rows[2]!.getAttribute('data-transfer-list-drop-target')).toBe('before')
      firePointer(handle.element, 'pointerup', { pointerId: 10, clientX: 300, clientY: 5 })
      await flush()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(['name', 'owner', 'updated', 'status'])
    })
  })

  describe('keyboard reordering', () => {
    it('moves immediately, keeps handle focus, and drops without another change', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['name', 'owner', 'status'], spy })
      const handle = buttonByName(wrapper, 'Reorder Owner')
      const el = handle.element as HTMLButtonElement
      el.focus()

      // 按钮上的 Enter / Space 会变成一次 click：点一下拿起，再点一下放下。
      await clickElement(el)
      await pressKey(el, 'ArrowUp')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenLastCalledWith(['owner', 'name', 'status'])
      // happy-dom 在移动 DOM 节点时会把 activeElement 清成 body（真实浏览器不会），
      // 这里断言手柄节点没有被重建——焦点之所以留得住就是这个原因。
      // 真实焦点保持由浏览器实测（Tab / 方向键 / Enter / Escape）覆盖。
      expect(wrapper.get('[aria-label="Reorder Owner"]').element).toBe(el)

      await clickElement(el)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(wrapper.get('[aria-label="Reorder Owner"]').element).toBe(el)
    })

    it('supports Home and End while a value is grabbed', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['name', 'owner', 'status', 'updated'], spy })
      const handle = buttonByName(wrapper, 'Reorder Owner')
      ;(handle.element as HTMLButtonElement).focus()

      const el = handle.element as HTMLButtonElement
      await clickElement(el)
      await pressKey(el, 'End')
      expect(spy).toHaveBeenNthCalledWith(1, ['name', 'status', 'updated', 'owner'])

      await pressKey(el, 'Home')
      expect(spy).toHaveBeenNthCalledWith(2, ['owner', 'name', 'status', 'updated'])
      expect(spy).toHaveBeenCalledTimes(2)

      await clickElement(el)
      // 放下本身不改顺序，手柄节点没有被重建。
      expect(wrapper.get('[aria-label="Reorder Owner"]').element).toBe(el)
    })

    it('restores the original order when a grabbed move is cancelled', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ initialValue: ['name', 'owner', 'status'], spy })
      const handle = buttonByName(wrapper, 'Reorder Owner')
      ;(handle.element as HTMLButtonElement).focus()

      const el = handle.element as HTMLButtonElement
      await clickElement(el)
      await pressKey(el, 'ArrowDown')
      expect(spy).toHaveBeenNthCalledWith(1, ['name', 'status', 'owner'])

      await pressKey(el, 'Escape')
      expect(spy).toHaveBeenNthCalledWith(2, ['name', 'owner', 'status'])
      // happy-dom 在移动 DOM 节点时会把 activeElement 清成 body（真实浏览器不会），
      // 这里断言手柄节点没有被重建——焦点之所以留得住就是这个原因。
      // 真实焦点保持由浏览器实测（Tab / 方向键 / Enter / Escape）覆盖。
      expect(wrapper.get('[aria-label="Reorder Owner"]').element).toBe(el)
    })

    it('does not allow a value to cross a reorder-disabled value', async () => {
      const spy = vi.fn()
      const wrapper = mountList({ options: REORDER_LOCKED_OPTIONS, initialValue: ['name', 'owner', 'status', 'updated'], spy })

      const beforeBarrier = buttonByName(wrapper, 'Reorder Name').element as HTMLButtonElement
      beforeBarrier.focus()
      await clickElement(beforeBarrier)
      await pressKey(beforeBarrier, 'ArrowDown')
      await clickElement(beforeBarrier)
      expect(spy).not.toHaveBeenCalled()

      const afterBarrier = buttonByName(wrapper, 'Reorder Updated').element as HTMLButtonElement
      afterBarrier.focus()
      await clickElement(afterBarrier)
      await pressKey(afterBarrier, 'Home')
      expect(spy).toHaveBeenLastCalledWith(['name', 'owner', 'updated', 'status'])

      await pressKey(afterBarrier, 'ArrowUp')
      await clickElement(afterBarrier)
      expect(spy).toHaveBeenCalledTimes(1)
      // happy-dom 在移动 DOM 节点时会把 activeElement 清成 body（真实浏览器不会），
      // 这里断言手柄节点没有被重建——焦点之所以留得住就是这个原因。
      // 真实焦点保持由浏览器实测（Tab / 方向键 / Enter / Escape）覆盖。
      expect(wrapper.get('[aria-label="Reorder Updated"]').element).toBe(afterBarrier)
    })
  })

  it('renders on the server', async () => {
    const app = createSSRApp({
      render: () => h(ListComponent, {
        label: 'Columns',
        options: OPTIONS,
        modelValue: ['name'],
      }),
    })
    const html = await renderToString(app)
    expect(html).toContain('astryx-transfer-list')
    expect(html).toContain('Selected')
    expect(html).toContain('Available')
  })
})
