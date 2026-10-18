import type { TableColumn } from '../types.js'
import type { ColumnResizeSnapshot } from './columnResize.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { pixel, proportional } from '../columnUtils.js'
import Table from '../Table.vue'
import {
  columnResizeDirectionSign,
  columnResizeMinWidth,
  columnResizeStep,
  isProportionalColumnWidth,
  resizeColumnWidths,
  useTableColumnResize,
} from './columnResize.js'
import { useTableColumnSettings, useTableColumnSettingsState } from './columnSettings.js'
import { applyTableFilters, useTableFiltering, useTableFilterState } from './filtering.js'
import { useTablePagination } from './pagination.js'
import { useTableSelection, useTableSelectionState } from './selection.js'

interface Person extends Record<string, unknown> {
  id: string
  name: string
  role: string
  age: number
  hired: string
  tags: string[]
}

const selectionColumns: TableColumn<Person>[] = [{ key: 'name', header: 'Name', width: proportional(1) }]

const people: Person[] = [
  { id: '1', name: 'Alice', role: 'Engineer', age: 32, hired: '2020-01-01', tags: ['core', 'ui'] },
  { id: '2', name: 'Bob', role: 'Designer', age: 28, hired: '2023-06-01', tags: ['ui'] },
  { id: '3', name: 'Charlie', role: 'Engineer', age: 45, hired: '2015-03-01', tags: ['core'] },
]

function snapshot(key: string, initialWidth: number, minWidth: number, maxWidth = Number.POSITIVE_INFINITY): ColumnResizeSnapshot {
  return { key, initialWidth, minWidth, maxWidth }
}

describe('column resize helpers', () => {
  it('derives a minimum width per column kind', () => {
    expect(columnResizeMinWidth(undefined, 90)).toBe(90)
    expect(columnResizeMinWidth(proportional(1), 90)).toBe(90)
    expect(columnResizeMinWidth(undefined)).toBe(60)
    expect(columnResizeMinWidth(proportional(1))).toBe(120)
    expect(columnResizeMinWidth(proportional(1, { minWidth: 200 }))).toBe(200)
    expect(columnResizeMinWidth(pixel(80))).toBe(80)
  })

  it('treats a column without a width as proportional', () => {
    expect(isProportionalColumnWidth(undefined)).toBe(true)
    expect(isProportionalColumnWidth(proportional(2))).toBe(true)
    expect(isProportionalColumnWidth(pixel(120))).toBe(false)
  })

  it('moves width into the neighbour and keeps the table full width', () => {
    const widths = resizeColumnWidths({
      snapshots: [snapshot('a', 200, 100), snapshot('b', 200, 100), snapshot('c', 200, 100)],
      resizeIndex: 0,
      neighborIndex: 1,
      tableWidth: 600,
    }, 40)
    expect(widths).toEqual([240, 160, 200])

    const negatives = resizeColumnWidths({
      snapshots: [snapshot('a', 200, 100), snapshot('b', 200, 100), snapshot('c', 200, 100)],
      resizeIndex: 0,
      neighborIndex: 1,
      tableWidth: 600,
    }, -40)
    expect(negatives).toEqual([160, 240, 200])
  })

  it('never drags past a column minimum', () => {
    const widths = resizeColumnWidths({
      snapshots: [snapshot('a', 200, 100), snapshot('b', 150, 140), snapshot('c', 250, 100)],
      resizeIndex: 0,
      neighborIndex: 1,
      tableWidth: 600,
    }, 200)
    expect(widths[0]).toBe(210)
    expect(widths[1]).toBe(140)
  })

  it('clamps a lone column to its own minimum and maximum', () => {
    const plan = {
      snapshots: [snapshot('a', 300, 100, 320), snapshot('b', 300, 100)],
      resizeIndex: 0,
      neighborIndex: null,
      tableWidth: 600,
    }
    expect(resizeColumnWidths(plan, 100)[0]).toBe(320)
    expect(resizeColumnWidths(plan, -400)[0]).toBe(100)
  })

  it('reads steps and direction the way the keyboard needs', () => {
    expect(columnResizeStep(false)).toBe(10)
    expect(columnResizeStep(true)).toBe(50)
    expect(columnResizeDirectionSign('ltr')).toBe(1)
    expect(columnResizeDirectionSign('rtl')).toBe(-1)
  })
})

