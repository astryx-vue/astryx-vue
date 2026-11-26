import type { TableColumn } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { sortRows } from './columnUtils.js'
import { useTableRowExpansion } from './plugins/rowExpansion.js'
import { useTableRowIndex } from './plugins/rowIndex.js'
import { useTableSelection } from './plugins/selection.js'
import { useTableSortable } from './plugins/sortable.js'
import Table from './Table.vue'
import TableBody from './TableBody.vue'
import TableCell from './TableCell.vue'
import TableHeader from './TableHeader.vue'
import TableHeaderCell from './TableHeaderCell.vue'
import TableRow from './TableRow.vue'

interface Row extends Record<string, unknown> {
  id: string
  name: string
  when?: Date | null
}

const rows: Row[] = [
  { id: 'a', name: 'Ada' },
  { id: 'b', name: 'Bo' },
  { id: 'c', name: 'Cy' },
]
const columns: TableColumn[] = [{ key: 'name', header: 'Name' }]

describe('table-row theme states', () => {
  it('gives each body row its parity and, in a striped table, its striped state', () => {
    const wrapper = mount(Table, { props: { data: rows, columns, isStriped: true } })
    const body = wrapper.findAll('tbody tr')
    expect(body.map(row => row.classes())).toEqual(rows.map(() => ['astryx-table-row']))
    expect(body.map(row => row.attributes('data-parity'))).toEqual(['odd', 'even', 'odd'])
    expect(body.every(row => row.attributes('data-striped') === 'striped')).toBe(true)
    expect(wrapper.get('thead tr').attributes('data-striped')).toBeUndefined()
    expect(wrapper.get('thead tr').attributes('data-parity')).toBeUndefined()
  })

  it('leaves out striped in a plain table', () => {
    const wrapper = mount(Table, { props: { data: rows, columns } })
    expect(wrapper.get('tbody tr').attributes('data-striped')).toBeUndefined()
  })

  it('marks a row that selection selects with the selected state', () => {
    const selected = ref(new Set(['b']))
    const wrapper = mount({
      components: { Table },
      setup() {
        const plugin = useTableSelection<Row>(() => ({
          getIsItemSelected: row => selected.value.has(row.id),
          onSelectItem: () => {},
          onSelectAll: () => {},
          getIsAllSelected: () => false,
        }))
        return { rows, columns, plugin }
      },
      template: '<Table :data="rows" :columns="columns" :plugins="{ selection: plugin }" />',
    })
    expect(wrapper.findAll('tbody tr').map(row => row.attributes('data-selected'))).toEqual([undefined, 'selected', undefined])
  })

  it('gives a children-mode body row striped but no parity', () => {
    const wrapper = mount({
      components: { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow },
      template: `
        <Table is-striped>
          <TableHeader><TableRow is-header-row><TableHeaderCell>Name</TableHeaderCell></TableRow></TableHeader>
          <TableBody><TableRow><TableCell>Ada</TableCell></TableRow></TableBody>
        </Table>`,
    })
    const [header, body] = wrapper.findAll('tr')
    expect(header?.attributes('data-striped')).toBeUndefined()
    expect(body?.classes()).toContain('astryx-table-row')
    expect(body?.attributes('data-striped')).toBe('striped')
    expect(body?.attributes('data-parity')).toBeUndefined()
  })
})

describe('invalid Date cells', () => {
  it('render as an empty cell instead of throwing', () => {
    const data: Row[] = [{ id: 'a', name: 'Ada', when: new Date('not a date') }]
    const wrapper = mount(Table, { props: { data, columns: [{ key: 'when', header: 'When' }] } })
    expect(wrapper.get('tbody td').text()).toBe('')
  })

  it('sort with the missing values, by time for real dates', () => {
    const data: Row[] = [
      { id: 'late', name: 'Late', when: new Date('2026-03-01T00:00:00Z') },
      { id: 'bad', name: 'Bad', when: new Date('nope') },
      { id: 'early', name: 'Early', when: new Date('2025-12-01T00:00:00Z') },
      { id: 'none', name: 'None', when: null },
    ]
    const ascending = sortRows(data, [{ sortKey: 'when', direction: 'ascending' }])
    expect(ascending.map(row => row.id).slice(0, 2)).toEqual(['early', 'late'])
    const descending = sortRows(data, [{ sortKey: 'when', direction: 'descending' }])
    expect(descending.map(row => row.id).slice(2)).toEqual(['late', 'early'])
  })
})

