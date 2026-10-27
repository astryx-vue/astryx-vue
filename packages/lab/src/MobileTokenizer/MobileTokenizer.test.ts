import type { Component } from 'vue'
import type { SearchableItem, SearchSource } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import MobileTokenizer from './MobileTokenizer.vue'

const ITEMS: SearchableItem[] = [
  { id: 'design', label: 'Design' },
  { id: 'eng', label: 'Eng' },
  { id: 'engineer', label: 'Engineer' },
  { id: 'energizer', label: 'Energizer' },
]

const source: SearchSource<SearchableItem> = {
  search: q => ITEMS.filter(item => item.label.toLowerCase().includes(q.toLowerCase())),
  bootstrap: () => ITEMS,
}

/** 测试环境可能没有实现模态 dialog 的原生方法。 */
function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function')
    return
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.show = proto.showModal
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

beforeAll(ensureDialogModalApi)

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const Tokenizer = MobileTokenizer as unknown as Component

async function flush(): Promise<void> {
  await nextTick()
  await flushPromises()
  await nextTick()
}

interface HarnessOptions {
  hasCreate?: boolean
  initialValue?: SearchableItem[]
  spy?: (items: SearchableItem[], change: unknown) => void
  extra?: Record<string, unknown>
}

function makeHarness(options: HarnessOptions = {}): Component {
  return defineComponent({
    name: 'MobileTokenizerHarness',
    setup() {
      const value = ref<SearchableItem[]>(options.initialValue ?? [ITEMS[0]!, ITEMS[1]!])
      return () => h(Tokenizer, {
        'label': 'Tags',
        'searchSource': source,
        'modelValue': value.value,
        'debounceMs': 0,
        'placeholder': 'Add tags',
        'hasCreate': options.hasCreate,
        'onUpdate:modelValue': (next: SearchableItem[]) => {
          value.value = next
        },
        'onChange': (next: SearchableItem[], change: unknown) => {
          value.value = next
          options.spy?.(next, change)
        },
        ...options.extra,
      })
    },
  })
}

function mountHarness(options: HarnessOptions = {}) {
  return mount(makeHarness(options), { attachTo: document.body })
}

function listOf(wrapper: ReturnType<typeof mountHarness>) {
  return wrapper.get('[data-testid="mobile-tokenizer-list"]')
}

function checkboxLabels(wrapper: ReturnType<typeof mountHarness>): (string | null)[] {
  return listOf(wrapper).findAll('[role="checkbox"]').map(row => row.attributes('aria-label') ?? null)
}

function checkboxNamed(wrapper: ReturnType<typeof mountHarness>, name: string) {
  const row = listOf(wrapper).findAll('[role="checkbox"]').find(node => node.attributes('aria-label') === name)
  if (row == null)
    throw new Error(`找不到复选框 ${name}`)
  return row
}

/** 按可见的标签文字找到里面的原生输入框。 */
function inputByLabel(wrapper: ReturnType<typeof mountHarness>, label: string) {
  const labelNode = wrapper.findAll('label').find(node => node.text() === label)
  const id = labelNode?.attributes('for')
  if (id == null)
    throw new Error(`找不到标签「${label}」`)
  return wrapper.get(`input[id="${id}"]`)
}

function findButton(wrapper: ReturnType<typeof mountHarness>, name: string) {
  return wrapper.findAll('button').find(node => node.attributes('aria-label') === name || node.text() === name)
}

function buttonNamed(wrapper: ReturnType<typeof mountHarness>, name: string) {
  const button = findButton(wrapper, name)
  if (button == null)
    throw new Error(`找不到按钮 ${name}`)
  return button
}

