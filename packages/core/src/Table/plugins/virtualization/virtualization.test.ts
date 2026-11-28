import type { VueWrapper } from '@vue/test-utils'
import type { TableColumn, TablePlugin } from '../../types.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { pixel } from '../../columnUtils.js'
import Table from '../../Table.vue'
import { useTableRowExpansion } from '../rowExpansion.js'
import { useTableRowIndex } from '../rowIndex.js'
import { useTableSelection } from '../selection.js'
import { useTableSortable } from '../sortable.js'
import { useTableStickyColumns } from '../stickyColumns.js'
import { useTableColumnsVirtualization, useTableRowsVirtualization } from '../virtualization.js'

type Row = Record<string, unknown> & { id: string }

const HEADER_HEIGHT = 40

function makeRows(count: number): Row[] {
  return Array.from({ length: count }, (_, index) => ({ id: `r${index}`, name: `Row ${index}`, c0: index }))
}

function makeColumns(count: number): TableColumn<Row>[] {
  return Array.from({ length: count }, (_, index) => ({ key: `c${index}`, header: `C${index}`, width: pixel(100) }))
}

interface MountOptions {
  rows?: Row[]
  columns?: TableColumn<Row>[]
  plugins?: () => Record<string, TablePlugin<Row>>
  props?: Record<string, unknown>
}

const mounted: VueWrapper[] = []

