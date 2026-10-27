import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import { capitalize, paginateData, pixel, proportional, resolveColumnWidths, resolveTableMinWidth } from './columnUtils.js'
import { applyTableFilters, useTableFiltering, useTableFilterState } from './plugins/filtering.js'
import { useTableSelection, useTableSelectionState } from './plugins/selection.js'
import { useTableSortable, useTableSortableState } from './plugins/sortable.js'
import Table from './Table.vue'

interface Person extends Record<string, unknown> {
  id: string
  name: string
  age: number
}

const people: Person[] = [
  { id: '1', name: 'Charlie', age: 45 },
  { id: '2', name: 'Alice', age: 32 },
  { id: '3', name: 'Bob', age: 28 },
]

const columns = [
  { key: 'name', header: 'Name', width: proportional(1), sortable: true },
  { key: 'age', header: 'Age', width: pixel(80), sortable: true, align: 'end' as const },
]

describe('table column widths', () => {
  it('gives proportional columns a percentage and pixel columns a fixed floor', () => {
    const resolved = resolveColumnWidths(columns)
    expect(resolved.columns.get('name')?.style.width).toBe('100%')
    expect(resolved.columns.get('name')?.style.minWidth).toBe('120px')
    expect(resolved.columns.get('age')?.style.width).toBe('80px')
    expect(resolved.tableMinWidth).toBe(200)
  })

  it('keeps the larger of a consumer minWidth and the column floors', () => {
    expect(resolveTableMinWidth(undefined, 240)).toBe('240px')
    expect(resolveTableMinWidth(900, 240)).toBe('900px')
    expect(resolveTableMinWidth(100, 240)).toBe('240px')
    expect(resolveTableMinWidth(0, 240)).toBe('240px')
    expect(resolveTableMinWidth('900px', 240)).toBe('900px')
    expect(resolveTableMinWidth('10px', 240)).toBe('240px')
    expect(resolveTableMinWidth('0', 240)).toBe('240px')
    expect(resolveTableMinWidth('0rem', 240)).toBe('240px')
    expect(resolveTableMinWidth('', 240)).toBe('240px')
    expect(resolveTableMinWidth('60rem', 240)).toBe('max(60rem, 240px)')
    expect(resolveTableMinWidth('50%', 240)).toBe('max(50%, 240px)')
    expect(resolveTableMinWidth('calc(100% - 2rem)', 240)).toBe('max(calc(100% - 2rem), 240px)')
    expect(resolveTableMinWidth('var(--table-min)', 240)).toBe('max(var(--table-min), 240px)')
    expect(resolveTableMinWidth('auto', 240)).toBe('240px')
    expect(resolveTableMinWidth('max-content', 240)).toBe('240px')
    expect(resolveTableMinWidth('12', 240)).toBe('240px')
  })

  it('capitalizes the first character without splitting an emoji', () => {
    expect(capitalize('email')).toBe('Email')
    expect(capitalize('😀name')).toBe('😀name')
  })

  it('slices pages without reading past the ends', () => {
    expect(paginateData(people, 2, 2).map(person => person.id)).toEqual(['3'])
    expect(paginateData(people, Number.NaN, Number.NaN)).toHaveLength(3)
    expect(paginateData(people, -1, 0).map(person => person.id)).toEqual(['1'])
  })
})