const resizeColumns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'role', header: 'Role', width: proportional(1) },
  { key: 'age', header: 'Age', width: proportional(1) },
]

function mountResizable(options: { minWidth?: number, maxWidth?: number, widths?: Record<string, number> } = {}) {
  const onEnd = vi.fn()
  const wrapper = mount({
    components: { Table },
    setup() {
      const plugin = useTableColumnResize<Person>(() => ({
        columnWidths: options.widths ?? {},
        minWidth: options.minWidth,
        maxWidth: options.maxWidth,
        onColumnResizeEnd: onEnd,
      }))
      return { people, resizeColumns, plugin }
    },
    template: '<Table :data="people" :columns="resizeColumns" id-key="id" :plugins="{ resize: plugin }" />',
  })
  const cells = wrapper.findAll('thead th')
  for (const [index, cell] of cells.entries()) {
    const width = [200, 200, 200][index] ?? 200
    cell.element.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 32,
      width,
      height: 32,
      toJSON: () => ({}),
    }) as DOMRect
  }
  return { wrapper, onEnd }
}

describe('useTableColumnResize', () => {
  it('skips the handle on the last proportional column and points at the neighbour', () => {
    const plugin = useTableColumnResize<Person>(() => ({
      columnWidths: {},
      onColumnResizeEnd: () => {},
    }))
    const first = plugin.resizeFor?.(resizeColumns[0]!, resizeColumns) ?? null
    expect(first).toMatchObject({ neighborKey: 'role', hasHandle: true })
    const last = plugin.resizeFor?.(resizeColumns[2]!, resizeColumns) ?? null
    expect(last).toMatchObject({ neighborKey: null, hasHandle: false })
  })

  it('drops columns marked as not resizable', () => {
    const plugin = useTableColumnResize<Person>(() => ({ columnWidths: {}, onColumnResizeEnd: () => {} }))
    const column = { key: 'name', header: 'Name', resizable: false } as TableColumn<Person>
    expect(plugin.resizeFor?.(column, [{ ...column }, ...resizeColumns])).toBeNull()
  })

  it('draws an accessible splitter per resizable column', () => {
    const { wrapper } = mountResizable()
    const handles = wrapper.findAll('.astryx-table__resize')
    expect(handles).toHaveLength(2)
    const first = handles[0]!
    expect(first.attributes('role')).toBe('separator')
    expect(first.attributes('aria-orientation')).toBe('vertical')
    expect(first.attributes('aria-label')).toBe('Resize column Name')
    expect(first.attributes('aria-valuemin')).toBe('120')
    expect(first.attributes('aria-valuemax')).toBeUndefined()
    expect(first.attributes('tabindex')).toBe('0')
  })

  it('reports every column whose width changed on a key press', async () => {
    const { wrapper, onEnd } = mountResizable()
    await wrapper.get('.astryx-table__resize').trigger('keydown', { key: 'ArrowRight' })
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(onEnd.mock.calls[0]?.[0]).toEqual({ name: 210, role: 190 })
  })

  it('uses the bigger step with shift and honours the global minimum', async () => {
    const { wrapper, onEnd } = mountResizable({ minWidth: 190 })
    await wrapper.get('.astryx-table__resize').trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    // 邻列最多让到自己的下限 190，位移 50 只走 10。
    expect(onEnd.mock.calls[0]?.[0]).toEqual({ name: 210, role: 190 })
  })

  it('jumps to the maximum with End', async () => {
    const { wrapper, onEnd } = mountResizable({ maxWidth: 260 })
    await wrapper.get('.astryx-table__resize').trigger('keydown', { key: 'End' })
    expect(onEnd.mock.calls[0]?.[0]?.name).toBe(260)
  })

  it('commits the dragged width on pointer release', async () => {
    const { wrapper, onEnd } = mountResizable()
    const handle = wrapper.get('.astryx-table__resize')
    await handle.trigger('pointerdown', { pointerId: 1, button: 0, clientX: 100 })
    await handle.trigger('pointermove', { pointerId: 1, clientX: 140 })
    await handle.trigger('pointerup', { pointerId: 1, clientX: 140 })
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(onEnd.mock.calls[0]?.[0]).toEqual({ name: 240, role: 160 })
  })

  it('keeps the declared override width in the header cell', () => {
    const { wrapper } = mountResizable({ widths: { name: 260 } })
    expect(wrapper.get('thead th').attributes('style')).toContain('width: 260px')
  })
})

