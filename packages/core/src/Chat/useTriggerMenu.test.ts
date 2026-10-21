import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { ChatComposerTrigger } from './types.js'
import type { UseTriggerMenuReturn } from './useTriggerMenu.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import { useTriggerMenu } from './useTriggerMenu.js'

const USERS: SearchableItem[] = [
  { id: 'cindy', label: 'Cindy Zhang' },
  { id: 'alex', label: 'Alex Johnson' },
  { id: 'sam', label: 'Sam Rivera' },
  { id: 'obrien', label: 'O\'Brien' },
  { id: 'jeanluc', label: 'Jean-Luc\'s Task' },
  { id: 'maria', label: 'María José García de la Fuente' },
  { id: 'rdj', label: 'Robert Downey Jr.' },
  { id: 'q4_review', label: 'Design Review: Q4' },
]

const COMMANDS: SearchableItem[] = [
  { id: 'summarize', label: 'summarize' },
  { id: 'translate', label: 'translate' },
  { id: 'search', label: 'search' },
]

function mention(overrides?: Partial<ChatComposerTrigger>): ChatComposerTrigger {
  return {
    character: '@',
    searchSource: createStaticSource(USERS),
    onSelect: item => ({ value: `@${item.id}`, label: `@${item.label}` }),
    hasMultiWordQuery: true,
    ...overrides,
  }
}

function command(overrides?: Partial<ChatComposerTrigger>): ChatComposerTrigger {
  return {
    character: '/',
    searchSource: createStaticSource(COMMANDS),
    onSelect: item => `/${item.label} `,
    ...overrides,
  }
}

function deferredSource() {
  const pending = new Map<string, (items: SearchableItem[]) => void>()
  const source: SearchSource = {
    search(query: string) {
      return new Promise<SearchableItem[]>((resolve) => {
        pending.set(query, resolve)
      })
    },
  }
  return {
    source,
    resolve(query: string, items: SearchableItem[]) {
      pending.get(query)?.(items)
    },
  }
}

