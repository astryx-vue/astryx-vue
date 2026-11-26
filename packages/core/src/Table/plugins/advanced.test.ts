import type { TableColumn } from '../types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { pixel } from '../columnUtils.js'
import Table from '../Table.vue'
import { buildGroupedRows, isTableGroupHeader, useTableGroupedRows } from './groupedRows.js'
import { useTableRowExpansion } from './rowExpansion.js'
import { useTableRowIndex } from './rowIndex.js'
import { useTableRowStatus } from './rowStatus.js'
import { stickyOffsets, useTableStickyColumns } from './stickyColumns.js'
import { flattenTree, useTableTreeData, useTableTreeState } from './tree.js'

interface Person extends Record<string, unknown> {
  id: string
  name: string
  role: string
}

const people: Person[] = [
  { id: '1', name: 'Alice', role: 'Engineer' },
  { id: '2', name: 'Bob', role: 'Designer' },
  { id: '3', name: 'Diana', role: 'Engineer' },
]

const nameColumn: TableColumn<Person> = { key: 'name', header: 'Name', width: pixel(160) }

describe('grouped rows', () => {
  it('keeps headers when a group is collapsed and numbers only real rows', () => {
    const collapsed = new Set(['Engineer'])
    const rows = buildGroupedRows(people, person => person.role, collapsed, ['Designer', 'Engineer'])
    expect(rows.map(row => isTableGroupHeader(row) ? row.groupKey : row.name)).toEqual([
      'Designer',
      'Bob',
      'Engineer',
    ])
    expect(String(rows[0]?.id)).toBe('__group_Designer')
    expect(rows[0]?.missing).toBe('')
  })

  it('toggles from the chevron and leaves the disclosure on the button', async () => {
    const collapsed = ref(new Set<string>())
    const wrapper = mount({
      components: { Table },
      setup() {
        const grouped = useTableGroupedRows<Person>(() => ({
          data: people,
          groupBy: person => person.role,
          collapsedGroups: collapsed.value,
          onToggleGroup(key) {
            const next = new Set(collapsed.value)
            if (next.has(key))
              next.delete(key)
            else
              next.add(key)
            collapsed.value = next
          },
          getRowKey: person => person.id,
        }))
        const numbers = useTableRowIndex<Person>(() => ({
          data: grouped.data.value,
          getRowKey: person => person.id,
        }))
        return { rows: grouped.data, plugin: grouped.plugin, numbers, idKey: grouped.idKey, columns: [nameColumn] }
      },
      template: '<Table :data="rows" :columns="columns" :id-key="idKey" :plugins="{ grouped: plugin, numbers }" />',
    })
    expect(wrapper.findAll('[data-group-header]')).toHaveLength(2)
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-group-header]').attributes('aria-expanded')).toBeUndefined()
    expect(wrapper.findAll('.astryx-table__row-index').map(node => node.text())).toEqual(['1', '2', '3'])
    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).not.toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.findAll('.astryx-table__row-index').map(node => node.text())).toEqual(['1'])
  })
})