describe('useTableColumnSettings', () => {
  const options = [
    { key: 'name', label: 'Name', isAlwaysVisible: true },
    { key: 'role', label: 'Role', group: 'Job' },
    { key: 'age', label: 'Age', group: 'Job' },
  ]

  it('hides and reorders columns from the active keys', () => {
    const plugin = useTableColumnSettings<Person>(() => ({
      columns: options,
      activeColumnKeys: ['age', 'name'],
    }))
    expect(plugin.transformColumns?.(resizeColumns)?.map(column => column.key)).toEqual(['age', 'name'])
  })

  it('resets to the default keys and falls back to every column', () => {
    const onChange = vi.fn()
    const keys = ref<string[]>(['name', 'role'])
    const withDefault = useTableColumnSettingsState({
      columns: options,
      activeColumnKeys: keys,
      onChangeActiveColumnKeys: onChange,
      defaultColumnKeys: ['name'],
    })
    withDefault.resetToDefault()
    expect(onChange).toHaveBeenLastCalledWith(['name'])

    const withoutDefault = useTableColumnSettingsState({
      columns: options,
      activeColumnKeys: keys,
      onChangeActiveColumnKeys: onChange,
    })
    withoutDefault.resetToDefault()
    expect(onChange).toHaveBeenLastCalledWith(['name', 'role', 'age'])
  })

  it('toggles columns but never the ones that are always visible', () => {
    const onChange = vi.fn()
    const state = useTableColumnSettingsState({
      columns: options,
      activeColumnKeys: ref(['name', 'role']),
      onChangeActiveColumnKeys: onChange,
    })
    state.toggleColumn('name')
    expect(onChange).not.toHaveBeenCalled()
    state.toggleColumn('role')
    expect(onChange).toHaveBeenLastCalledWith(['name'])
    state.toggleColumn('age')
    expect(onChange).toHaveBeenLastCalledWith(['name', 'role', 'age'])
    expect(state.isColumnActive('name')).toBe(true)
    expect(state.isColumnToggleable('name')).toBe(false)
    state.showAllColumns()
    expect(onChange).toHaveBeenLastCalledWith(['name', 'role', 'age'])
  })

  it('puts always visible keys back when the caller picks a set', () => {
    const onChange = vi.fn()
    const state = useTableColumnSettingsState({
      columns: options,
      activeColumnKeys: ref(['name']),
      onChangeActiveColumnKeys: onChange,
    })
    state.setActiveColumnKeys(['role'])
    expect(onChange).toHaveBeenLastCalledWith(['role', 'name'])
  })
})

describe('useTableFilterState', () => {
  it('takes the initial map directly or as initialState', () => {
    const direct = useTableFilterState({ role: 'Engineer' })
    expect(direct.filters.value).toEqual({ role: 'Engineer' })
    const wrapped = useTableFilterState({ initialState: { role: 'Designer' } })
    expect(wrapped.filters.value).toEqual({ role: 'Designer' })
    expect(useTableFilterState().filters.value).toEqual({})
  })

  it('drops a filter instead of storing an empty value', () => {
    const { filters, onFilterChange } = useTableFilterState({ role: 'Engineer' })
    onFilterChange('role', null)
    expect(filters.value).toEqual({})
    onFilterChange('age', 0)
    expect(filters.value).toEqual({ age: 0 })
    onFilterChange('tags', ['core'])
    expect(filters.value).toEqual({ age: 0, tags: ['core'] })
  })
})

