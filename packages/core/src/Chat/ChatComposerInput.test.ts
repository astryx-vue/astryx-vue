import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { ChatComposerTrigger } from './types.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import ChatComposer from './ChatComposer.vue'
import ChatComposerInput from './ChatComposerInput.vue'

const { announce } = vi.hoisted(() => ({ announce: vi.fn() }))

vi.mock('../composables/internal/announce.js', async importOriginal => ({
  ...await importOriginal<typeof import('../composables/internal/announce.js')>(),
  useAnnouncer: () => announce,
}))

const PEOPLE: SearchableItem[] = [
  { id: 'ada', label: 'Ada Lovelace' },
  { id: 'lin', label: 'Lin Zhang' },
]

const mounted: Array<{ unmount: () => void }> = []

beforeEach(() => {
  announce.mockClear()
})

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
})

function deferredSource() {
  const pending = new Map<string, (items: SearchableItem[]) => void>()
  const source: SearchSource = {
    search: query => new Promise<SearchableItem[]>((resolve) => {
      pending.set(query, resolve)
    }),
  }
  return {
    source,
    resolve: (query: string, items: SearchableItem[]) => pending.get(query)?.(items),
  }
}

function mention(source: SearchSource, overrides?: Partial<ChatComposerTrigger>): ChatComposerTrigger {
  return {
    character: '@',
    searchSource: source,
    onSelect: item => ({ value: `@${item.id}`, label: `@${item.label}` }),
    ...overrides,
  }
}

function mountInput(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(ChatComposerInput, { attachTo: document.body, props: { debounceMs: 0, ...props }, attrs })
  mounted.push(wrapper)
  const editable = wrapper.get('.astryx-chat-composer-input__editable').element as HTMLElement
  return { wrapper, editable }
}

function typeAt(editable: HTMLElement, text: string): void {
  editable.focus()
  editable.textContent = text
  const textNode = editable.firstChild
  const selection = window.getSelection()
  const range = document.createRange()
  if (textNode)
    range.setStart(textNode, textNode.textContent?.length ?? 0)
  else
    range.selectNodeContents(editable)
  range.collapse(true)
  selection?.removeAllRanges()
  selection?.addRange(range)
  editable.dispatchEvent(new InputEvent('input', { bubbles: true }))
}

function frame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

function spokenTexts(): string[] {
  return announce.mock.calls.map(([message]) => message as string)
}

function press(target: Element): void {
  target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }))
}

describe('chatComposerInput 触发菜单的加载播报', () => {
  it('加载行不带 live 角色，「Searching…」每次搜索只播报一次', async () => {
    const search = deferredSource()
    const { editable } = mountInput({ triggers: [mention(search.source)] })

    typeAt(editable, '@a')
    await nextTick()
    const row = document.querySelector('.astryx-chat-trigger__status')
    expect(row?.textContent?.trim()).toBe('Searching…')
    expect(row?.getAttribute('role')).toBeNull()
    expect(spokenTexts()).toEqual([])

    await frame()
    expect(spokenTexts()).toEqual(['Searching…'])

    typeAt(editable, '@ad')
    await frame()
    expect(spokenTexts()).toEqual(['Searching…'])

    search.resolve('ad', PEOPLE)
    await flushPromises()
    typeAt(editable, '@ada')
    await nextTick()
    await frame()
    expect(spokenTexts()).toEqual(['Searching…', 'Searching…'])
  })

  it('同步来源从不显示也不播报加载行', async () => {
    const { editable } = mountInput({ triggers: [mention(createStaticSource(PEOPLE))] })
    typeAt(editable, '@a')
    await nextTick()
    await frame()
    expect(spokenTexts()).toEqual([])
  })

  it('结果赶在播报之前回来，就什么也不念', async () => {
    const search = deferredSource()
    const { editable } = mountInput({ triggers: [mention(search.source)] })
    typeAt(editable, '@a')
    await nextTick()
    search.resolve('a', PEOPLE)
    await flushPromises()
    await frame()
    expect(spokenTexts()).toEqual([])
  })

  it('触发器自带的 loadingText 照样播报', async () => {
    const search = deferredSource()
    const { editable } = mountInput({ triggers: [mention(search.source, { loadingText: 'Looking people up' })] })
    typeAt(editable, '@a')
    await nextTick()
    await frame()
    expect(spokenTexts()).toEqual(['Looking people up'])
  })
})

