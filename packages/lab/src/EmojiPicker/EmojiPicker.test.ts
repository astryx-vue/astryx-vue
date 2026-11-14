import type { EmojiCategory, EmojiOption } from './types.js'
import { provideAstryxLocale } from '@astryx-vue/core'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { DEFAULT_FREQUENT_EMOJIS } from './constants.js'
import EmojiPicker from './EmojiPicker.vue'

const loadBundledCategories = vi.hoisted(() => vi.fn())

vi.mock('./emojiData.js', () => ({
  loadBundledCategories: (...args: unknown[]) => loadBundledCategories(...args),
  bundledGroupLabelKey: (_group: EmojiCategory) => undefined as string | undefined,
  resetBundledCategories: vi.fn(),
}))

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  loadBundledCategories.mockReset()
})

const CATEGORIES: readonly EmojiCategory[] = [
  {
    name: 'Animals & nature',
    emojis: [
      { emoji: '🐱', name: 'Cat face', keywords: ['pet', 'kitten'] },
      { emoji: '🐶', name: 'Dog face', keywords: ['pet', 'puppy'] },
    ],
  },
  {
    name: 'Travel & places',
    emojis: [
      { emoji: '🏖️', name: 'Beach with umbrella', keywords: ['vacation'] },
    ],
  },
]

const TEN: readonly EmojiOption[] = Array.from({ length: 10 }, (_, index) => ({
  emoji: String.fromCodePoint(0x1F600 + index),
  name: `Emoji ${index + 1}`,
}))

const BUNDLED: readonly EmojiCategory[] = [
  {
    name: 'Smileys & emotion',
    emojis: [
      { emoji: '😀', name: 'Grinning face', keywords: ['happy', 'smile'] },
      { emoji: '😂', name: 'Face with tears of joy', keywords: ['laugh'] },
    ],
  },
  { name: 'Flags', emojis: [{ emoji: '🏁', name: 'Chequered flag', keywords: ['finish', 'race'] }] },
]

function renderPicker(props: Record<string, unknown> = {}) {
  return mount(EmojiPicker, {
    attachTo: document.body,
    props,
  })
}

function search(): HTMLInputElement {
  const input = document.querySelector('input')
  if (!(input instanceof HTMLInputElement))
    throw new Error('找不到搜索框')
  return input
}

function emojiButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll<HTMLButtonElement>('.astryx-emoji-picker__cell')]
}

function emojiNames(): string[] {
  return emojiButtons().map(button => button.getAttribute('aria-label') ?? '')
}

function buttonNamed(name: string): HTMLButtonElement {
  const button = emojiButtons().find(item => item.getAttribute('aria-label') === name)
  if (button == null)
    throw new Error(`找不到名为 ${name} 的表情`)
  return button
}