describe('applyTableFilters', () => {
  const fields = [
    { key: 'name', label: 'Name', type: 'string' as const },
    { key: 'role', label: 'Role', type: 'enum' as const },
    { key: 'tags', label: 'Tags', type: 'multi-select' as const },
    { key: 'age', label: 'Age', type: 'number' as const },
    { key: 'hired', label: 'Hired', type: 'date' as const },
  ]

  it('matches substrings, options, numbers and dates', () => {
    expect(applyTableFilters(people, { name: 'ali' }, fields).map(person => person.name)).toEqual(['Alice'])
    expect(applyTableFilters(people, { role: 'Engineer' }, fields).map(person => person.name)).toEqual(['Alice', 'Charlie'])
    expect(applyTableFilters(people, { age: 28 }, fields).map(person => person.name)).toEqual(['Bob'])
    // 日期过滤只留晚于选中日期的行。
    expect(applyTableFilters(people, { hired: '2019-01-01' }, fields).map(person => person.name)).toEqual(['Alice', 'Bob'])
  })

  it('keeps rows that hit any of the multi-select options', () => {
    expect(applyTableFilters(people, { tags: ['ui'] }, fields).map(person => person.name)).toEqual(['Alice', 'Bob'])
    expect(applyTableFilters(people, { tags: ['core', 'ui'] }, fields)).toHaveLength(3)
  })

  it('returns every row when nothing is filtered', () => {
    expect(applyTableFilters(people, {}, fields)).toHaveLength(3)
    expect(applyTableFilters(people, { name: '' }, fields)).toHaveLength(3)
  })
})

describe('useTableFiltering', () => {
  const filterColumns: TableColumn<Person>[] = [
    { key: 'name', header: 'Name', filter: 'name' },
    { key: 'age', header: 'Age', filter: 'age' },
    { key: 'role', header: 'Role' },
  ]
  const fields = [
    { key: 'name', label: 'Name', type: 'string' as const },
    { key: 'age', label: 'Age', type: 'number' as const },
  ]

  it('gives inline filter columns a proportional width and leaves popover alone', () => {
    const inline = useTableFiltering<Person>(() => ({ filters: {}, onFilterChange: () => {}, fields, variant: 'inline' }))
    expect(inline.transformColumns?.(filterColumns)[0]?.width).toEqual(proportional(1))
    const popover = useTableFiltering<Person>(() => ({ filters: {}, onFilterChange: () => {}, fields }))
    expect(popover.transformColumns?.(filterColumns)[0]?.width).toBeUndefined()
  })

  it('builds a contribution for a column that names a field', () => {
    const plugin = useTableFiltering<Person>(() => ({
      filters: { name: 'ali' },
      onFilterChange: () => {},
      fields,
      variant: 'inline-compact',
    }))
    expect(plugin.filterFor?.(filterColumns[0]!)).toMatchObject({ variant: 'inline-compact', value: 'ali' })
    expect(plugin.filterFor?.(filterColumns[2]!)).toBeNull()
  })

  it('renders compact inline controls for number and multi-select fields', () => {
    const wrapper = mount({
      components: { Table },
      setup() {
        const { filters, onFilterChange } = useTableFilterState()
        const plugin = useTableFiltering<Person>(() => ({
          filters: filters.value,
          onFilterChange,
          fields: [
            { key: 'age', label: 'Age', type: 'number' as const },
            { key: 'role', label: 'Role', type: 'multi-select' as const, options: [{ value: 'Engineer', label: 'Engineer' }] },
          ],
          variant: 'inline-compact',
        }))
        return { people, plugin, columns: [{ key: 'age', header: 'Age', filter: 'age' }, { key: 'role', header: 'Role', filter: 'role' }] }
      },
      template: '<Table :data="people" :columns="columns" id-key="id" :plugins="{ filter: plugin }" />',
    })
    const controls = wrapper.findAll('.astryx-table__filter')
    expect(controls).toHaveLength(2)
    expect(controls[0]!.attributes('data-variant')).toBe('inline-compact')
    expect(wrapper.find('input[inputmode="decimal"]').exists()).toBe(true)
  })
})