describe('table', () => {
  it('renders rows, an empty state, and density on the table', () => {
    const wrapper = mount(Table, {
      props: { data: people, columns, idKey: 'id', density: 'compact' },
    })
    expect(wrapper.get('table').attributes('data-density')).toBe('compact')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.get('th').text()).toContain('Name')

    const empty = mount(Table, { props: { data: [], columns } })
    expect(empty.get('tbody td').text()).toBe('No data')
    expect(empty.get('tbody td').attributes('colspan')).toBe('2')
  })

  it('keeps the popover filter button on the same line as the header label', () => {
    const filtered = [
      { key: 'name', header: 'Name', filter: 'name' },
      { key: 'age', header: 'Age', filter: 'age' },
    ]
    const wrapper = mount(Table, {
      props: {
        columns: filtered,
        data: people,
        idKey: 'id',
        plugins: {
          filtering: useTableFiltering({
            filters: {},
            fields: [
              { key: 'name', label: 'Name', type: 'string' },
              { key: 'age', label: 'Age', type: 'number' },
            ],
            onFilterChange: () => {},
          }),
        },
      },
    })

    const headers = wrapper.findAll('thead th .astryx-table__header')
    expect(headers).toHaveLength(2)
    for (const header of headers) {
      expect(header.find('.astryx-table__header-line .astryx-table__filter').exists()).toBe(true)
    }
  })

  it('hands the row element and row events to plugins, merging every plugin', async () => {
    const mounted: HTMLTableRowElement[] = []
    const unmounted: Array<HTMLTableRowElement | null> = []
    const seen: string[] = []
    const wrapper = mount(Table, {
      props: {
        columns,
        data: people,
        idKey: 'id',
        plugins: {
          first: {
            rowPatch: () => ({
              listeners: {
                onBlur: () => seen.push('first:blur'),
                onMouseenter: () => seen.push('first:enter'),
              },
              ref: (element) => {
                if (element)
                  mounted.push(element)
                else
                  unmounted.push(null)
              },
            }),
          },
          second: {
            rowPatch: () => ({ listeners: { onMouseenter: () => seen.push('second:enter') } }),
          },
        },
      },
    })

    expect(mounted).toHaveLength(3)
    expect(mounted[0]!.tagName).toBe('TR')
    expect(mounted[0]!.querySelector('td')).not.toBeNull()

    const firstRow = wrapper.findAll('tbody tr')[0]!
    await firstRow.trigger('mouseenter')
    expect(seen).toEqual(['first:enter', 'second:enter'])
    expect(firstRow.element).toBe(mounted[0])

    wrapper.unmount()
    expect(unmounted).toHaveLength(3)
  })

  it('re-sorts strings when the provider locale changes', async () => {
    const rows = [
      { id: '1', name: 'z' },
      { id: '2', name: 'ä' },
    ]
    const columns = [{ key: 'name', header: 'Name', sortable: true }]
    const SortTable = defineComponent({
      setup() {
        const { sortedData, sortConfig } = useTableSortableState({
          data: rows,
          defaultSort: [{ sortKey: 'name', direction: 'ascending' as const }],
        })
        const sortable = useTableSortable(sortConfig)
        return () => h(Table, { data: sortedData.value, columns, plugins: { sortable }, idKey: 'id' })
      },
    })
    const Host = defineComponent({
      props: { locale: { type: String, required: true } },
      setup(props) {
        provideAstryxLocale(() => props.locale)
        return () => h(SortTable)
      },
    })
    const swedish = mount(Host, { props: { locale: 'sv-SE' } })
    expect(swedish.findAll('tbody tr').map(row => row.text())).toEqual(['z', 'ä'])
    const german = mount(Host, { props: { locale: 'de-DE' } })
    expect(german.findAll('tbody tr').map(row => row.text())).toEqual(['ä', 'z'])
    swedish.unmount()
    german.unmount()
  })

  it('sorts from the header and cycles back to unsorted', async () => {
    const harness = mount({
      components: { Table },
      setup() {
        const { sortedData, sortConfig } = useTableSortableState<Person>({ data: people })
        const sortable = useTableSortable<Person>(sortConfig)
        return { sortedData, sortable, columns }
      },
      template: '<Table :data="sortedData" :columns="columns" :plugins="{ sortable }" id-key="id" />',
    })
    expect(harness.findAll('tbody td').map(cell => cell.text()).filter((_, index) => index % 2 === 0)).toEqual(['Charlie', 'Alice', 'Bob'])
    await harness.get('button').trigger('click')
    expect(harness.findAll('tbody tr td').map(cell => cell.text())[0]).toBe('Alice')
    await harness.get('button').trigger('click')
    expect(harness.findAll('tbody tr td').map(cell => cell.text())[0]).toBe('Charlie')
    await harness.get('button').trigger('click')
    expect(harness.get('th').attributes('aria-sort')).toBeUndefined()
  })

  it('selects a row and the whole page', async () => {
    const selected = ref(new Set<string>())
    const wrapper = mount({
      components: { Table },
      setup() {
        const { selectionConfig } = useTableSelectionState<Person>({
          data: people,
          idKey: 'id',
          selectedKeys: selected,
          setSelectedKeys: (keys) => {
            selected.value = keys
          },
          getRowLabel: item => item.name,
        })
        const selection = useTableSelection(selectionConfig)
        return { people, columns, selection }
      },
      template: '<Table :data="people" :columns="columns" :plugins="{ selection }" id-key="id" />',
    })
    const boxes = wrapper.findAll('input[type="checkbox"]')
    expect(boxes.length).toBeGreaterThan(1)
    await boxes[1]!.setValue(true)
    await nextTick()
    expect(selected.value.has('1')).toBe(true)
    expect(wrapper.get('tbody tr').attributes('aria-selected')).toBe('true')
  })

  it('raises a small style minWidth to the width-less column floors', () => {
    const plain = [
      { key: 'name', header: 'Name' },
      { key: 'age', header: 'Age' },
    ]
    const wrapper = mount(Table, {
      props: { data: people, columns: plain, idKey: 'id' },
      attrs: { style: { minWidth: '10px', color: 'red' } },
    })
    expect(wrapper.get('table').attributes('style')).toContain('min-width: 120px')
    const scrollStyle = wrapper.get('.astryx-table-scroll').attributes('style') ?? ''
    expect(scrollStyle).not.toContain('min-width')
    expect(scrollStyle).toContain('color: red')

    const wide = mount(Table, {
      props: { data: people, columns: plain, idKey: 'id' },
      attrs: { style: { minWidth: '900px' } },
    })
    expect(wide.get('table').attributes('style')).toContain('min-width: 900px')
  })

  it('keeps a slotted table minWidth when there are no columns to floor', () => {
    const wrapper = mount(Table, {
      attrs: { style: { minWidth: '10px' } },
      slots: { default: '<tbody><tr><td>Cell</td></tr></tbody>' },
    })
    expect(wrapper.get('table').attributes('style')).toContain('min-width: 10px')
    expect(wrapper.find('[data-scroll-content]').exists()).toBe(true)
  })

  it('contains overscroll only while the table scrolls', async () => {
    const wrapper = mount(Table, {
      props: { data: people, columns, idKey: 'id' },
      attachTo: document.body,
    })
    const viewport = wrapper.get('.astryx-table-scroll').element as HTMLElement
    const box = {
      clientWidth: 120,
      clientHeight: 40,
      scrollWidth: 120,
      scrollHeight: 40,
      scrollLeft: 0,
      scrollTop: 0,
    }
    for (const key of Object.keys(box) as (keyof typeof box)[])
      Object.defineProperty(viewport, key, { configurable: true, get: () => box[key] })

    async function remeasure(): Promise<void> {
      viewport.dispatchEvent(new Event('scroll'))
      await Promise.resolve()
      await nextTick()
    }

    await remeasure()
    await remeasure()
    expect(viewport.style.overscrollBehaviorX).toBe('auto')
    expect(viewport.hasAttribute('tabindex')).toBe(false)
    expect(viewport.getAttribute('role')).toBe('group')

    box.scrollWidth = 280
    await remeasure()
    await remeasure()
    expect(viewport.style.overscrollBehaviorX).toBe('contain')
    expect(viewport.getAttribute('tabindex')).toBe('0')
    expect(viewport.getAttribute('data-scrollable-inline')).toBe('true')

    box.scrollWidth = 120
    await remeasure()
    await remeasure()
    expect(viewport.style.overscrollBehaviorX).toBe('auto')
    expect(viewport.hasAttribute('tabindex')).toBe(false)
    wrapper.unmount()
  })

  it('keeps disabled table controls on the default cursor', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/table.css'), 'utf8')
    expect(css).not.toContain('not-allowed')
    expect(css).toContain('.astryx-table__expander:is(:disabled, [aria-disabled=\'true\'])')
    expect(css).toContain('.astryx-table thead tr:hover')
    expect(css).toContain('padding-inline-start: calc(40px + var(--astryx-spacing-3, 12px))')
  })

  it('filters rows with the self-contained filter helper', () => {
    const { filters, onFilterChange } = useTableFilterState()
    onFilterChange('name', 'ali')
    expect(applyTableFilters(people, filters.value, [{ key: 'name', label: 'Name', type: 'string' }]).map(person => person.name)).toEqual(['Alice'])
  })
})