describe('mobileTokenizer (Lab, single-sheet flow)', () => {
  it('keeps rows stable while open and applies selected-first order on reopen', async () => {
    const spy = vi.fn()
    const wrapper = mountHarness({ spy })
    const trigger = wrapper.get('[aria-haspopup="dialog"]')
    await trigger.trigger('click')
    await flush()

    expect(checkboxLabels(wrapper)).toEqual(['Design', 'Eng', 'Engineer', 'Energizer'])

    const search = inputByLabel(wrapper, 'Search Tags')
    expect(search.element.closest('.astryx-text-input')?.querySelector('.astryx-icon')).not.toBeNull()
    expect(findButton(wrapper, 'Add item')).toBeUndefined()

    const design = checkboxNamed(wrapper, 'Design')
    expect(design.attributes('aria-checked')).toBe('true')
    const indicator = design.element.lastElementChild as HTMLElement
    expect(indicator.getAttribute('aria-hidden')).toBe('true')
    expect(indicator.getAttribute('data-size')).toBe('md')

    await checkboxNamed(wrapper, 'Energizer').trigger('click')
    expect(spy).toHaveBeenCalledWith(
      [ITEMS[0], ITEMS[1], ITEMS[3]],
      expect.objectContaining({ type: 'add' }),
    )
    await flush()
    expect(checkboxNamed(wrapper, 'Energizer').attributes('aria-checked')).toBe('true')
    expect(checkboxLabels(wrapper)).toEqual(['Design', 'Eng', 'Engineer', 'Energizer'])

    await checkboxNamed(wrapper, 'Eng').trigger('click')
    expect(spy).toHaveBeenLastCalledWith(
      [ITEMS[0], ITEMS[3]],
      expect.objectContaining({ type: 'remove' }),
    )
    expect(checkboxLabels(wrapper)).toEqual(['Design', 'Eng', 'Engineer', 'Energizer'])

    await buttonNamed(wrapper, 'Done').trigger('click')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')
    await flush()
    expect(checkboxLabels(wrapper)).toEqual(['Design', 'Energizer', 'Eng', 'Engineer'])
  })

  it('creates a custom entry with a trailing Add action', async () => {
    const spy = vi.fn()
    const wrapper = mountHarness({ hasCreate: true, initialValue: [], spy })
    const trigger = wrapper.get('[aria-haspopup="dialog"]')
    await trigger.trigger('click')
    await flush()

    const search = inputByLabel(wrapper, 'Search Tags')
    await search.setValue('Custom')
    await flush()

    expect(listOf(wrapper).findAll('[role="checkbox"]').map(node => node.attributes('aria-label')))
      .not
      .toContain('Create "Custom"')
    const create = buttonNamed(wrapper, 'Add Custom')
    expect(findButton(wrapper, 'Clear all')).toBeUndefined()
    expect(findButton(wrapper, 'Done')).toBeUndefined()
    expect(create.attributes('data-size')).toBe('lg')
    expect(wrapper.get('[data-testid="mobile-tokenizer-create-row"]').text()).toContain('Create "Custom"')

    await create.trigger('click')
    await flush()
    expect(spy).toHaveBeenCalledWith(
      [{ id: 'Custom', label: 'Custom' }],
      expect.objectContaining({ type: 'create' }),
    )
    expect(trigger.text()).toContain('Custom')
    expect((inputByLabel(wrapper, 'Search Tags').element as HTMLInputElement).value).toBe('')
    const custom = checkboxNamed(wrapper, 'Custom')
    expect(custom.attributes('aria-checked')).toBe('true')
  })

  it('renders long lists in 50-item batches and resets the window for search', async () => {
    const longItems: SearchableItem[] = Array.from({ length: 120 }, (_, index) => ({
      id: `item-${index + 1}`,
      label: `Item ${String(index + 1).padStart(3, '0')}`,
    }))
    const longSource: SearchSource<SearchableItem> = {
      bootstrap: () => longItems,
      search: query => longItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
    }

    const wrapper = mountHarness({
      initialValue: [],
      extra: { label: 'Items', searchSource: longSource, maxMenuItems: 120, onChange: () => {} },
    })
    await wrapper.get('[aria-haspopup="dialog"]').trigger('click')
    await flush()

    const list = listOf(wrapper)
    expect(list.attributes('data-rendered-count')).toBe('50')
    expect(list.attributes('data-total-count')).toBe('120')
    expect(list.findAll('[role="checkbox"]')).toHaveLength(50)
    expect(list.findAll('[role="checkbox"]').map(node => node.attributes('aria-label'))).not.toContain('Item 051')

    Object.defineProperties(list.element, {
      clientHeight: { configurable: true, value: 600 },
      scrollHeight: { configurable: true, value: 2400 },
      scrollTop: { configurable: true, value: 1700, writable: true },
    })
    await list.trigger('scroll')
    expect(list.attributes('data-rendered-count')).toBe('100')
    expect(list.findAll('[role="checkbox"]')).toHaveLength(100)
    expect(list.findAll('[role="checkbox"]').map(node => node.attributes('aria-label'))).toContain('Item 100')

    Object.defineProperties(list.element, {
      scrollHeight: { configurable: true, value: 4400 },
      scrollTop: { configurable: true, value: 3600, writable: true },
    })
    await list.trigger('scroll')
    expect(list.attributes('data-rendered-count')).toBe('120')
    expect(list.findAll('[role="checkbox"]')).toHaveLength(120)

    await inputByLabel(wrapper, 'Search Items').setValue('Item')
    await flush()
    expect(list.attributes('data-rendered-count')).toBe('50')
    expect(list.findAll('[role="checkbox"]')).toHaveLength(50)

    await list.trigger('scroll')
    expect(list.attributes('data-rendered-count')).toBe('100')
    expect(list.findAll('[role="checkbox"]')).toHaveLength(100)
  })

  it('searches within the same sheet and centers the no-results state', async () => {
    const wrapper = mountHarness()
    await wrapper.get('[aria-haspopup="dialog"]').trigger('click')
    await flush()

    await inputByLabel(wrapper, 'Search Tags').setValue('zzz')
    await flush()

    const title = listOf(wrapper).get('.astryx-empty-state-title')
    expect(title.text()).toBe('No results found')
    const emptyState = title.element.closest('[role="status"]')
    expect(emptyState?.textContent).toContain('Try a different search.')
    expect(emptyState?.querySelector('.astryx-icon')?.getAttribute('data-size')).toBe('lg')
  })

  it('keeps large equal-width Clear all and Done footer actions while guarding the bulk clear', async () => {
    const spy = vi.fn()
    const wrapper = mountHarness({ spy })
    await wrapper.get('[aria-haspopup="dialog"]').trigger('click')
    await flush()

    const list = listOf(wrapper)
    const clearAll = buttonNamed(wrapper, 'Clear all')
    const done = buttonNamed(wrapper, 'Done')
    expect(clearAll.attributes('data-size')).toBe('lg')
    expect(clearAll.attributes('data-variant')).toBe('secondary')
    expect(done.attributes('data-size')).toBe('lg')
    // list 在底栏之前，读屏和 Tab 顺序都是先列表后操作。
    expect(list.element.compareDocumentPosition(clearAll.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(list.element.compareDocumentPosition(done.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    const confirmation = wrapper.get('[role="alertdialog"]')
    expect(confirmation.attributes('open')).toBeUndefined()

    await clearAll.trigger('click')
    await flush()
    expect(confirmation.attributes('open')).toBe('')
    expect(confirmation.text()).toContain('Clear all selected items?')
    expect(spy).not.toHaveBeenCalled()

    await buttonNamed(wrapper, 'Clear selection').trigger('click')
    await flush()
    expect(spy).toHaveBeenLastCalledWith([], expect.objectContaining({ type: 'remove' }))
  })

  it('renders on the server', async () => {
    const app = createSSRApp({
      render: () => h(Tokenizer, {
        label: 'Tags',
        searchSource: source,
        modelValue: [ITEMS[0]!],
        placeholder: 'Add tags',
      }),
    })
    const html = await renderToString(app)
    expect(html).toContain('astryx-mobile-tokenizer__trigger')
    expect(html).toContain('Design')
    expect(html).toContain('aria-haspopup="dialog"')
  })
})
