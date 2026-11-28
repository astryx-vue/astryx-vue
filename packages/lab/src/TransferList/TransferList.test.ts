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

/** 等 Vue 渲染、core List 的重排会话挂上手柄、再过两帧。 */
async function settle(): Promise<void> {
  await flush()
  for (let frame = 0; frame < 2; frame += 1)
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await flush()
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

/** 按钮的无障碍名：有 `aria-labelledby` 就按它拼（core 的重排手柄是「Reorder」加上行的标签），否则看 `aria-label` 和文字。 */
function accessibleName(element: Element): string {
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy != null) {
    return labelledBy.split(' ').map((id) => {
      const target = document.getElementById(id)
      return target === element ? (element.getAttribute('aria-label') ?? '') : (target?.textContent ?? '')
    }).join(' ').replace(/\s+/g, ' ').trim()
  }
  return element.getAttribute('aria-label') ?? element.textContent?.trim() ?? ''
}

function findButton(wrapper: ReturnType<typeof mountList>, name: string) {
  return wrapper.findAll('button').find(node =>
    accessibleName(node.element) === name || node.text().trim() === name,
  )
}

function buttonByName(wrapper: ReturnType<typeof mountList>, name: string) {
  const button = findButton(wrapper, name)
  if (button == null)
    throw new Error(`找不到按钮 ${name}`)
  return button
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

    it('uses one divided collection with direction-neutral row actions', async () => {
      const wrapper = mountList({ initialValue: ['name', 'status'], extra: { hasClear: true, hasSelectAll: true } })
      await settle()

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
      // 行尾先是删除按钮，最后是 core List 的重排手柄。
      const rowButtons = nameRow.findAll('button')
      expect(rowButtons[0]!.attributes('aria-label')).toBe('Remove Name')
      expect(accessibleName(rowButtons[1]!.element)).toBe('Reorder Name')
      expect(rowButtons[1]!.classes()).toContain('astryx-list-reorder-handle')
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

    it('disables search and enables reordering by default', async () => {
      const wrapper = mountList({ initialValue: ['name'] })
      await settle()

      expect(wrapper.find('[role="searchbox"]').exists()).toBe(false)
      expect(findButton(wrapper, 'Reorder Name')).toBeDefined()
    })

    it('can turn on search and turn off reordering', async () => {
      const wrapper = mountList({ initialValue: ['name'], extra: { hasSearch: true, isReorderable: false } })
      await settle()

      expect(wrapper.find('[role="searchbox"]').exists()).toBe(true)
      expect(findButton(wrapper, 'Reorder Name')).toBeUndefined()
    })
  })

  describe('option constraints and bulk actions', () => {
    it('disables every control while keeping them focusable, without option-specific messages', async () => {
      const spy = vi.fn()
      const wrapper = mountList({
        options: LOCKED_OPTIONS,
        initialValue: ['name', 'owner'],
        spy,
        extra: { hasSearch: true, hasClear: true, hasSelectAll: true, isDisabled: true },
      })
      await settle()
      const remove = buttonByName(wrapper, 'Remove Name')
      expect(remove.attributes('aria-disabled')).toBe('true')
      expect(remove.attributes('disabled')).toBeUndefined()
      ;(remove.element as HTMLElement).focus()
      expect(document.activeElement).toBe(remove.element)
      ;(remove.element as HTMLElement).click()
      expect(spy).not.toHaveBeenCalled()
      // 禁用的列表里手柄还在、可聚焦，只是不接受拖动；位置固定的 Owner 本来就没有手柄。
      expect(buttonByName(wrapper, 'Reorder Name').attributes('aria-disabled')).toBe('true')
      expect(findButton(wrapper, 'Reorder Owner')).toBeUndefined()
      expect(buttonByName(wrapper, 'Clear').attributes('aria-disabled')).toBe('true')
      expect(buttonByName(wrapper, 'Add all').attributes('aria-disabled')).toBe('true')
      expect(wrapper.get('[role="searchbox"]').attributes('aria-disabled')).toBe('true')
      expect(wrapper.text()).not.toContain('Owner is required and fixed in position.')
      wrapper.unmount()
    })

    it('keeps a locked Remove visible and disabled, and gives a fixed row no handle', async () => {
      const wrapper = mountList({ options: LOCKED_OPTIONS, initialValue: ['owner', 'status'] })
      await settle()

      const remove = buttonByName(wrapper, 'Remove Owner')
      expect(remove.attributes('aria-disabled')).toBe('true')
      // 没有手柄的行，删除按钮让出手柄的位置，和可挪的行对齐。
      expect(remove.classes()).toContain('astryx-transfer-list-row-action--clears-handle')
      expect(findButton(wrapper, 'Reorder Owner')).toBeUndefined()
      expect(buttonByName(wrapper, 'Reorder Status').attributes('aria-disabled')).toBeUndefined()
    })

    it('applies transfer and reorder constraints independently', async () => {
      const spy = vi.fn()
      const constrainedOptions: readonly TransferListOption[] = [
        { ...OPTIONS[1]!, isTransferDisabled: true, disabledMessage: 'Owner is required.' },
        { ...OPTIONS[2]!, isReorderDisabled: true, disabledMessage: 'Status has a fixed position.' },
      ]
      const wrapper = mountList({ options: constrainedOptions, initialValue: ['owner', 'status'], spy })
      await settle()

      expect(buttonByName(wrapper, 'Remove Owner').attributes('aria-disabled')).toBe('true')
      expect(buttonByName(wrapper, 'Reorder Owner').attributes('aria-disabled')).toBeUndefined()
      expect(buttonByName(wrapper, 'Remove Status').attributes('aria-disabled')).toBeUndefined()
      expect(findButton(wrapper, 'Reorder Status')).toBeUndefined()

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
