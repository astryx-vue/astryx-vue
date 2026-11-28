import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import ChatComposerInput from './ChatComposerInput.vue'
import {
  insertTextAtCursor,
  placeCaretAfterNode,
  placeCaretAfterRemovedToken,
  placeCaretAtEnd,
} from './selection.js'

let editable: HTMLDivElement

function caret(): Range {
  const selection = window.getSelection()
  expect(selection?.rangeCount).toBe(1)
  return (selection as Selection).getRangeAt(0)
}

function setup(html: string): void {
  editable = document.createElement('div')
  editable.setAttribute('contenteditable', 'true')
  editable.innerHTML = html
  document.body.append(editable)
}

afterEach(() => {
  editable?.remove()
  window.getSelection()?.removeAllRanges()
})

// 输入法的组字锚在光标所在的 DOM 边界上：落在元素边界时第一个字母会当成普通字符上屏。
describe('光标落进文本节点，输入法才能组字', () => {
  it('placeCaretAtEnd 落进末尾文本节点，而不是停在编辑区上', () => {
    setup('hello')
    placeCaretAtEnd(editable)
    const range = caret()
    expect(range.startContainer.nodeType).toBe(Node.TEXT_NODE)
    expect(range.startOffset).toBe(5)
  })

  it('末尾不是文本（空草稿、令牌）时保持原位', () => {
    setup('')
    placeCaretAtEnd(editable)
    expect(caret().startContainer).toBe(editable)

    editable.innerHTML = '<span contenteditable="false" data-astryx-token>@ada</span>'
    placeCaretAtEnd(editable)
    expect(caret().startContainer).toBe(editable)
  })

  it('insertTextAtCursor 之后光标在新文本节点里', () => {
    setup('')
    placeCaretAtEnd(editable)
    insertTextAtCursor(editable, 'abc')
    const range = caret()
    expect(range.startContainer.nodeType).toBe(Node.TEXT_NODE)
    expect(range.startContainer.textContent).toBe('abc')
    expect(range.startOffset).toBe(3)
  })

  it('placeCaretAfterNode 落进它前面的文本节点', () => {
    setup('one <b>two</b> three')
    const text = editable.firstChild as Text
    placeCaretAfterNode(editable, text)
    expect(caret().startContainer).toBe(text)
    expect(caret().startOffset).toBe(4)
  })
})

describe('删掉令牌之后的光标', () => {
  it('令牌前面还有文字时，光标落在这段文字末尾', () => {
    setup('say ')
    const before = editable.firstChild
    placeCaretAfterRemovedToken(editable, before, null)
    expect(caret().startContainer).toBe(before)
    expect(caret().startOffset).toBe(4)
  })

  it('删空最后一行时，这一行留 <br> 占位，光标落在前面的空文本节点里', () => {
    setup('first<br>')
    const br = editable.lastChild
    placeCaretAfterRemovedToken(editable, br, null)
    const range = caret()
    expect(range.startContainer.nodeType).toBe(Node.TEXT_NODE)
    expect(range.startContainer.textContent).toBe('')
    expect(editable.lastChild?.nodeName).toBe('BR')
    expect(editable.childNodes.length).toBe(4)
  })

  it('令牌后面还有内容时不补占位', () => {
    setup('first<br>')
    const br = editable.lastChild
    const tail = document.createTextNode('tail')
    editable.append(tail)
    placeCaretAfterRemovedToken(editable, br, tail)
    expect(editable.querySelectorAll('br').length).toBe(1)
  })
})

describe('chatComposerInput 令牌的光标', () => {
  it('插入令牌后光标落在尾随空格的文本节点里', async () => {
    const wrapper = mount(ChatComposerInput, { attachTo: document.body })
    const field = wrapper.get('.astryx-chat-composer-input__editable').element as HTMLElement
    field.focus()
    const handle = wrapper.vm as unknown as { insertToken: (token: { value: string, label: string }) => string | undefined }
    handle.insertToken({ value: '@ada', label: '@Ada' })
    await nextTick()

    const range = caret()
    expect(range.startContainer.nodeType).toBe(Node.TEXT_NODE)
    expect(range.startOffset).toBe(range.startContainer.textContent?.length)
    wrapper.unmount()
  })

  it('backspace 删掉令牌连同尾随空格后，光标落在令牌前的文字里', async () => {
    const wrapper = mount(ChatComposerInput, { attachTo: document.body })
    const field = wrapper.get('.astryx-chat-composer-input__editable').element as HTMLElement
    field.focus()
    field.textContent = 'hi '
    placeCaretAtEnd(field)
    const handle = wrapper.vm as unknown as { insertToken: (token: { value: string, label: string }) => string | undefined }
    handle.insertToken({ value: '@ada', label: '@Ada' })
    await nextTick()

    const space = field.querySelector('[data-astryx-token]')?.nextSibling as Text
    const range = document.createRange()
    range.setStart(space, space.length)
    range.collapse(true)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
    const down = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
    field.dispatchEvent(down)
    expect(down.defaultPrevented).toBe(true)

    expect(field.querySelector('[data-astryx-token]')).toBeNull()
    const after = caret()
    expect(after.startContainer.nodeType).toBe(Node.TEXT_NODE)
    expect(after.startContainer.textContent).toBe('hi ')
    wrapper.unmount()
  })
})
