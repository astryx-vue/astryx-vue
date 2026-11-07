import { provideAstryxLocale } from '@astryx-vue/core'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ChatEmojiPicker from './ChatEmojiPicker.vue'
import { DEFAULT_CHAT_EMOJIS } from './emojis.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

function renderPicker(props: Record<string, unknown> = {}, slots?: Record<string, () => unknown>) {
  return mount(ChatEmojiPicker, {
    attachTo: document.body,
    props,
    slots: slots ?? { default: '<button type="button">Open picker</button>' },
  })
}

function emojiButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll<HTMLButtonElement>('button[data-emoji]')]
}

function searchInput(): HTMLInputElement {
  const input = document.querySelector('input')
  if (!(input instanceof HTMLInputElement))
    throw new Error('找不到过滤框')
  return input
}

async function typeQuery(value: string): Promise<void> {
  const input = searchInput()
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

describe('chatEmojiPicker', () => {
  it('renders the trigger', () => {
    const wrapper = renderPicker()
    expect(wrapper.get('button').text()).toBe('Open picker')
    expect(wrapper.get('button').attributes('type')).toBe('button')
  })

  it('renders the default emoji set in the grid', () => {
    renderPicker()
    expect(emojiButtons()).toHaveLength(DEFAULT_CHAT_EMOJIS.length)
    expect(emojiButtons().some(button => button.getAttribute('aria-label') === 'React with tada')).toBe(true)
    expect(document.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Emoji')
    expect(searchInput().getAttribute('placeholder')).toBe('Search emoji')
  })

  it('renders custom emojis when provided', () => {
    renderPicker({ emojis: [{ emoji: '🦄', name: 'unicorn' }] })
    expect(emojiButtons()).toHaveLength(1)
    expect(emojiButtons()[0]?.getAttribute('aria-label')).toBe('React with unicorn')
  })

  it('filters the grid by shortname', async () => {
    renderPicker()
    await typeQuery('fire')
    expect(emojiButtons()).toHaveLength(1)
    expect(emojiButtons()[0]?.getAttribute('data-emoji')).toBe('🔥')
  })

  it('matches the emoji character itself', async () => {
    renderPicker()
    await typeQuery('🎉')
    expect(emojiButtons()).toHaveLength(1)
    expect(emojiButtons()[0]?.getAttribute('data-emoji')).toBe('🎉')
  })

  it('shows a no-match message for an empty filter result', async () => {
    renderPicker()
    await typeQuery('zzzz')
    expect(emojiButtons()).toHaveLength(0)
    expect(document.body.textContent).toContain('No emoji match “zzzz”')
  })

  it('emits select with the picked emoji and clears the filter', async () => {
    const wrapper = renderPicker()
    await typeQuery('fire')
    emojiButtons()[0]?.click()
    await nextTick()
    expect(wrapper.emitted('select')).toEqual([['🔥']])
    expect(emojiButtons()).toHaveLength(DEFAULT_CHAT_EMOJIS.length)
    expect(searchInput().value).toBe('')
  })

  it('moves focus right, left, and by a row with arrow keys', async () => {
    renderPicker()
    const grid = document.querySelector('[role="group"]')
    const buttons = emojiButtons()
    buttons[0]?.focus()
    grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(buttons[1])
    grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(buttons[0])
    grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(buttons[8])
    grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(buttons[0])
  })

  it('uses the localized search label and empty message', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(ChatEmojiPicker, null, {
          default: () => h('button', { type: 'button' }, '打开'),
        })
      },
    }), { attachTo: document.body })
    expect(searchInput().getAttribute('placeholder')).toBe('搜索表情')
    await typeQuery('没有')
    expect(document.body.textContent).toContain('没有和“没有”匹配的表情')
    wrapper.unmount()
  })

  it('uses a custom dialog label and search label', () => {
    renderPicker({ label: 'Pick one', searchLabel: 'Filter' })
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Pick one')
    expect(searchInput().getAttribute('placeholder')).toBe('Filter')
  })
})
