import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { paginateData, pixel, proportional, resolveColumnWidths } from './columnUtils.js'
import { applyTableFilters, useTableFilterState } from './plugins/filtering.js'
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

  it('filters rows with the self-contained filter helper', () => {
    const { filters, onFilterChange } = useTableFilterState()
    onFilterChange('name', 'ali')
    expect(applyTableFilters(people, filters.value, [{ key: 'name', label: 'Name', type: 'string' }]).map(person => person.name)).toEqual(['Alice'])
  })
})
