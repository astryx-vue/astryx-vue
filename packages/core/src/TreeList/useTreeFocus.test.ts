import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountComposable } from '../composables/testing/mountComposable.js'
import { useTreeFocus } from './useTreeFocus.js'

function key(name: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { key: name, cancelable: true })
}

function item(root: HTMLElement, id: string): HTMLElement {
  const found = root.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)
  if (found == null)
    throw new Error(`missing item ${id}`)
  return found
}

describe('useTreeFocus', () => {
  let tree: HTMLDivElement

  beforeEach(() => {
    tree = document.createElement('div')
    tree.setAttribute('role', 'tree')
    tree.innerHTML = `
      <ul role="group">
        <li role="treeitem" data-tree-id="a" aria-level="1" aria-expanded="true" tabindex="0">Alpha</li>
        <li role="treeitem" data-tree-id="b" aria-level="2" tabindex="-1">Apple</li>
        <li role="treeitem" data-tree-id="c" aria-level="1" aria-disabled="true" tabindex="-1">Cherry</li>
        <li role="treeitem" data-tree-id="d" aria-level="1" tabindex="-1">Date</li>
      </ul>
    `
    document.body.append(tree)
  })

  afterEach(() => {
    tree.remove()
    vi.useRealTimers()
  })

  it('moves the single tab stop with the arrow keys when it owns it', () => {
    const onActiveChange = vi.fn()
    const { result } = mountComposable(() => {
      const focus = useTreeFocus({ hasRovingTabIndex: true, onActiveChange })
      focus.treeRef.value = tree
      return focus
    })

    item(tree, 'a').focus()
    result.handleKeyDown(key('ArrowDown'))

    expect(document.activeElement).toBe(item(tree, 'b'))
    expect(item(tree, 'b').tabIndex).toBe(0)
    expect(item(tree, 'a').tabIndex).toBe(-1)
    expect(onActiveChange).toHaveBeenLastCalledWith('b')
  })

  it('leaves the tab stop to the caller by default', () => {
    const { result } = mountComposable(() => {
      const focus = useTreeFocus({})
      focus.treeRef.value = tree
      return focus
    })

    item(tree, 'a').focus()
    result.handleKeyDown(key('ArrowDown'))
    result.handleFocus()

    expect(document.activeElement).toBe(item(tree, 'b'))
    expect(item(tree, 'a').tabIndex).toBe(0)
    expect(item(tree, 'b').tabIndex).toBe(-1)
  })

  it('focusFirst and focusLast skip disabled items', () => {
    const onActiveChange = vi.fn()
    const { result } = mountComposable(() => {
      const focus = useTreeFocus({ onActiveChange })
      focus.treeRef.value = tree
      return focus
    })

    result.focusFirst()
    expect(document.activeElement).toBe(item(tree, 'a'))

    result.focusLast()
    expect(document.activeElement).toBe(item(tree, 'd'))
    expect(onActiveChange).toHaveBeenLastCalledWith('d')
  })

  it('reports the id to onActivate and only falls back to expansion when unhandled', () => {
    const onActivate = vi.fn(() => true)
    const onToggleExpand = vi.fn()
    const { result } = mountComposable(() => {
      const focus = useTreeFocus({ onActivate, onToggleExpand })
      focus.treeRef.value = tree
      return focus
    })

    item(tree, 'a').focus()
    result.handleKeyDown(key('Enter'))

    expect(onActivate).toHaveBeenCalledWith(item(tree, 'a'), 'a')
    expect(onToggleExpand).not.toHaveBeenCalled()
  })

  it('passes the id of the item it expands or collapses', () => {
    const onToggleExpand = vi.fn()
    const { result } = mountComposable(() => {
      const focus = useTreeFocus({ onToggleExpand })
      focus.treeRef.value = tree
      return focus
    })

    item(tree, 'a').focus()
    result.handleKeyDown(key('ArrowLeft'))
    expect(onToggleExpand).toHaveBeenCalledWith('a')
    expect(document.activeElement).toBe(item(tree, 'a'))
  })

  it('uses custom item selector, disabled predicate and level reader', () => {
    tree.innerHTML = ''
    tree.removeAttribute('role')
    tree.innerHTML = `
      <div id="root" data-node="root" data-off="false" data-level="1" aria-expanded="true" tabindex="0">Root</div>
      <div id="hidden" data-node="hidden" data-off="true" data-level="2" tabindex="-1">Hidden</div>
      <div id="leaf" data-node="leaf" data-off="false" data-level="2" tabindex="-1">Leaf</div>
    `
    const nodes = [...tree.querySelectorAll<HTMLElement>('[data-node]')]
    const onActiveChange = vi.fn()

    const { result } = mountComposable(() => {
      const focus = useTreeFocus({
        itemSelector: '[data-node]',
        isItemDisabled: node => node.dataset.off === 'true',
        getLevel: node => Number(node.dataset.level),
        onActiveChange,
      })
      focus.treeRef.value = tree
      return focus
    })

    nodes[0]!.focus()
    result.handleKeyDown(key('ArrowDown'))
    expect(document.activeElement).toBe(nodes[2])

    // ArrowLeft from a level-2 leaf goes back to its parent.
    result.handleKeyDown(key('ArrowLeft'))
    expect(document.activeElement).toBe(nodes[0])
    expect(onActiveChange).toHaveBeenLastCalledWith('root')
  })

  it('jumps by typed characters unless typeahead is turned off', () => {
    vi.useFakeTimers()
    const { result } = mountComposable(() => {
      const focus = useTreeFocus({})
      focus.treeRef.value = tree
      return focus
    })

    item(tree, 'a').focus()
    result.handleKeyDown(key('d'))
    expect(document.activeElement).toBe(item(tree, 'd'))

    const off = mountComposable(() => {
      const focus = useTreeFocus({ typeahead: false })
      focus.treeRef.value = tree
      return focus
    })
    item(tree, 'a').focus()
    off.result.handleKeyDown(key('a'))
    expect(document.activeElement).toBe(item(tree, 'a'))
  })
})