describe('chatComposerInput 点按编辑区', () => {
  it('在编辑区里按一下不关菜单，在别处按才关', async () => {
    // 有真实的光标矩形时，菜单锚在光标处的一个小元素上，而不是编辑区本身。
    const original = (Range.prototype as { getBoundingClientRect?: () => DOMRect }).getBoundingClientRect
    Range.prototype.getBoundingClientRect = () => new DOMRect(10, 10, 2, 16)
    try {
      const { editable } = mountInput({ triggers: [mention(createStaticSource(PEOPLE))] })
      typeAt(editable, '@a')
      await nextTick()
      expect(editable.getAttribute('aria-expanded')).toBe('true')
      expect(document.querySelector('[data-astryx-trigger-anchor]')).not.toBeNull()

      press(editable)
      await nextTick()
      expect(editable.getAttribute('aria-expanded')).toBe('true')

      press(document.body)
      await nextTick()
      expect(editable.getAttribute('aria-expanded')).toBe('false')
    }
    finally {
      if (original)
        Range.prototype.getBoundingClientRect = original
      else
        delete (Range.prototype as { getBoundingClientRect?: unknown }).getBoundingClientRect
    }
  })

  it('点击把光标挪出查询时，菜单跟着关掉', async () => {
    const { editable } = mountInput({ triggers: [mention(createStaticSource(PEOPLE))] })
    typeAt(editable, 'hello @a')
    await nextTick()
    expect(editable.getAttribute('aria-expanded')).toBe('true')

    const textNode = editable.firstChild as Text
    const range = document.createRange()
    range.setStart(textNode, 2)
    range.collapse(true)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    editable.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(editable.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('chatComposerInput 禁用', () => {
  it('编辑区留在 Tab 顺序里，不再可编辑', () => {
    const { editable } = mountInput({ isDisabled: true })
    expect(editable.getAttribute('tabindex')).toBe('0')
    expect(editable.getAttribute('contenteditable')).toBe('false')
    expect(editable.getAttribute('aria-disabled')).toBe('true')
    editable.focus()
    expect(document.activeElement).toBe(editable)
  })

  it('留着的句柄也不能改草稿', async () => {
    const { wrapper, editable } = mountInput({ modelValue: 'draft' })
    const handle = wrapper.vm as unknown as {
      insertText: (text: string) => void
      insertToken: (token: { value: string, label: string }) => string | undefined
      expandToken: (id: string) => void
    }
    const id = handle.insertToken({ value: '@ada', label: '@Ada' })
    expect(id).toBeDefined()
    await nextTick()
    await wrapper.setProps({ isDisabled: true })
    const html = editable.innerHTML
    const changes = wrapper.emitted('change')?.length ?? 0

    handle.insertText('more')
    expect(handle.insertToken({ value: '@lin', label: '@Lin' })).toBeUndefined()
    handle.expandToken(id as string)
    await nextTick()
    expect(editable.innerHTML).toBe(html)
    expect(wrapper.emitted('change')?.length ?? 0).toBe(changes)
  })

  it('enter 不提交，粘贴不改草稿，调用方的 on* 回调不再运行', async () => {
    const onClick = vi.fn()
    const onFocus = vi.fn()
    const onSubmit = vi.fn()
    const { wrapper, editable } = mountInput({ isDisabled: true, modelValue: 'draft' }, { onClick, onFocus, onSubmit })
    const root = wrapper.get('.astryx-chat-composer-input').element

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    editable.dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    expect(wrapper.emitted('submit')).toBeUndefined()

    const paste = new Event('paste', { bubbles: true, cancelable: true })
    editable.dispatchEvent(paste)
    expect(paste.defaultPrevented).toBe(true)

    root.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    root.dispatchEvent(new FocusEvent('focus'))
    expect(onClick).not.toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('禁用后打开着的菜单收起，编辑区的 combobox 不再宣称展开', async () => {
    const { wrapper, editable } = mountInput({ triggers: [mention(createStaticSource(PEOPLE))] })
    typeAt(editable, '@a')
    await nextTick()
    expect(editable.getAttribute('aria-expanded')).toBe('true')

    await wrapper.setProps({ isDisabled: true })
    expect(editable.getAttribute('role')).toBe('combobox')
    expect(editable.getAttribute('aria-expanded')).toBe('false')
    expect(editable.getAttribute('aria-controls')).toBeNull()
    expect(editable.getAttribute('aria-activedescendant')).toBeNull()
  })
})

describe('chatComposerInput 回车键提示', () => {
  it('默认让触屏键盘的回车键写「发送」', () => {
    const { editable } = mountInput()
    expect(editable.getAttribute('enterkeyhint')).toBe('send')
  })

  it('可以换成别的提示', () => {
    const { editable } = mountInput({ enterKeyHint: 'enter' })
    expect(editable.getAttribute('enterkeyhint')).toBe('enter')
  })

  it('composer 里默认的输入框也一样', () => {
    const wrapper = mount(ChatComposer, { attachTo: document.body })
    mounted.push(wrapper)
    expect(wrapper.get('.astryx-chat-composer-input__editable').attributes('enterkeyhint')).toBe('send')
  })
})

describe('chatComposerInput 粘贴成令牌', () => {
  it('默认转换只通知一次变化', async () => {
    const onChange = vi.fn()
    const wrapper = mount(ChatComposerInput, {
      attachTo: document.body,
      props: { onChange },
    })
    mounted.push(wrapper)
    const editable = wrapper.get('.astryx-chat-composer-input__editable').element as HTMLElement
    editable.focus()
    const text = 'x'.repeat(260)
    const paste = new Event('paste', { bubbles: true, cancelable: true }) as Event & { clipboardData?: unknown }
    paste.clipboardData = { files: [], getData: () => text }
    editable.dispatchEvent(paste)
    await nextTick()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect((onChange.mock.calls[0]?.[0] as string).trim()).toBe(text)
  })
})
