import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useFocusTrap } from './useFocusTrap.js'

enableAutoUnmount(afterEach)

function tab(target: Element, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)
  return event
}

function mountTrap(html: string, doc: Document = document): HTMLElement {
  const container = doc.createElement('div')
  container.innerHTML = html
  doc.body.append(container)
  const containerRef = ref<HTMLElement | null>(container)
  mountComposable(() => useFocusTrap({ container: containerRef, isEnabled: true }))
  return container
}

function byId<T extends HTMLElement = HTMLElement>(root: ParentNode, id: string): T {
  const found = root.querySelector<T>(`#${id}`)
  if (found == null)
    throw new Error(`missing #${id}`)
  return found
}

describe('useFocusTrap 的焦点区域', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('leaves Ctrl+Tab and Meta+Tab to the page, Alt+Shift+Tab still wraps', async () => {
    const root = mountTrap('<button id="first">First</button><button id="last">Last</button>')
    await nextTick()
    byId(root, 'last').focus()

    expect(tab(byId(root, 'last'), { ctrlKey: true }).defaultPrevented).toBe(false)
    expect(tab(byId(root, 'last'), { metaKey: true }).defaultPrevented).toBe(false)
    byId(root, 'first').focus()
    expect(tab(byId(root, 'first'), { altKey: true, shiftKey: true }).defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(byId(root, 'last'))
  })

  it('keeps focus where a control that handled Tab itself left it', async () => {
    const root = mountTrap('<button id="first">First</button><textarea id="editor"></textarea>')
    await nextTick()
    const editor = byId(root, 'editor')
    editor.addEventListener('keydown', event => event.preventDefault())
    editor.focus()

    tab(editor)
    expect(document.activeElement).toBe(editor)
  })

  it('counts a same-name radio group as one stop at either end', async () => {
    const root = mountTrap(`
      <button id="first">First</button>
      <input id="r1" type="radio" name="size">
      <input id="r2" type="radio" name="size" checked>
      <input id="r3" type="radio" name="size">
    `)
    await nextTick()
    const checked = byId(root, 'r2')
    checked.focus()
    expect(tab(checked).defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(byId(root, 'first'))

    byId(root, 'first').focus()
    tab(byId(root, 'first'), { shiftKey: true })
    expect(document.activeElement).toBe(checked)
  })

  it('leaves controls inside a closed dialog the page does not display out of the cycle', async () => {
    const root = mountTrap(`
      <button id="first">First</button>
      <button id="last">Last</button>
      <dialog><button id="hidden">In a closed sheet</button></dialog>
    `)
    await nextTick()
    byId(root, 'last').focus()
    expect(tab(byId(root, 'last')).defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(byId(root, 'first'))
  })

  it('keeps controls inside a closed dialog the page displays in flow', async () => {
    const root = mountTrap(`
      <button id="first">First</button>
      <dialog id="inline"><button id="inside">In an inline dialog</button></dialog>
    `)
    const dialog = byId(root, 'inline')
    dialog.style.display = 'block'
    await nextTick()
    byId(root, 'first').focus()
    expect(tab(byId(root, 'first'), { shiftKey: true }).defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(byId(root, 'inside'))
  })

  it('lets the innermost region holding focus answer the Tab', async () => {
    const outer = mountTrap('<button id="outer-first">Outer</button><div id="inner-slot"></div>')
    const inner = byId(outer, 'inner-slot')
    inner.innerHTML = '<button id="inner-first">Inner first</button><button id="inner-last">Inner last</button>'
    const innerRef = ref<HTMLElement | null>(inner)
    mountComposable(() => useFocusTrap({ container: innerRef, isEnabled: true }))
    await nextTick()

    byId(outer, 'inner-last').focus()
    expect(tab(byId(outer, 'inner-last')).defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(byId(outer, 'inner-first'))
  })

  it('wraps Shift+Tab from a focused title that is not a Tab stop', async () => {
    const root = mountTrap('<h2 id="title" tabindex="-1">Title</h2><button id="first">First</button><button id="last">Last</button>')
    await nextTick()
    byId(root, 'title').focus()
    expect(tab(byId(root, 'title'), { shiftKey: true }).defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(byId(root, 'last'))
  })

  it('handles Tab in the document that holds its container', async () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const doc = frame.contentDocument!
    const root = mountTrap('<button id="first">First</button><button id="last">Last</button>', doc)
    await nextTick()
    byId(root, 'last').focus()
    expect(tab(byId(root, 'last')).defaultPrevented).toBe(true)
    expect(doc.activeElement).toBe(byId(root, 'first'))
  })
})