async function typeQuery(value: string): Promise<void> {
  const input = search()
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

function press(target: EventTarget, key: string, init: KeyboardEventInit = {}): void {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  for (const prop of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey', 'isComposing', 'keyCode'] as const) {
    if (init[prop] != null)
      Object.defineProperty(event, prop, { get: () => init[prop] })
  }
  target.dispatchEvent(event)
}

describe('emojiPicker', () => {
  it('lists the frequent emoji, then every group as a grid under its heading', () => {
    renderPicker({ categories: CATEGORIES })
    expect(document.querySelector('[role="grid"][aria-labelledby]')).toBeTruthy()
    expect(document.querySelector('input')?.getAttribute('placeholder')).toBe('Search emoji')
    const headings = [...document.querySelectorAll('.astryx-emoji-picker__category')].map(item => item.textContent?.trim())
    expect(headings).toEqual(['Frequently used', 'Animals & nature', 'Travel & places'])
    expect(document.querySelector('[role="grid"]')?.getAttribute('aria-labelledby')).toBeTruthy()
    expect(emojiNames()).toHaveLength(DEFAULT_FREQUENT_EMOJIS.length + 3)
    const animals = [...document.querySelectorAll('[role="grid"]')].find(grid => grid.getAttribute('aria-labelledby') && document.getElementById(grid.getAttribute('aria-labelledby') ?? '')?.textContent === 'Animals & nature')
    const [row] = animals?.querySelectorAll('[role="row"]') ?? []
    expect(row?.querySelectorAll('[role="gridcell"]')).toHaveLength(8)
    expect(row?.querySelectorAll('button')).toHaveLength(2)
  })

  it('leaves the frequent row out when it is empty', () => {
    renderPicker({ categories: CATEGORIES, frequentEmojis: [] })
    const headings = [...document.querySelectorAll('.astryx-emoji-picker__category')].map(item => item.textContent?.trim())
    expect(headings).toEqual(['Animals & nature', 'Travel & places'])
    expect(emojiNames()).toHaveLength(3)
  })

  it('emits select with the emoji and its option', async () => {
    const wrapper = renderPicker({ categories: CATEGORIES })
    buttonNamed('Dog face').click()
    await nextTick()
    expect(wrapper.emitted('select')).toEqual([
      ['🐶', expect.objectContaining({ name: 'Dog face' })],
    ])
  })

  it('searches names and keywords by word start, and announces when nothing matches', async () => {
    renderPicker({ categories: CATEGORIES, frequentEmojis: [] })
    const status = document.querySelector('[data-emoji-picker-search-status="true"]')
    expect(status?.textContent?.trim()).toBe('')
    await typeQuery('pet')
    expect([...document.querySelectorAll('.astryx-emoji-picker__category')].map(item => item.textContent?.trim())).toEqual(['Search results'])
    expect(emojiNames()).toEqual(['Cat face', 'Dog face'])
    await typeQuery('cat')
    expect(emojiNames()).toEqual(['Cat face'])
    expect(status?.textContent?.trim()).toBe('')
    await typeQuery('zzz')
    expect(status?.textContent).toContain('No emoji match “zzz”')
  })

  it('picks the first match with Enter in the search field', async () => {
    const wrapper = renderPicker({ categories: CATEGORIES, frequentEmojis: [] })
    await typeQuery('beach')
    press(search(), 'Enter')
    await nextTick()
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('🏖️')
  })

  it('keeps one tab stop across the groups and moves it with the arrow keys', async () => {
    const lastRow: readonly EmojiOption[] = [
      ...Array.from({ length: 7 }, (_, index) => ({
        emoji: String.fromCodePoint(0x1F68D + index),
        name: `Travel ${index + 1}`,
      })),
      { emoji: '🏖️', name: 'Beach with umbrella', keywords: ['vacation'] },
    ]
    const wrapper = renderPicker({
      categories: [
        { name: 'Ten', emojis: TEN },
        CATEGORIES[0]!,
        { name: 'Travel & places', emojis: lastRow },
      ],
      frequentEmojis: [],
    })
    await nextTick()
    const tabStops = () => emojiButtons().filter(button => button.getAttribute('tabindex') === '0')
    expect(tabStops()).toEqual([buttonNamed('Emoji 1')])

    search().focus()
    press(search(), 'ArrowDown')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 1'))

    const gridHost = document.querySelector('.astryx-emoji-picker__grids')
    press(gridHost ?? document.activeElement!, 'ArrowRight')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 2'))

    press(document.activeElement!, 'ArrowDown')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 10'))
    press(document.activeElement!, 'ArrowDown')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Dog face'))
    press(document.activeElement!, 'ArrowUp')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 10'))
    press(document.activeElement!, 'ArrowUp')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 2'))

    press(document.activeElement!, 'End')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 8'))
    press(document.activeElement!, 'Home')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 1'))
    press(document.activeElement!, 'End', { ctrlKey: true })
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Beach with umbrella'))
    press(document.activeElement!, 'Home', { ctrlKey: true })
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 1'))

    press(document.activeElement!, 'ArrowUp')
    await nextTick()
    expect(document.activeElement).toBe(search())
    press(search(), 'ArrowDown')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Emoji 1'))

    buttonNamed('Emoji 2').click()
    await nextTick()
    expect(wrapper.emitted('select')?.[0]).toEqual(['😁', TEN[1]])
  })

  it('leaves the arrow keys to an IME while it composes', async () => {
    renderPicker({ categories: CATEGORIES, frequentEmojis: [] })
    search().focus()
    press(search(), 'ArrowDown', { isComposing: true })
    expect(document.activeElement).toBe(search())
    press(search(), 'ArrowDown', { keyCode: 229 })
    expect(document.activeElement).toBe(search())
    press(search(), 'ArrowDown')
    await nextTick()
    expect(document.activeElement).toBe(buttonNamed('Cat face'))
  })

  it('focuses the search field on mount with hasAutoFocus', () => {
    renderPicker({ categories: CATEGORIES, hasAutoFocus: true })
    expect(document.activeElement).toBe(search())
  })

  it('names the emoji under the pointer or focus in its footer', async () => {
    renderPicker({ categories: CATEGORIES, frequentEmojis: [], label: 'Reactions' })
    const footerText = (text: string) =>
      [...document.querySelectorAll('.astryx-emoji-picker__preview')].some(item => item.textContent?.includes(text))
    expect(footerText('Reactions')).toBe(true)
    buttonNamed('Dog face').dispatchEvent(new Event('mouseenter', { bubbles: true }))
    await nextTick()
    expect(footerText('Dog face')).toBe(true)
    document.querySelector('.astryx-emoji-picker__grids')
      ?.dispatchEvent(new Event('mouseleave', { bubbles: true }))
    await nextTick()
    expect(footerText('Reactions')).toBe(true)
  })

  it('loads the bundled set when no categories are passed', async () => {
    loadBundledCategories.mockResolvedValue(BUNDLED)
    renderPicker({ frequentEmojis: [] })
    expect(document.body.textContent).toContain('Loading emoji')
    await flushPromises()
    await nextTick()
    const headings = [...document.querySelectorAll('.astryx-emoji-picker__category')].map(item => item.textContent?.trim())
    expect(headings).toEqual(['Smileys & emotion', 'Flags'])
    expect(buttonNamed('Grinning face')).toBeTruthy()
    await typeQuery('finish')
    expect(emojiNames()).toEqual(['Chequered flag'])
  })

  it('renders the bundled emoji load error inside a status region', async () => {
    loadBundledCategories.mockRejectedValue(new Error('forced emoji data load failure'))
    renderPicker({ frequentEmojis: [] })
    await flushPromises()
    await nextTick()
    const message = [...document.querySelectorAll('[role="status"]')].find(item => item.textContent?.includes('More emoji couldn\'t be loaded.'))
    expect(message).toBeTruthy()
    expect(message?.getAttribute('data-emoji-picker-search-status')).toBe('true')
  })

  it('uses localized group headings and empty-result copy', async () => {
    mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(EmojiPicker, { categories: CATEGORIES, frequentEmojis: [] })
      },
    }), { attachTo: document.body })
    expect(search().getAttribute('placeholder')).toBe('搜索表情')
    const headings = [...document.querySelectorAll('.astryx-emoji-picker__category')].map(item => item.textContent?.trim())
    expect(headings).toEqual(['Animals & nature', 'Travel & places'])
    await typeQuery('没有')
    expect(document.body.textContent).toContain('没有和“没有”匹配的表情')
  })
})
