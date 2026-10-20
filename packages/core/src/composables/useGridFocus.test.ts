import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useGridFocus } from './useGridFocus.js'

function mountGrid(setup?: (api: ReturnType<typeof useGridFocus>) => void) {
  let api!: ReturnType<typeof useGridFocus>
  const pageUp = vi.fn()
  const pageDown = vi.fn()
  const before = vi.fn()
  const after = vi.fn()

  const wrapper = mount(defineComponent({
    name: 'GridHost',
    setup() {
      api = useGridFocus({
        columns: 3,
        hasRovingTabIndex: true,
        isCellFocusable: cell => cell.dataset.disabled === undefined,
        onPageUp: pageUp,
        onPageDown: pageDown,
        onNavigateBefore: before,
        onNavigateAfter: after,
      })
      setup?.(api)
      const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      return () => h('div', { ref: api.gridRef, role: 'grid', onKeydown: api.handleKeyDown, onFocusin: api.handleFocus }, labels.map((label, index) => h('div', { role: 'gridcell' }, [h('button', { 'type': 'button', 'data-cell': index, 'data-disabled': index === 4 ? '' : undefined, 'tabindex': index === 0 ? 0 : -1 }, label)])))
    },
  }), { attachTo: document.body })

  return { wrapper, api, pageUp, pageDown, before, after }
}

function cell(wrapper: ReturnType<typeof mountGrid>['wrapper'], index: number): HTMLElement {
  return wrapper.get(`[data-cell="${index}"]`).element as HTMLElement
}

function focusCellIndex(wrapper: ReturnType<typeof mountGrid>['wrapper'], index: number): void {
  cell(wrapper, index).focus()
}

function press(wrapper: ReturnType<typeof mountGrid>['wrapper'], key: string, init: KeyboardEventInit = {}): Promise<void> {
  return wrapper.get('[role="grid"]').trigger('keydown', { key, ...init })
}

describe('useGridFocus', () => {
  it('seeds one roving tab stop and repairs it on focus', async () => {
    const { wrapper } = mountGrid()
    await wrapper.vm.$nextTick()
    expect(cell(wrapper, 0).tabIndex).toBe(0)
    expect(cell(wrapper, 1).tabIndex).toBe(-1)

    focusCellIndex(wrapper, 3)
    await wrapper.get('[data-cell="3"]').trigger('focusin')
    expect(cell(wrapper, 3).tabIndex).toBe(0)
    expect(cell(wrapper, 0).tabIndex).toBe(-1)
  })

  it('moves by one cell and by one row', async () => {
    const { wrapper } = mountGrid()
    focusCellIndex(wrapper, 0)

    await press(wrapper, 'ArrowRight')
    expect(document.activeElement).toBe(cell(wrapper, 1))
    expect(cell(wrapper, 1).tabIndex).toBe(0)

    await press(wrapper, 'ArrowDown')
    expect(document.activeElement).toBe(cell(wrapper, 1))

    focusCellIndex(wrapper, 0)
    await press(wrapper, 'ArrowDown')
    expect(document.activeElement).toBe(cell(wrapper, 3))
  })

  it('keeps Home and End inside the row, and Ctrl+Home / Ctrl+End on the grid', async () => {
    const { wrapper } = mountGrid()
    focusCellIndex(wrapper, 5)

    await press(wrapper, 'Home')
    expect(document.activeElement).toBe(cell(wrapper, 3))
    await press(wrapper, 'End')
    expect(document.activeElement).toBe(cell(wrapper, 5))
    await press(wrapper, 'Home', { ctrlKey: true })
    expect(document.activeElement).toBe(cell(wrapper, 0))
    await press(wrapper, 'End', { ctrlKey: true })
    expect(document.activeElement).toBe(cell(wrapper, 8))
  })

  it('hands Page Up and Page Down to the caller', async () => {
    const { wrapper, pageUp, pageDown } = mountGrid()
    focusCellIndex(wrapper, 0)

    await press(wrapper, 'PageUp')
    await press(wrapper, 'PageDown')
    expect(pageUp).toHaveBeenCalledTimes(1)
    expect(pageDown).toHaveBeenCalledTimes(1)
  })

  it('reports the column and offset when navigation leaves the grid', async () => {
    const { wrapper, before, after } = mountGrid()
    focusCellIndex(wrapper, 8)
    await press(wrapper, 'ArrowRight')
    expect(after).toHaveBeenCalledWith(2, 1)

    focusCellIndex(wrapper, 0)
    await press(wrapper, 'ArrowLeft')
    expect(before).toHaveBeenCalledWith(0, 1)

    focusCellIndex(wrapper, 7)
    await press(wrapper, 'ArrowDown')
    expect(after).toHaveBeenCalledWith(1, 3)
  })

  it('skips cells that cannot take focus and clamps explicit jumps', async () => {
    const { wrapper, api } = mountGrid()
    focusCellIndex(wrapper, 1)
    await press(wrapper, 'ArrowDown')
    expect(document.activeElement).toBe(cell(wrapper, 1))

    api.focusCell(99)
    expect(document.activeElement).toBe(cell(wrapper, 8))
    api.focusCell(-5)
    expect(document.activeElement).toBe(cell(wrapper, 0))

    api.focusLast()
    expect(document.activeElement).toBe(cell(wrapper, 8))
    api.focusFirst()
    expect(document.activeElement).toBe(cell(wrapper, 0))
  })

  it('does nothing without a focused cell', async () => {
    const { wrapper } = mountGrid()
    await press(wrapper, 'ArrowRight')
    expect(document.activeElement).not.toBe(cell(wrapper, 1))
  })

  it('follows the columns ref', async () => {
    const columns = ref(2)
    let api!: ReturnType<typeof useGridFocus>
    const wrapper = mount(defineComponent({
      setup() {
        api = useGridFocus({ columns })
        return () => h('div', { ref: api.gridRef, role: 'grid', onKeydown: api.handleKeyDown }, [0, 1, 2, 3].map(index => h('button', { 'type': 'button', 'data-cell': index }, String(index))))
      },
    }), { attachTo: document.body })
    cell(wrapper, 0).focus()
    await press(wrapper, 'ArrowDown')
    expect(document.activeElement).toBe(cell(wrapper, 2))

    columns.value = 3
    cell(wrapper, 0).focus()
    await press(wrapper, 'ArrowDown')
    expect(document.activeElement).toBe(cell(wrapper, 3))
  })
})

describe('useGridFocus return shape', () => {
  it('exposes a template ref and handlers', () => {
    const { api } = mountGrid()
    expect(typeof api.handleKeyDown).toBe('function')
    expect(typeof api.handleFocus).toBe('function')
    expect(typeof api.focusCell).toBe('function')
    expect(typeof api.focusFirst).toBe('function')
    expect(typeof api.focusLast).toBe('function')
    expect((api.gridRef as Ref<HTMLElement | null>).value).not.toBeNull()
  })
})