describe('useTableRowIndex without data', () => {
  it('numbers rows from the positions the table renders them at', () => {
    const wrapper = mount({
      components: { Table },
      setup() {
        const plugin = useTableRowIndex<Row>({ startFrom: 11 })
        return { rows, columns, plugin }
      },
      template: '<Table :data="rows" :columns="columns" :plugins="{ rowIndex: plugin }" />',
    })
    expect(wrapper.findAll('.astryx-table__row-index').map(cell => cell.text())).toEqual(['11', '12', '13'])
  })
})

describe('row expansion labels', () => {
  it('names the toggle after its row when getRowLabel is given', async () => {
    const expanded = ref(new Set<string>())
    const wrapper = mount({
      components: { Table },
      setup() {
        const plugin = useTableRowExpansion<Row>(() => ({
          expandedKeys: expanded.value,
          onToggle: key => (expanded.value = new Set(expanded.value.has(key) ? [] : [key])),
          getRowKey: row => row.id,
          getRowLabel: row => (row.id === 'b' ? '  ' : row.name),
          renderExpanded: row => h('p', row.name),
        }))
        return { rows, columns, plugin }
      },
      template: '<Table :data="rows" :columns="columns" :plugins="{ expansion: plugin }" />',
    })
    const toggles = wrapper.findAll('.astryx-table__expander--column')
    expect(toggles.map(toggle => toggle.attributes('aria-label'))).toEqual(['Expand Ada', 'Expand row', 'Expand Cy'])
    await toggles[0]!.trigger('click')
    expect(wrapper.get('.astryx-table__expander--column').attributes('aria-label')).toBe('Collapse Ada')
  })
})

describe('scroll region', () => {
  it('keeps the box inside the scroll region from scrolling on its own', () => {
    const wrapper = mount(Table, { props: { data: rows, columns } })
    expect((wrapper.get('[data-scroll-content]').element as HTMLElement).style.overflow).toBe('visible')
  })

  it('wraps a header label so it gives up width before the sort and filter controls', () => {
    const wrapper = mount(Table, { props: { data: rows, columns } })
    expect(wrapper.get('thead th .astryx-table__header-label').text()).toBe('Name')
  })
})

describe('sortable header', () => {
  const sortColumns: TableColumn[] = [
    { key: 'id', header: 'Id', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
  ]
  function mountSorted(sort: { sortKey: string, direction: 'ascending' | 'descending' }[]) {
    return mount(defineComponent({
      setup() {
        const sortable = useTableSortable({ sort, onSortChange: () => {} })
        return () => h(Table, { data: rows, columns: sortColumns, plugins: { sortable } })
      },
    }))
  }

  it('renders each column title once, inside its sort button, with a single sort', () => {
    const headers = mountSorted([{ sortKey: 'name', direction: 'ascending' }]).findAll('th')
    expect(headers.map(th => th.findAll('.astryx-table__header-label').length)).toEqual([1, 1])
    expect(headers.every(th => th.find('.astryx-table__sort .astryx-table__header-label').exists())).toBe(true)
  })

  it('renders each column title once when the buttons carry a priority description', () => {
    const wrapper = mountSorted([{ sortKey: 'name', direction: 'ascending' }, { sortKey: 'id', direction: 'descending' }])
    expect(wrapper.findAll('th').map(th => th.findAll('.astryx-table__header-label').length)).toEqual([1, 1])
    expect(wrapper.get('th[data-column="name"] .astryx-table__sort').attributes('aria-describedby')).toBeTruthy()
  })
})