function mountTable(options: MountOptions = {}): VueWrapper {
  const Host = defineComponent({
    setup() {
      const plugins = options.plugins?.() ?? { rows: useTableRowsVirtualization<Row>({ rowHeight: 40, initialViewportHeight: 400 }) }
      const props: Record<string, unknown> = {
        data: options.rows ?? makeRows(1000),
        columns: options.columns ?? [{ key: 'name', header: 'Name' }],
        plugins,
        ...options.props,
      }
      return () => h(Table, props)
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

/** jsdom 不排版：给滚动区一个尺寸和滚动位置，表体顶部跟着滚动位置走。 */
function stubViewport(wrapper: VueWrapper, size = { height: 400, width: 800 }) {
  const viewport = wrapper.get('.astryx-table-scroll').element as HTMLElement
  const body = wrapper.get('tbody').element as HTMLElement
  let top = 0
  let left = 0
  Object.defineProperties(viewport, {
    clientHeight: { configurable: true, get: () => size.height },
    clientWidth: { configurable: true, get: () => size.width },
    scrollHeight: { configurable: true, get: () => 1e7 },
    scrollTop: { configurable: true, get: () => top, set: (value: number) => { top = value } },
    scrollLeft: { configurable: true, get: () => left, set: (value: number) => { left = value } },
  })
  body.getBoundingClientRect = () => ({ top: HEADER_HEIGHT - top }) as DOMRect
  return {
    async scroll(next: { top?: number, left?: number }) {
      top = next.top ?? top
      left = next.left ?? left
      viewport.dispatchEvent(new Event('scroll'))
      await nextTick()
      await nextTick()
    },
  }
}

function bodyRowIndices(wrapper: VueWrapper): number[] {
  return wrapper.findAll('tbody tr[data-window-row]').map(row => Number(row.attributes('aria-rowindex')))
}

function headerColumnIndices(wrapper: VueWrapper): number[] {
  return wrapper.findAll('thead th').map(cell => Number(cell.attributes('aria-colindex')))
}

let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
})

describe('useTableRowsVirtualization', () => {
  it('首帧按声明的视口高度只挂前面几行，后面用占位行撑住滚动高度', () => {
    const wrapper = mountTable()
    expect(bodyRowIndices(wrapper)).toEqual(Array.from({ length: 14 }, (_, index) => index + 2))
    const gap = wrapper.get('tbody tr[data-window-gap]')
    expect(gap.attributes('aria-hidden')).toBe('true')
    expect(gap.get('td').attributes('style')).toContain(`height: ${986 * 40}px`)
    const table = wrapper.get('table')
    expect(table.attributes('aria-rowcount')).toBe('1001')
    expect(table.attributes('data-overflow')).toBe('truncate')
    expect(wrapper.get('thead tr').attributes('aria-rowindex')).toBe('1')
    expect(wrapper.get('.astryx-table-scroll').attributes('data-block-viewport')).toBeDefined()
  })

  it('滚动之后换成视口里的行', async () => {
    const wrapper = mountTable()
    const viewport = stubViewport(wrapper)
    await viewport.scroll({ top: HEADER_HEIGHT + 500 * 40 })
    const indices = bodyRowIndices(wrapper)
    expect(indices[0]).toBe(496 + 2)
    expect(indices.at(-1)).toBe(513 + 2)
    expect(wrapper.findAll('tbody tr[data-window-gap]')).toHaveLength(2)
  })

  it('有焦点的行滚出视口也继续挂着', async () => {
    const wrapper = mountTable({
      plugins: () => ({
        rows: useTableRowsVirtualization<Row>({ rowHeight: 40, initialViewportHeight: 400 }),
        selection: useTableSelection<Row>({
          getIsItemSelected: () => false,
          onSelectItem: () => {},
          onSelectAll: () => {},
          getIsAllSelected: () => false,
        }),
      }),
    })
    const viewport = stubViewport(wrapper)
    await viewport.scroll({ top: 0 })
    const checkbox = wrapper.findAll('tbody tr[data-window-row]')[2]!.get('input').element as HTMLInputElement
    checkbox.focus()
    await nextTick()
    await viewport.scroll({ top: HEADER_HEIGHT + 500 * 40 })
    const indices = bodyRowIndices(wrapper)
    expect(indices[0]).toBe(4)
    expect(indices[1]).toBe(496 + 2)
    expect(document.activeElement).toBe(checkbox)
    expect(wrapper.findAll('tbody tr[data-window-gap]')).toHaveLength(3)
  })

  it('行号列参与窗口化，编号按整份数据的位置', async () => {
    const wrapper = mountTable({
      plugins: () => ({
        rows: useTableRowsVirtualization<Row>({ rowHeight: 40, initialViewportHeight: 400 }),
        index: useTableRowIndex<Row>(),
      }),
    })
    const viewport = stubViewport(wrapper)
    await viewport.scroll({ top: HEADER_HEIGHT + 500 * 40 })
    expect(wrapper.find('tbody tr[data-window-row] .astryx-table__row-index').text()).toBe('497')
  })

  it('所有行一起变高时改用量到的行高', async () => {
    const rect = vi.spyOn(HTMLTableRowElement.prototype, 'getBoundingClientRect').mockReturnValue({ height: 80 } as DOMRect)
    const wrapper = mountTable()
    const viewport = stubViewport(wrapper)
    await viewport.scroll({ top: 1 })
    await viewport.scroll({ top: HEADER_HEIGHT + 100 * 80 })
    expect(bodyRowIndices(wrapper)[0]).toBe(96 + 2)
    rect.mockRestore()
  })

  it('行高不一时退回全部渲染', async () => {
    const rect = vi.spyOn(HTMLTableRowElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLTableRowElement) {
      return { height: Number(this.getAttribute('aria-rowindex')) % 2 === 0 ? 40 : 80 } as DOMRect
    })
    const wrapper = mountTable({ rows: makeRows(100) })
    const viewport = stubViewport(wrapper)
    await viewport.scroll({ top: 1 })
    await nextTick()
    expect(wrapper.findAll('tbody tr')).toHaveLength(100)
    expect(wrapper.find('tbody tr[data-window-gap]').exists()).toBe(false)
    rect.mockRestore()
  })

  it.each([
    ['写明折行', { props: { textOverflow: 'wrap' } }],
    ['传了 rowIndexStart', { props: { rowIndexStart: 1 } }],
    ['有展开面板', {
      plugins: () => ({
        rows: useTableRowsVirtualization<Row>({ rowHeight: 40, initialViewportHeight: 400 }),
        expansion: useTableRowExpansion<Row>({ expandedKeys: new Set(), onToggle: () => {}, getRowKey: row => row.id, renderExpanded: () => null }),
      }),
    }],
    ['行键重复', { rows: makeRows(100).map(row => ({ ...row, id: 'same' })) }],
    ['自定义单元格', { columns: [{ key: 'name', header: 'Name', renderCell: (row: Row) => String(row.name) }] }],
  ] as [string, MountOptions][])('%s时退回全部渲染', (_, options) => {
    const wrapper = mountTable({ rows: makeRows(100), ...options })
    expect(wrapper.find('tbody tr[data-window-gap]').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr').length).toBeGreaterThanOrEqual(100)
    expect(warn).toHaveBeenCalled()
  })
})

describe('useTableColumnsVirtualization', () => {
  function mountColumns(plugins: () => Record<string, TablePlugin<Row>>): VueWrapper {
    return mountTable({ rows: makeRows(3), columns: makeColumns(40).map(column => ({ ...column, sortable: true })), plugins })
  }

  it('只挂行内方向上看得见的列，表头和每一行用同样的占位格', async () => {
    const wrapper = mountColumns(() => ({ columns: useTableColumnsVirtualization<Row>({ initialViewportWidth: 400 }) }))
    expect(headerColumnIndices(wrapper)).toEqual([1, 2, 3, 4, 5, 6])
    expect(wrapper.get('table').attributes('aria-colcount')).toBe('40')
    const gap = wrapper.get('thead td[data-window-gap]')
    expect(gap.attributes('style')).toContain(`width: ${34 * 100}px`)
    for (const row of wrapper.findAll('tbody tr'))
      expect(row.findAll('td')).toHaveLength(7)

    const viewport = stubViewport(wrapper, { height: 400, width: 400 })
    await viewport.scroll({ left: 2000 })
    expect(headerColumnIndices(wrapper)).toEqual([19, 20, 21, 22, 23, 24, 25, 26])
    expect(wrapper.get('tbody td[aria-colindex="19"]').attributes('style')).toBeUndefined()
  })

  it('还挂着的格子在列范围变化时保留原来的元素', async () => {
    const wrapper = mountColumns(() => ({ columns: useTableColumnsVirtualization<Row>({ initialViewportWidth: 400 }) }))
    const viewport = stubViewport(wrapper, { height: 400, width: 400 })
    await viewport.scroll({ left: 2000 })
    const cell = wrapper.get('tbody tr td[aria-colindex="22"]').element
    await viewport.scroll({ left: 2100 })
    expect(wrapper.get('tbody tr td[aria-colindex="22"]').element).toBe(cell)
  })

  it('固定列和有焦点的列一直挂着', async () => {
    const wrapper = mountColumns(() => ({
      columns: useTableColumnsVirtualization<Row>({ initialViewportWidth: 400 }),
      sticky: useTableStickyColumns<Row>({ startKeys: ['c0'] }),
      sort: useTableSortable<Row>({ sort: [], onSortChange: () => {} }),
    }))
    const viewport = stubViewport(wrapper, { height: 400, width: 400 })
    await viewport.scroll({ left: 0 })
    const button = wrapper.get('thead th[aria-colindex="3"] button').element as HTMLButtonElement
    button.focus()
    await nextTick()
    await viewport.scroll({ left: 2000 })
    const indices = headerColumnIndices(wrapper)
    expect(indices[0]).toBe(1)
    expect(indices[1]).toBe(3)
    expect(indices[2]).toBeGreaterThan(15)
    expect(document.activeElement).toBe(button)
  })

  it('滚动区放得下表格最小宽度时挂上所有列', async () => {
    const wrapper = mountTable({
      rows: makeRows(3),
      columns: makeColumns(5),
      plugins: () => ({ columns: useTableColumnsVirtualization<Row>({ initialViewportWidth: 1200 }) }),
    })
    expect(headerColumnIndices(wrapper).every(Number.isNaN)).toBe(true)
    expect(wrapper.findAll('thead th')).toHaveLength(5)
    expect(wrapper.get('table').attributes('aria-colcount')).toBeUndefined()
  })
})
