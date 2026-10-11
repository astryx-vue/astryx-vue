import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useListFocus } from './useListFocus.js'

function item(label: string, options: { disabled?: boolean } = {}): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = label
  button.setAttribute('role', 'menuitem')
  if (options.disabled)
    button.disabled = true
  return button
}

function key(name: string, extra: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: name, ...extra })
}

describe('useListFocus', () => {
  afterEach(() => {
    document.body.replaceChildren()
    vi.restoreAllMocks()
  })

  it('上下方向键移动并绕回，Home / End 跳到两端，禁用项被跳过', async () => {
    const { result } = mountComposable(() => useListFocus())
    const list = document.createElement('div')
    const first = item('一')
    const disabled = item('二', { disabled: true })
    const last = item('三')
    list.append(first, disabled, last)
    document.body.append(list)
    result.listRef.value = list
    await nextTick()

    expect(result.getItems().map(el => el.textContent)).toEqual(['一', '二', '三'])
    result.handleKeyDown(key('ArrowDown'))
    expect(document.activeElement).toBe(first)
    result.handleKeyDown(key('ArrowDown'))
    expect(document.activeElement).toBe(last)

    const end = key('End')
    result.handleKeyDown(end)
    expect(end.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(last)

    result.handleKeyDown(key('ArrowDown'))
    expect(document.activeElement).toBe(first)

    result.handleKeyDown(key('Home'))
    expect(document.activeElement).toBe(first)
    expect(result.focusLast()).toBe(true)
    expect(document.activeElement).toBe(last)
  })

  it('不绕回时停在最后一项，修饰键和无关按键不拦截', async () => {
    const { result } = mountComposable(() => useListFocus({ wrap: false }))
    const list = document.createElement('div')
    const only = item('唯一')
    list.append(only)
    document.body.append(list)
    result.listRef.value = list
    await nextTick()
    only.focus()

    const down = key('ArrowDown')
    result.handleKeyDown(down)
    expect(down.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(only)

    const chord = key('ArrowDown', { ctrlKey: true })
    result.handleKeyDown(chord)
    expect(chord.defaultPrevented).toBe(false)

    const letter = key('a')
    result.handleKeyDown(letter)
    expect(letter.defaultPrevented).toBe(false)
  })

  it('横向列表在从右往左时对调左右键', async () => {
    const { result } = mountComposable(() => useListFocus({
      itemSelector: 'button',
      orientation: 'horizontal',
    }))
    const list = document.createElement('div')
    const first = document.createElement('button')
    const second = document.createElement('button')
    first.textContent = '左'
    second.textContent = '右'
    list.append(first, second)
    document.body.append(list)
    result.listRef.value = list
    await nextTick()
    first.focus()

    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ direction: 'rtl' } as CSSStyleDeclaration)
    result.handleKeyDown(key('ArrowLeft'))
    expect(document.activeElement).toBe(second)

    result.handleKeyDown(key('ArrowRight'))
    expect(document.activeElement).toBe(first)

    const down = key('ArrowDown')
    result.handleKeyDown(down)
    expect(down.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(first)
  })

  it('有 Escape 回调才吃掉这个键', async () => {
    const onEscape = vi.fn()
    const withEscape = mountComposable(() => useListFocus({ onEscape }))
    const escape = key('Escape')
    withEscape.result.handleKeyDown(escape)
    expect(escape.defaultPrevented).toBe(true)
    expect(onEscape).toHaveBeenCalledOnce()

    const plain = mountComposable(() => useListFocus())
    const ignored = key('Escape')
    plain.result.handleKeyDown(ignored)
    expect(ignored.defaultPrevented).toBe(false)
  })

  it('子列表的按键和项不算在父列表里', async () => {
    const { result } = mountComposable(() => useListFocus({ boundarySelector: '[role="menu"]' }))
    const parent = document.createElement('div')
    parent.setAttribute('role', 'menu')
    const own = item('自己的')
    const nested = document.createElement('div')
    nested.setAttribute('role', 'menu')
    const child = item('子菜单')
    nested.append(child)
    parent.append(own, nested)
    document.body.append(parent)
    result.listRef.value = parent
    await nextTick()

    expect(result.getItems()).toEqual([own])
    child.focus()
    const event = key('ArrowDown')
    child.dispatchEvent(event)
    expect(result.ownsEvent(event)).toBe(false)
    result.handleKeyDown(event)
    expect(event.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(child)
  })

  it('藏在 hidden 里的项不参与，roving tabindex 只留一个停靠点', async () => {
    const { result } = mountComposable(() => useListFocus({
      hasRovingTabIndex: true,
      itemSelector: 'button',
    }))
    const list = document.createElement('div')
    const hidden = document.createElement('div')
    hidden.hidden = true
    const hiddenButton = document.createElement('button')
    hidden.append(hiddenButton)
    const first = document.createElement('button')
    const second = document.createElement('button')
    list.append(hidden, first, second)
    document.body.append(list)
    result.listRef.value = list
    await nextTick()

    expect(result.getItems()).toEqual([first, second])
    expect(first.getAttribute('tabindex')).toBe('0')
    expect(second.getAttribute('tabindex')).toBe('-1')

    first.focus()
    result.handleKeyDown(key('ArrowDown'))
    expect(document.activeElement).toBe(second)
    expect(second.getAttribute('tabindex')).toBe('0')
    expect(first.getAttribute('tabindex')).toBe('-1')

    first.focus()
    const focusEvent = new FocusEvent('focus')
    Object.defineProperty(focusEvent, 'target', { configurable: true, value: first })
    result.handleFocus(focusEvent)
    expect(first.getAttribute('tabindex')).toBe('0')
    expect(second.getAttribute('tabindex')).toBe('-1')
  })

  it('光标还在文本中间时不抢走方向键', async () => {
    const { result } = mountComposable(() => useListFocus({
      hasCaretGuard: true,
      itemSelector: 'button, input',
      orientation: 'horizontal',
    }))
    const list = document.createElement('div')
    const input = document.createElement('input')
    input.value = 'hello'
    list.append(input)
    document.body.append(list)
    result.listRef.value = list
    await nextTick()
    input.focus()
    input.setSelectionRange(1, 1)

    const right = key('ArrowRight')
    input.dispatchEvent(right)
    result.handleKeyDown(right)
    expect(right.defaultPrevented).toBe(false)

    input.setSelectionRange(5, 5)
    const atEnd = key('ArrowRight')
    input.dispatchEvent(atEnd)
    result.handleKeyDown(atEnd)
    expect(atEnd.defaultPrevented).toBe(true)
  })

  it('翻页键只在打开 hasPaging 时拦截', async () => {
    const off = mountComposable(() => useListFocus())
    const ignored = key('PageDown')
    off.result.handleKeyDown(ignored)
    expect(ignored.defaultPrevented).toBe(false)

    const { result } = mountComposable(() => useListFocus({ hasPaging: true }))
    const list = document.createElement('div')
    list.append(item('一'), item('二'))
    document.body.append(list)
    result.listRef.value = list
    await nextTick()
    const page = key('PageDown')
    result.handleKeyDown(page)
    expect(page.defaultPrevented).toBe(true)
  })

  it('没有可用项时 focusFirst 返回 false', () => {
    const { result } = mountComposable(() => useListFocus())
    expect(result.focusFirst()).toBe(false)
    expect(result.focusLast()).toBe(false)
  })
})
