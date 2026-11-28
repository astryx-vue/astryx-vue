import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TokenizerChange } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { COMPACT_TOUCH, installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Tokenizer from './Tokenizer.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

const people: SearchableItem[] = [
  { id: 'ada', label: 'Ada' },
  { id: 'grace', label: 'Grace' },
  { id: 'linus', label: 'Linus' },
]

function phone() {
  return installMatchMedia(query => query === COMPACT_TOUCH)
}

async function settle(): Promise<void> {
  await flushPromises()
  await vi.waitFor(() => {})
  await nextTick()
}

interface HostOptions {
  initial?: SearchableItem[]
  props?: Record<string, unknown>
  slots?: Record<string, unknown>
}

/** 受控的 Tokenizer：记下每次 `change` 和 `changeQuery`。 */
function render(options: HostOptions = {}) {
  const value = ref<SearchableItem[]>(options.initial ?? [])
  const disabled = ref(false)
  const changes: Array<[SearchableItem[], TokenizerChange]> = []
  const queries: string[] = []
  const Host = defineComponent({
    setup() {
      return () => h('div', [
        h(Tokenizer, {
          'label': 'People',
          'searchSource': createStaticSource(people),
          'debounceMs': 0,
          'modelValue': value.value,
          'disabled': disabled.value,
          'onUpdate:modelValue': (next: SearchableItem[]) => {
            value.value = next
          },
          'onChange': (next: SearchableItem[], change: TokenizerChange) => changes.push([next, change]),
          'onChangeQuery': (query: string) => queries.push(query),
          ...options.props,
        }, options.slots),
        h('button', { type: 'button', class: 'outside' }, 'Outside'),
      ])
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  return { wrapper, value, disabled, changes, queries }
}

const trigger = () => document.querySelector<HTMLButtonElement>('.astryx-tokenizer-sheet-trigger')!
const combobox = () => document.querySelector<HTMLInputElement>('input[role="combobox"]')
const sheetDialog = () => document.querySelector<HTMLDialogElement>('.astryx-bottom-sheet-dialog')
const sheet = () => document.querySelector<HTMLElement>('.astryx-tokenizer-sheet')!
const searchInput = () => sheet().querySelector<HTMLInputElement>('.astryx-tokenizer-sheet__search input')!
const rows = () => [...sheet().querySelectorAll<HTMLButtonElement>('[role="checkbox"]')]
const row = (label: string) => rows().find(item => item.getAttribute('aria-label') === label)!
function buttonByText(root: ParentNode, text: string) {
  return [...root.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.trim() === text)!
}
const confirmation = () => document.querySelector<HTMLDialogElement>('dialog.astryx-sheet-confirmation[open]')

async function openSheet(): Promise<void> {
  trigger().click()
  await settle()
  await vi.waitFor(() => expect(sheetDialog()?.open).toBe(true))
  await settle()
}

async function typeQuery(text: string): Promise<void> {
  const input = searchInput()
  input.value = text
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await settle()
}

async function pressEscape(): Promise<void> {
  sheetDialog()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await settle()
}

describe('tokenizer presentation', () => {
  it('defaults to adaptive: a sheet trigger on a compact touch screen', () => {
    phone()
    render()
    expect(combobox()).toBeNull()
    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps the inline combobox on a desktop and wherever popover is pinned', () => {
    installMatchMedia(() => false)
    render()
    expect(combobox()).not.toBeNull()
    document.body.innerHTML = ''

    phone()
    render({ props: { presentation: 'popover' } })
    expect(combobox()).not.toBeNull()
    expect(document.querySelector('.astryx-tokenizer-sheet-trigger')).toBeNull()
  })

  it('presents the sheet on any device when asked for one', async () => {
    installMatchMedia(() => false)
    render({ props: { presentation: 'bottom-sheet' } })
    await openSheet()
    expect(sheetDialog()!.getAttribute('aria-label')).toBe('People')
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
  })

  it('names the trigger by the field label and describes the selection', () => {
    phone()
    render({ initial: [people[0]!, people[1]!] })
    const button = trigger()
    expect(document.querySelector(`label[for="${button.id}"]`)?.textContent).toContain('People')
    const described = button.getAttribute('aria-describedby')!.split(' ').map(id => document.getElementById(id)?.textContent?.trim())
    expect(described).toEqual(expect.arrayContaining(['2 selected', 'Ada', 'Grace']))
  })

  it('shows the placeholder in an empty trigger and opens from a tap on the field box', async () => {
    phone()
    render({ props: { placeholder: 'Add people' } })
    expect(trigger().textContent).toContain('Add people')
    document.querySelector<HTMLElement>('.astryx-tokenizer-sheet-field')!.click()
    await settle()
    await vi.waitFor(() => expect(sheetDialog()?.open).toBe(true))
  })

  it('hands focus from the input to the trigger when the presentation changes', async () => {
    const media = installMatchMedia(() => false)
    render()
    combobox()!.focus()
    media.set(query => query === COMPACT_TOUCH)
    await settle()
    expect(document.activeElement).toBe(trigger())
  })

  it('warns once in development about props that have no surface in the sheet', () => {
    phone()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render({ props: { hasClear: true, menuWidth: 320 } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`hasClear`, `menuWidth`'))
  })
})

describe('tokenizer sheet', () => {
  it('edits a draft and commits it once on Save', async () => {
    phone()
    const { changes, value } = render({ initial: [people[0]!] })
    await openSheet()

    row('Grace').click()
    row('Linus').click()
    await settle()
    expect(row('Grace').getAttribute('aria-checked')).toBe('true')
    expect(changes).toEqual([])

    buttonByText(sheet(), 'Save').click()
    await settle()
    expect(changes).toHaveLength(1)
    expect(changes[0]![1]).toEqual({ type: 'add', item: people[2] })
    expect(value.value.map(item => item.id)).toEqual(['ada', 'grace', 'linus'])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps rows in place while toggling and lists the selection at open first', async () => {
    phone()
    render({ initial: [people[2]!] })
    await openSheet()
    expect(rows().map(item => item.getAttribute('aria-label'))).toEqual(['Linus', 'Ada', 'Grace'])
    row('Linus').click()
    row('Ada').click()
    await settle()
    expect(rows().map(item => item.getAttribute('aria-label'))).toEqual(['Linus', 'Ada', 'Grace'])
    expect(rows()[0]!.closest('[role="listitem"]')!.getAttribute('aria-setsize')).toBe('3')
  })

  it('closes a clean sheet on Escape without asking', async () => {
    phone()
    const { changes } = render()
    await openSheet()
    await pressEscape()
    expect(confirmation()).toBeNull()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(changes).toEqual([])
  })

  it('asks before discarding a changed draft; Keep editing returns to the search field', async () => {
    phone()
    const { changes } = render()
    await openSheet()
    row('Ada').click()
    await settle()
    await pressEscape()

    const dialog = confirmation()!
    expect(dialog.getAttribute('role')).toBe('alertdialog')
    expect(dialog.textContent).toContain('Discard changes?')
    buttonByText(dialog, 'Keep editing').click()
    await settle()
    expect(confirmation()).toBeNull()
    expect(sheetDialog()!.open).toBe(true)
    expect(document.activeElement).toBe(searchInput())
    expect(row('Ada').getAttribute('aria-checked')).toBe('true')
    expect(changes).toEqual([])
  })

  it('discards a changed draft when confirmed', async () => {
    phone()
    const { changes, value } = render()
    await openSheet()
    row('Ada').click()
    await settle()
    await pressEscape()
    buttonByText(confirmation()!, 'Discard changes').click()
    await settle()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(changes).toEqual([])
    expect(value.value).toEqual([])
  })

  it('clears the draft through a confirmation and keeps focus on Clear all', async () => {
    phone()
    const { changes } = render({ initial: [people[0]!, people[1]!] })
    await openSheet()
    const clearAll = buttonByText(sheet(), 'Clear all')
    clearAll.click()
    await settle()
    expect(confirmation()!.textContent).toContain('Clear all selected items?')
    buttonByText(confirmation()!, 'Clear selection').click()
    await settle()
    expect(confirmation()).toBeNull()
    expect(rows().every(item => item.getAttribute('aria-checked') === 'false')).toBe(true)
    expect(document.activeElement).toBe(buttonByText(sheet(), 'Clear all'))
    expect(buttonByText(sheet(), 'Clear all').getAttribute('aria-disabled')).toBe('true')
    expect(changes).toEqual([])

    buttonByText(sheet(), 'Save').click()
    await settle()
    expect(changes).toEqual([[[], { type: 'remove', item: people[1] }]])
  })

  it('creates an item from the query and commits it as a create change', async () => {
    phone()
    const { changes } = render({ props: { hasCreate: true } })
    await openSheet()
    await typeQuery('Margaret')
    const create = sheet().querySelector<HTMLElement>('.astryx-tokenizer-sheet__create-row')!
    expect(create.textContent).toContain('Margaret')
    create.querySelector<HTMLButtonElement>('button[aria-label="Add Margaret"]')!.click()
    await settle()
    expect(searchInput().value).toBe('')
    expect(document.activeElement).toBe(searchInput())
    expect(row('Margaret').getAttribute('aria-checked')).toBe('true')

    buttonByText(sheet(), 'Save').click()
    await settle()
    expect(changes[0]![1]).toEqual({ type: 'create', item: { id: 'Margaret', label: 'Margaret' } })
  })

  it('disables unselected rows at maxEntries', async () => {
    phone()
    render({ initial: [people[0]!], props: { maxEntries: 1 } })
    await openSheet()
    expect(row('Grace').getAttribute('aria-disabled')).toBe('true')
    expect(row('Ada').getAttribute('aria-disabled')).toBeNull()
    row('Grace').click()
    await settle()
    expect(row('Grace').getAttribute('aria-checked')).toBe('false')
  })

  it('disables Save while the draft is over maxEntries', async () => {
    phone()
    const { changes } = render({ initial: [people[0]!, people[1]!], props: { maxEntries: 1 } })
    await openSheet()
    const save = buttonByText(sheet(), 'Save')
    expect(save.getAttribute('aria-disabled')).toBe('true')
    save.click()
    await settle()
    expect(changes).toEqual([])
    expect(sheetDialog()!.open).toBe(true)
  })

  it('clears the query on a close the person makes', async () => {
    phone()
    const { queries } = render()
    await openSheet()
    await typeQuery('Gr')
    expect(rows().map(item => item.getAttribute('aria-label'))).toEqual(['Grace'])
    await pressEscape()
    expect(queries.at(-1)).toBe('')
  })

  it('closes the sheet when the field becomes disabled and keeps the query', async () => {
    phone()
    const { disabled, queries } = render()
    await openSheet()
    await typeQuery('Gr')
    disabled.value = true
    await settle()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(trigger().getAttribute('aria-disabled')).toBe('true')
    expect(queries.at(-1)).toBe('Gr')

    disabled.value = false
    await settle()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('does not open while disabled', async () => {
    phone()
    const { disabled } = render()
    disabled.value = true
    await settle()
    trigger().click()
    await settle()
    expect(sheetDialog()).toBeNull()
  })

  it('removes at once from a custom token and returns focus to the trigger', async () => {
    phone()
    const { changes } = render({
      initial: [people[0]!],
      slots: {
        token: ({ item, remove }: { item: SearchableItem, remove: () => void }) =>
          h('button', { type: 'button', class: 'custom-remove', onClick: remove }, `Remove ${item.label}`),
      },
    })
    document.querySelector<HTMLButtonElement>('.custom-remove')!.click()
    await settle()
    expect(changes).toEqual([[[], { type: 'remove', item: people[0] }]])
    expect(document.activeElement).toBe(trigger())
  })

  it('reports focus entering and leaving the whole field, not moves into the sheet', async () => {
    phone()
    const focus = vi.fn()
    const blur = vi.fn()
    render({ props: { onFocus: focus, onBlur: blur } })
    trigger().focus()
    expect(focus).toHaveBeenCalledTimes(1)
    await openSheet()
    expect(blur).not.toHaveBeenCalled()
  })
})