describe('useTablePagination', () => {
  const paginationColumns: TableColumn<Person>[] = [{ key: 'name', header: 'Name', width: proportional(1) }]

  function mountPagination(config: Record<string, unknown>) {
    return mount({
      components: { Table },
      setup() {
        const page = ref(1)
        const plugin = useTablePagination<Person>(() => ({
          page: page.value,
          onPageChange: (next: number) => {
            page.value = next
          },
          ...config,
        }))
        return { people, paginationColumns, plugin }
      },
      template: '<Table :data="people" :columns="paginationColumns" id-key="id" :plugins="{ pagination: plugin }" />',
    })
  }

  it('counts pages from totalItems and hides itself on a single page', async () => {
    const many = mountPagination({ totalItems: 20, pageSize: 5 })
    expect(many.findAll('.astryx-table__pagination')).toHaveLength(1)
    const single = mountPagination({ totalItems: 3, pageSize: 10 })
    await nextTick()
    expect(single.findAll('.astryx-table__pagination')).toHaveLength(0)
    const cursor = mountPagination({ totalItems: 3, pageSize: 10, hasMore: false })
    expect(cursor.findAll('.astryx-table__pagination')).toHaveLength(0)
    const cursorMore = mountPagination({ totalItems: 3, pageSize: 10, hasMore: true })
    expect(cursorMore.findAll('.astryx-table__pagination')).toHaveLength(1)
  })

  it('uses totalPages when the item count is unknown', () => {
    const wrapper = mountPagination({ totalPages: 4, pageSize: 5 })
    expect(wrapper.findAll('.astryx-table__pagination')).toHaveLength(1)
  })

  it('renders above, below or both, with distinct names for both', () => {
    const below = mountPagination({ totalPages: 4, pageSize: 5 })
    expect(below.findAll('.astryx-table__pagination')[0]!.attributes('data-place')).toBe('below')

    const above = mountPagination({ totalPages: 4, pageSize: 5, position: 'above' })
    expect(above.findAll('.astryx-table__pagination')[0]!.attributes('data-place')).toBe('above')

    const both = mountPagination({ totalPages: 4, pageSize: 5, position: 'both' })
    const places = both.findAll('.astryx-table__pagination').map(node => node.attributes('data-place'))
    expect(places).toEqual(['above', 'below'])
    const labels = both.findAll('nav').map(node => node.attributes('aria-label'))
    expect(labels).toEqual(['Table pagination (top)', 'Table pagination (bottom)'])

    const none = mountPagination({ totalPages: 4, pageSize: 5, position: 'none' })
    expect(none.findAll('.astryx-table__pagination')).toHaveLength(0)
  })

  it('passes the variant through to the controls', () => {
    const wrapper = mountPagination({ totalPages: 4, pageSize: 5, variant: 'compact' })
    expect(wrapper.get('.astryx-table__pagination').text()).toContain('Page 1 of 4')
  })
})