describe('tree rows', () => {
  it('skips a cycle and hides children until the parent is expanded', () => {
    const nodes = [{
      id: 'root',
      name: 'Root',
      children: [{ id: 'root', name: 'Loop' }, { id: 'child', name: 'Child' }],
    }]
    const closed = flattenTree({ data: nodes, idKey: 'id' }, new Set())
    expect(closed.rows.map(row => row.name)).toEqual(['Root'])
    const open = flattenTree({ data: nodes, idKey: 'id' }, new Set(['root']))
    expect(open.rows.map(row => row.name)).toEqual(['Root', 'Child'])
    expect(open.meta.get('child')?.level).toBe(1)
  })

  it('reads data and expandedIds even when they arrive as refs inside the config', () => {
    const data = ref([{ id: 'root', name: 'Root', children: [{ id: 'child', name: 'Child' }] }])
    const expandedIds = ref<ReadonlySet<string>>(new Set(['root']))
    const tree = useTableTreeState({ data, expandedIds, idKey: 'id' })
    expect(tree.visibleData.value.map(row => row.name)).toEqual(['Root', 'Child'])
    expect(tree.isAllExpanded.value).toBe(true)

    // 数据换了，同一份 config 也要跟着走。
    data.value = [{ id: 'other', name: 'Other', children: [{ id: 'kid', name: 'Kid' }] }]
    expect(tree.visibleData.value.map(row => row.name)).toEqual(['Other'])
  })

  it('follows the disclosure pattern: rows carry no tree ARIA, the expander controls its child rows', async () => {
    const nodes = [{
      id: 'root',
      name: 'Root',
      children: [{ id: 'child', name: 'Child' }, { id: 'child two', name: 'Second' }],
    }]
    const wrapper = mount({
      components: { Table },
      setup() {
        const tree = useTableTreeState({
          data: nodes,
          idKey: 'id',
          hasExpandAllControl: true,
        })
        return { rows: tree.visibleData, plugin: tree.plugin, columns: [{ key: 'name', header: 'Name', width: pixel(180) }] }
      },
      template: '<Table :data="rows" :columns="columns" id-key="id" :plugins="{ tree: plugin }" />',
    })
    const root = wrapper.get('tbody tr')
    expect(root.attributes('aria-level')).toBeUndefined()
    expect(root.attributes('aria-expanded')).toBeUndefined()
    const expander = root.get('button')
    expect(expander.attributes('aria-expanded')).toBe('false')
    expect(expander.attributes('aria-controls')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Child')
    await wrapper.get('thead button').trigger('click')
    expect(wrapper.text()).toContain('Child')
    const rows = wrapper.findAll('tbody tr')
    expect(rows[1]?.attributes('aria-level')).toBeUndefined()
    const childIds = rows.slice(1).map(row => row.attributes('id'))
    expect(childIds.every(id => id != null && id !== '')).toBe(true)
    expect(new Set(childIds).size).toBe(2)
    expect(root.get('button').attributes('aria-expanded')).toBe('true')
    expect(root.get('button').attributes('aria-controls')).toBe(childIds.join(' '))
  })

  it('names the tree expander after its row when getRowLabel is given', async () => {
    const nodes = [{ id: 'root', name: 'Root', children: [{ id: 'child', name: 'Child' }] }]
    const wrapper = mount({
      components: { Table },
      setup() {
        const expanded = ref<ReadonlySet<string>>(new Set())
        const plugin = useTableTreeData<Record<string, unknown>>(() => ({
          getRowMeta: item => item.id === 'root'
            ? { id: 'root', level: 0, hasChildren: true, isExpanded: expanded.value.has('root') }
            : undefined,
          onToggleItem: () => {
            expanded.value = new Set(expanded.value.has('root') ? [] : ['root'])
          },
          getRowLabel: item => String(item.name),
          hasExpandableRows: true,
        }))
        return { rows: nodes, plugin, columns: [{ key: 'name', header: 'Name' }] }
      },
      template: '<Table :data="rows" :columns="columns" id-key="id" :plugins="{ tree: plugin }" />',
    })
    expect(wrapper.get('tbody tr button').attributes('aria-label')).toBe('Expand Root')
    await wrapper.get('tbody tr button').trigger('click')
    expect(wrapper.get('tbody tr button').attributes('aria-label')).toBe('Collapse Root')
  })
})

describe('row expansion, status, sticky columns, and windowed indexes', () => {
  it('opens a detail panel and a status mark without painting a checkbox on the panel', async () => {
    const expanded = ref(new Set<string>())
    const wrapper = mount({
      components: { Table },
      setup() {
        const expansion = useTableRowExpansion<Person>(() => ({
          expandedKeys: expanded.value,
          onToggle(key) {
            const next = new Set(expanded.value)
            if (next.has(key))
              next.delete(key)
            else
              next.add(key)
            expanded.value = next
          },
          getRowKey: person => person.id,
          renderExpanded: person => h('p', `Detail ${person.name}`),
          getIsItemExpandable: person => person.id !== '2',
        }))
        const status = useTableRowStatus<Person>({
          getStatus: person => person.id === '1' ? { status: 'success', label: 'Saved' } : null,
        })
        return { people, columns: [nameColumn], expansion, status }
      },
      template: '<Table :data="people" :columns="columns" id-key="id" :row-count="40" :row-index-start="11" :plugins="{ expansion, status }" />',
    })
    expect(wrapper.get('table').attributes('aria-rowcount')).toBe('40')
    expect(wrapper.get('tbody tr').attributes('aria-rowindex')).toBe('11')
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Saved')
    expect(wrapper.find('[data-expansion-panel]').exists()).toBe(false)
    await wrapper.get('tbody button').trigger('click')
    expect(wrapper.get('[data-expansion-panel]').text()).toContain('Detail Alice')
    expect(wrapper.findAll('[data-expansion-panel]')).toHaveLength(1)
    await wrapper.get('tbody tr').trigger('contextmenu')
    await nextTick()
    expect(document.body.textContent).toContain('Collapse row')
    expect(wrapper.get('tbody button').classes()).not.toContain('is-expanded')
    expect(wrapper.get('.astryx-table__chevron-icon').classes()).toContain('is-expanded')
  })

  it('expands from the row but leaves editable text and the chevron alone', async () => {
    const expanded = ref(new Set<string>())
    const wrapper = mount({
      components: { Table },
      setup() {
        const expansion = useTableRowExpansion<Person>(() => ({
          expandedKeys: expanded.value,
          onToggle(key) {
            const next = new Set(expanded.value)
            if (next.has(key))
              next.delete(key)
            else
              next.add(key)
            expanded.value = next
          },
          getRowKey: person => person.id,
          renderExpanded: person => h('p', `Detail ${person.name}`),
          hasRowClickExpansion: true,
        }))
        const columns: TableColumn<Person>[] = [{
          key: 'name',
          header: 'Name',
          width: pixel(160),
          renderCell: person => h('span', { contenteditable: 'true' }, person.name),
        }]
        return { people: people.slice(0, 1), columns, expansion }
      },
      template: '<Table :data="people" :columns="columns" id-key="id" :plugins="{ expansion }" />',
    })
    await wrapper.get('[contenteditable]').trigger('click')
    expect(wrapper.find('[data-expansion-panel]').exists()).toBe(false)
    await wrapper.get('tbody tr').trigger('click')
    expect(wrapper.get('[data-expansion-panel]').text()).toContain('Detail Alice')
    await wrapper.get('tbody button').trigger('click')
    expect(wrapper.find('[data-expansion-panel]').exists()).toBe(false)
  })

  it('pins a contiguous run and does nothing when no keys are given', () => {
    const columns: TableColumn<Person>[] = [
      { key: 'name', header: 'Name', width: pixel(100) },
      { key: 'role', header: 'Role', width: pixel(80) },
      { key: 'id', header: 'Id', width: pixel(40) },
    ]
    expect(stickyOffsets(columns, ['role'], 'start')?.get('name')).toBe(0)
    expect(stickyOffsets(columns, ['role'], 'start')?.get('role')).toBe(100)
    expect(stickyOffsets(columns, ['role'], 'end')?.get('role')).toBe(40)
    expect(stickyOffsets(columns, [], 'start')).toBeNull()

    const wrapper = mount({
      components: { Table },
      setup() {
        const sticky = useTableStickyColumns<Person>({ startKeys: ['name'], endKeys: ['id'] })
        return { people: people.slice(0, 1), columns, sticky }
      },
      template: '<Table :data="people" :columns="columns" id-key="id" :plugins="{ sticky }" />',
    })
    const pinned = wrapper.get('td[data-column="name"]')
    expect(pinned.attributes('style')).toContain('position: sticky')
    expect(pinned.attributes('style')).toContain('inset-inline-start: 0px')
    expect(wrapper.get('td[data-column="id"]').attributes('style')).toContain('inset-inline-end: 0px')
  })
})