describe('useTriggerMenu', () => {
  let editable: HTMLDivElement

  function setCursor(text: string, cursorOffset?: number): void {
    const existing = editable.firstChild
    if (existing?.nodeType === Node.TEXT_NODE && editable.childNodes.length === 1 && text !== '')
      (existing as Text).data = text
    else
      editable.textContent = text
    const textNode = editable.firstChild
    const offset = cursorOffset ?? text.length
    const selection = window.getSelection()
    selection?.removeAllRanges()
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE)
      return
    const range = document.createRange()
    range.setStart(textNode, offset)
    range.collapse(true)
    selection?.addRange(range)
  }

  function mountMenu(triggers: ChatComposerTrigger[], debounceMs = 0): UseTriggerMenuReturn {
    const triggersRef = ref(triggers)
    const editableRef = ref<HTMLElement | null>(editable)
    const debounceRef = ref(debounceMs)
    const wrapper = mount(defineComponent({
      setup() {
        const menu = useTriggerMenu({
          triggers: triggersRef,
          editable: editableRef,
          debounceMs: debounceRef,
          onInsertToken: () => {},
          onInsertText: () => {},
          onEmitChange: () => {},
        })
        return { menu }
      },
      template: '<div />',
    }))
    return (wrapper.vm as unknown as { menu: UseTriggerMenuReturn }).menu
  }

  async function type(menu: UseTriggerMenuReturn, text: string, offset?: number): Promise<void> {
    setCursor(text, offset)
    menu.handleInput()
    await flushPromises()
  }

  function key(name: string, init?: KeyboardEventInit): KeyboardEvent {
    return new KeyboardEvent('keydown', { key: name, cancelable: true, bubbles: true, ...init })
  }

  beforeEach(() => {
    editable = document.createElement('div')
    editable.contentEditable = 'true'
    document.body.append(editable)
  })

  afterEach(() => {
    editable.remove()
    window.getSelection()?.removeAllRanges()
  })

  it('ends a single-token query at a space', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '/summarize')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe('summarize')
    expect(menu.state.activeTrigger?.character).toBe('/')

    await type(menu, '/summarize ')
    expect(menu.state.isActive).toBe(false)

    await type(menu, '/summarize now')
    expect(menu.state.isActive).toBe(false)
  })

  it('keeps spaces and punctuation inside a multi-word query', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@María José García de la Fuente')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe('María José García de la Fuente')
    expect(menu.state.items.some(item => item.id === 'maria')).toBe(true)

    await type(menu, '@Robert Downey Jr.')
    expect(menu.state.query).toBe('Robert Downey Jr.')
    expect(menu.state.items.some(item => item.id === 'rdj')).toBe(true)

    await type(menu, '@Design Review: Q4')
    expect(menu.state.query).toBe('Design Review: Q4')
    expect(menu.state.items.some(item => item.id === 'q4_review')).toBe(true)
  })

  it('keeps a trailing space as part of a multi-word query', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@ ')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe(' ')

    await type(menu, '@Project ')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe('Project ')
  })

  it('stops a multi-word query after 64 characters', async () => {
    const menu = mountMenu([mention(), command()])
    const query64 = 'a'.repeat(64)
    await type(menu, `@${query64}`)
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe(query64)

    await type(menu, `@${'a'.repeat(65)}`)
    expect(menu.state.isActive).toBe(false)
  })

  it('keeps apostrophes and hyphens in the query', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@O\'Brien')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe('O\'Brien')

    await type(menu, '@Jean-Luc\'s Task')
    expect(menu.state.query).toBe('Jean-Luc\'s Task')
    expect(menu.state.items.some(item => item.id === 'jeanluc')).toBe(true)
  })

  it('does not close on a double space', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@Project  Alpha')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe('Project  Alpha')
  })

  it('follows the caret back into an earlier mention', async () => {
    const menu = mountMenu([mention(), command()])
    const full = 'Hello @First and @Second Name'
    await type(menu, full, 16)
    expect(menu.state.query).toBe('First and')

    await type(menu, full, full.length)
    expect(menu.state.query).toBe('Second Name')
  })

  it('does not trigger inside a word', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, 'email@domain.com')
    expect(menu.state.isActive).toBe(false)
    await type(menu, 'foo/bar')
    expect(menu.state.isActive).toBe(false)
  })

  it('ends a multi-word query at a line break', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@Project\nAlpha')
    expect(menu.state.isActive).toBe(false)
    await type(menu, '@\n')
    expect(menu.state.isActive).toBe(false)
  })

  it('accepts a punctuation trigger character', async () => {
    const emoji: ChatComposerTrigger = {
      character: ':',
      searchSource: createStaticSource([{ id: 'smile', label: 'smile' }]),
      onSelect: item => `:${item.label}:`,
    }
    const menu = mountMenu([emoji, mention()])
    await type(menu, ':smile')
    expect(menu.state.activeTrigger?.character).toBe(':')
    expect(menu.state.query).toBe('smile')
  })

  it('keeps punctuation in a single-token query', async () => {
    const single = mention({
      hasMultiWordQuery: false,
      searchSource: createStaticSource([{ id: 'john.doe', label: 'john.doe' }]),
    })
    const menu = mountMenu([single, command()])
    await type(menu, '/v1.2')
    expect(menu.state.query).toBe('v1.2')
    await type(menu, '@john.doe')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe('john.doe')
  })

  it('hides an unmatched multi-word query when no empty message is set', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@NonExistentUser12345')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.items).toEqual([])
    expect(menu.state.isHidden).toBe(true)
    expect(menu.isMenuVisible.value).toBe(false)
  })

  it('keeps the empty panel when the caller supplies emptySearchText', async () => {
    const menu = mountMenu([mention({ emptySearchText: 'No matching team members' })])
    await type(menu, '@NonExistentUser')
    expect(menu.state.isHidden).toBe(false)
    expect(menu.isMenuVisible.value).toBe(true)
  })

  it('treats emptySearchText null as omitted for a multi-word query', async () => {
    const menu = mountMenu([mention({ emptySearchText: null })])
    await type(menu, '@NonExistentUser')
    expect(menu.isMenuVisible.value).toBe(false)
  })

  it('does not consume Enter when nothing matches', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@NonExistentUser')
    const enter = key('Enter')
    expect(menu.handleKeyDown(enter)).toBe(false)
    expect(enter.defaultPrevented).toBe(false)
  })

  it('inserts the highlighted row on Enter when it is not the first item', async () => {
    const selected: string[] = []
    const menu = mountMenu([mention({
      searchSource: createStaticSource([
        { id: 'ada', label: 'Ada Lovelace' },
        { id: 'grace', label: 'Grace Hopper' },
      ]),
      onSelect: (item) => {
        selected.push(item.id)
        return `@${item.id}`
      },
    })])
    await type(menu, '@')
    expect(menu.handleKeyDown(key('ArrowDown'))).toBe(true)
    expect(menu.state.highlightedIndex).toBe(1)
    expect(menu.handleKeyDown(key('Enter'))).toBe(true)
    expect(selected).toEqual(['grace'])
  })

  it('inserts the grouped row under the highlight, not the first source item', async () => {
    const selected: string[] = []
    const menu = mountMenu([mention({
      searchSource: createStaticSource([
        { id: 'ada', label: 'Ada Lovelace' },
        { id: 'maria', label: 'María José García' },
        { id: 'lin', label: 'Lin', auxiliaryData: { group: 'Reviewers' } },
        { id: 'grace', label: 'Grace Hopper', auxiliaryData: { group: 'Reviewers' } },
      ]),
      onSelect: (item) => {
        selected.push(item.id)
        return { value: `@${item.id}`, label: `@${item.label}` }
      },
    })])
    await type(menu, '@')
    expect(menu.handleKeyDown(key('ArrowDown'))).toBe(true)
    expect(menu.state.highlightedIndex).toBe(1)
    expect(menu.handleKeyDown(key('Enter'))).toBe(true)
    expect(selected).toEqual(['grace'])
  })

  it('does not pick a row while an IME composition key is pressed', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@Cindy')
    expect(menu.state.items.length).toBeGreaterThan(0)
    const enter = key('Enter', { isComposing: true })
    expect(menu.handleKeyDown(enter)).toBe(false)
    expect(enter.defaultPrevented).toBe(false)
  })

  it('drops a result that belongs to an older query', async () => {
    const source = deferredSource()
    const menu = mountMenu([mention({ searchSource: source.source })])
    await type(menu, '@C')
    expect(menu.state.isLoading).toBe(true)
    await type(menu, '@Ci')
    source.resolve('C', [{ id: 'stale', label: 'Stale Item' }])
    await flushPromises()
    expect(menu.state.items).toEqual([])
    source.resolve('Ci', [{ id: 'cindy', label: 'Cindy Zhang' }])
    await flushPromises()
    expect(menu.state.items).toEqual([{ id: 'cindy', label: 'Cindy Zhang' }])
  })

  it('stays hidden after Escape while the same query grows', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@Cindy')
    const escape = key('Escape')
    expect(menu.handleKeyDown(escape)).toBe(true)
    expect(menu.state.isActive).toBe(false)

    await type(menu, '@Cindy ')
    expect(menu.state.isActive).toBe(false)
    await type(menu, '@Cindy Zhang')
    expect(menu.state.isActive).toBe(false)

    await type(menu, '@Cin')
    expect(menu.state.isActive).toBe(true)
    expect(menu.state.query).toBe('Cin')
  })

  it('does not pick a row while a newer search is still pending', async () => {
    const source = deferredSource()
    const onSelect = vi.fn((item: SearchableItem) => `@${item.id}`)
    const menu = mountMenu([mention({ searchSource: source.source, onSelect })])
    await type(menu, '@C')
    source.resolve('C', [{ id: 'cindy', label: 'Cindy Zhang' }])
    await flushPromises()
    expect(menu.state.items).toHaveLength(1)

    await type(menu, '@Ci')
    expect(menu.state.isLoading).toBe(true)
    const enter = key('Enter')
    expect(menu.handleKeyDown(enter)).toBe(false)
    expect(enter.defaultPrevented).toBe(false)
    expect(onSelect).not.toHaveBeenCalled()

    source.resolve('Ci', [{ id: 'cindy_new', label: 'Cindy New' }])
    await flushPromises()
    expect(menu.state.isLoading).toBe(false)
    expect(menu.state.items[0]?.id).toBe('cindy_new')
  })

  it('lets arrows through when an unmatched multi-word query hides the menu', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@UnknownNameThatDoesNotMatch')
    expect(menu.isMenuVisible.value).toBe(false)
    const down = key('ArrowDown')
    const up = key('ArrowUp')
    expect(menu.handleKeyDown(down)).toBe(false)
    expect(menu.handleKeyDown(up)).toBe(false)
    expect(down.defaultPrevented).toBe(false)
    expect(up.defaultPrevented).toBe(false)
  })

  it('ignores a result that arrives after Escape', async () => {
    const source = deferredSource()
    const menu = mountMenu([mention({ searchSource: source.source })])
    await type(menu, '@C')
    expect(menu.handleKeyDown(key('Escape'))).toBe(true)
    source.resolve('C', [{ id: 'cindy', label: 'Cindy Zhang' }])
    await flushPromises()
    expect(menu.state.isActive).toBe(false)
    expect(menu.state.items).toEqual([])
    expect(menu.state.isLoading).toBe(false)
  })

  it('lets Enter through while a single-token search is pending', async () => {
    const source = deferredSource()
    const onSelect = vi.fn((item: SearchableItem) => `/${item.id} `)
    const menu = mountMenu([command({ searchSource: source.source, onSelect })])
    await type(menu, '/s')
    source.resolve('s', [{ id: 'summarize', label: 'summarize' }])
    await flushPromises()
    await type(menu, '/su')
    expect(menu.state.isLoading).toBe(true)

    const enter = key('Enter')
    expect(menu.handleKeyDown(enter)).toBe(false)
    expect(onSelect).not.toHaveBeenCalled()
    expect(menu.handleKeyDown(key('Tab'))).toBe(false)
    expect(onSelect).not.toHaveBeenCalled()

    const down = key('ArrowDown')
    expect(menu.handleKeyDown(down)).toBe(true)
    expect(menu.state.highlightedIndex).toBe(0)
    expect(menu.handleKeyDown(key('Enter', { shiftKey: true }))).toBe(false)
  })

  it('does not consume Escape while the menu is hidden', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@team please review')
    expect(menu.isMenuVisible.value).toBe(false)
    const escape = key('Escape')
    expect(menu.handleKeyDown(escape)).toBe(false)
    expect(escape.defaultPrevented).toBe(false)
  })

  it('discards a result that arrives after the draft is cleared', async () => {
    const source = deferredSource()
    const menu = mountMenu([mention({ searchSource: source.source })])
    await type(menu, '@jor')
    expect(menu.state.isActive).toBe(true)
    editable.textContent = ''
    source.resolve('jor', [{ id: 'jordan', label: 'Jordan Lee' }])
    await flushPromises()
    expect(menu.state.isActive).toBe(false)
    expect(menu.state.items).toEqual([])
    expect(menu.isMenuVisible.value).toBe(false)
  })

  it('keeps another trigger character inside a multi-word query', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@jordan /s')
    expect(menu.state.activeTrigger?.character).toBe('@')
    expect(menu.state.query).toBe('jordan /s')
  })

  it('starts a new query when the same trigger character follows a space', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '@jordan @sa')
    expect(menu.state.activeTrigger?.character).toBe('@')
    expect(menu.state.query).toBe('sa')
  })

  it('opens a single-token trigger after a space', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, 'hello /su')
    expect(menu.state.activeTrigger?.character).toBe('/')
    expect(menu.state.query).toBe('su')
  })

  it('treats a tab as a boundary and as the end of a single-token query', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, 'hi\t/su')
    expect(menu.state.activeTrigger?.character).toBe('/')
    expect(menu.state.query).toBe('su')

    await type(menu, '/su\tx')
    expect(menu.state.isActive).toBe(false)
  })

  it('keeps the arrows while a visible menu shows its empty message', async () => {
    const menu = mountMenu([mention(), command()])
    await type(menu, '/zzz')
    expect(menu.state.items).toEqual([])
    expect(menu.isMenuVisible.value).toBe(true)
    for (const name of ['ArrowDown', 'ArrowUp']) {
      const event = key(name)
      expect(menu.handleKeyDown(event)).toBe(true)
      expect(event.defaultPrevented).toBe(true)
    }
    expect(menu.handleKeyDown(key('Enter'))).toBe(false)
  })
})