describe('useTableSelectionState', () => {
  function harness(config: Record<string, unknown>, selected = ref(new Set<string>())) {
    const onChange = vi.fn((keys: Set<string>) => {
      selected.value = keys
    })
    const state = useTableSelectionState<Person>({
      data: people,
      idKey: 'id',
      selectedKeys: selected,
      setSelectedKeys: onChange,
      ...config,
    })
    return { state, selected, onChange }
  }

  it('takes a key function and names rows from it', () => {
    const { state } = harness({ idKey: (item: Person) => `key-${item.id}`, getRowLabel: (item: Person) => item.name })
    expect(state.selectionConfig.getIsItemSelected(people[0]!)).toBe(false)
    state.selectionConfig.onSelectItem({ item: people[0]!, isSelected: true })
    expect(state.selectionState.selectedKeys.has('key-1')).toBe(true)
    expect(state.selectionConfig.getRowLabel?.(people[0]!)).toBe('Alice')
  })

  it('selects every selectable row and keeps disabled rows as they were', () => {
    const selected = ref(new Set<string>(['2']))
    const { state, onChange } = harness({
      getIsItemEnabled: (item: Person) => item.id !== '2',
      getIsItemSelectable: (item: Person) => item.id !== '3',
    }, selected)
    state.selectionConfig.onSelectAll({ isAllSelected: true })
    expect([...onChange.mock.calls.at(-1)![0]].sort()).toEqual(['1', '2'])

    selected.value = new Set(['1', '2'])
    state.selectionConfig.onSelectAll({ isAllSelected: false })
    expect([...onChange.mock.calls.at(-1)![0]]).toEqual(['2'])
  })

  it('counts indeterminate from the selectable rows only', () => {
    const selected = ref(new Set<string>())
    const { state } = harness({ getIsItemSelectable: (item: Person) => item.id !== '3' }, selected)
    state.selectionConfig.onSelectItem({ item: people[0]!, isSelected: true })
    expect(state.selectionConfig.getIsIndeterminate?.()).toBe(true)
    expect(state.selectionConfig.getIsAllSelected()).toBe(false)
    state.selectionConfig.onSelectItem({ item: people[1]!, isSelected: true })
    expect(state.selectionConfig.getIsAllSelected()).toBe(true)
    expect(state.selectionConfig.getIsIndeterminate?.()).toBe(false)
  })

  it('hands the setter a ready-made set', () => {
    const setter = vi.fn()
    const state = useTableSelectionState<Person>({
      data: people,
      idKey: 'id',
      selectedKeys: ref(new Set<string>()),
      setSelectedKeys: setter,
    })
    state.selectionState.clearSelection()
    expect(setter.mock.calls[0]?.[0]).toBeInstanceOf(Set)
  })

  it('disables a row checkbox but keeps it in place', () => {
    const wrapper = mount({
      components: { Table },
      setup() {
        const selected = ref(new Set<string>())
        const { selectionConfig } = useTableSelectionState<Person>({
          data: people,
          idKey: 'id',
          selectedKeys: selected,
          setSelectedKeys: (keys) => {
            selected.value = keys
          },
          getIsItemEnabled: (item: Person) => item.id !== '2',
          getIsItemSelectable: (item: Person) => item.id !== '3',
          hasRowHighlight: false,
        })
        return { people, columns: selectionColumns, selection: useTableSelection(selectionConfig) }
      },
      template: '<Table :data="people" :columns="columns" :plugins="{ selection }" id-key="id" />',
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0]!.find('input[type="checkbox"]').attributes('disabled')).toBeUndefined()
    expect(rows[1]!.find('input[type="checkbox"]').attributes('disabled')).toBeDefined()
    expect(rows[2]!.find('input[type="checkbox"]').exists()).toBe(false)
    expect(wrapper.get('table').attributes('data-row-highlight')).toBe('off')
  })
})

describe('useTableSelection highlighting', () => {
  it('keeps aria-selected when the wash is turned off', async () => {
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
          hasRowHighlight: false,
        })
        return { people, columns: selectionColumns, selection: useTableSelection(selectionConfig) }
      },
      template: '<Table :data="people" :columns="columns" :plugins="{ selection }" id-key="id" />',
    })
    const first = wrapper.findAll('tbody tr')[0]!
    await first.get('input[type="checkbox"]').setValue(true)
    await nextTick()
    expect(wrapper.findAll('tbody tr')[0]!.attributes('aria-selected')).toBe('true')
    expect(wrapper.get('table').attributes('data-row-highlight')).toBe('off')
  })
})
