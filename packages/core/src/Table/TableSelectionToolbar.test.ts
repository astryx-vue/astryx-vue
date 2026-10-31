import type { TableSelectionState } from './plugins/selection.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useTableSelectionState } from './plugins/selection.js'
import TableSelectionToolbar from './TableSelectionToolbar.vue'

interface Person extends Record<string, unknown> {
  id: string
  name: string
}

const people: Person[] = [
  { id: '1', name: 'Charlie' },
  { id: '2', name: 'Alice' },
  { id: '3', name: 'Bob' },
]

function createSelection(initialKeys: string[]): { selectionState: TableSelectionState, selected: ReturnType<typeof ref<Set<string>>> } {
  const selected = ref(new Set<string>(initialKeys))
  const { selectionState } = useTableSelectionState<Person>({
    data: people,
    idKey: 'id',
    selectedKeys: selected,
    setSelectedKeys: (keys) => {
      selected.value = keys
    },
  })
  return { selectionState, selected }
}

describe('table selection toolbar', () => {
  it('renders the count label, the clear command, and the built-in accessible name', () => {
    const wrapper = mount(TableSelectionToolbar, { props: { count: 3 } })

    expect(wrapper.get('[role="toolbar"]').attributes('aria-label')).toBe('Bulk actions')
    expect(wrapper.get('.astryx-table-selection-toolbar__label').text()).toBe('3 selected')
    expect(wrapper.get('.astryx-table-selection-toolbar__clear').text()).toBe('Unselect All')
  })

  it('overrides both labels with label and clearLabel', () => {
    const wrapper = mount(TableSelectionToolbar, {
      props: { count: 2, label: 'Selection actions', clearLabel: 'Clear' },
    })

    expect(wrapper.get('[role="toolbar"]').attributes('aria-label')).toBe('Selection actions')
    expect(wrapper.get('.astryx-table-selection-toolbar__clear').text()).toBe('Clear')
  })

  it('lets the label slot take over the count text and hands it the count', () => {
    const wrapper = mount(TableSelectionToolbar, {
      props: { count: 4 },
      slots: { label: ({ count }: { count: number }) => `${count} rows picked` },
    })

    expect(wrapper.get('.astryx-table-selection-toolbar__label').text()).toBe('4 rows picked')
  })

  it('puts start slot actions at the logical start and keeps the default slot working', () => {
    const named = mount(TableSelectionToolbar, {
      props: { count: 1 },
      slots: { start: '<button class="custom-action">Export</button>' },
    })
    const legacy = mount(TableSelectionToolbar, {
      props: { count: 1 },
      slots: { default: '<button class="custom-action">Export</button>' },
    })

    for (const wrapper of [named, legacy]) {
      const startSlot = wrapper.get('.astryx-toolbar__slot--start')
      expect(startSlot.get('.custom-action').text()).toBe('Export')
      expect(wrapper.get('.astryx-toolbar__slot--end').find('.astryx-table-selection-toolbar__clear').exists()).toBe(true)
    }
  })

  it('takes the count from the selection state and clears it from the clear command', async () => {
    const { selectionState, selected } = createSelection(['1', '2'])
    const wrapper = mount(TableSelectionToolbar, { props: { selection: selectionState } })

    expect(wrapper.get('.astryx-table-selection-toolbar__label').text()).toBe('2 selected')

    await wrapper.get('.astryx-table-selection-toolbar__clear').trigger('click')

    expect(selected.value?.size).toBe(0)
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.find('.astryx-table-selection-toolbar').exists()).toBe(false)
  })

  it('renders nothing when the selection state holds no keys, but keeps count rendering at zero', () => {
    const { selectionState } = createSelection([])

    const empty = mount(TableSelectionToolbar, { props: { selection: selectionState } })
    expect(empty.find('.astryx-table-selection-toolbar').exists()).toBe(false)

    const counted = mount(TableSelectionToolbar, { props: { count: 0 } })
    expect(counted.get('.astryx-table-selection-toolbar__label').text()).toBe('0 selected')
  })

  it('styles the clear command with its own class instead of the header sort class', () => {
    const wrapper = mount(TableSelectionToolbar, { props: { count: 1 } })
    const clear = wrapper.get('.astryx-table-selection-toolbar__clear')

    expect(clear.classes()).toContain('astryx-button')
    expect(clear.classes()).not.toContain('astryx-table__sort')
    expect(clear.attributes('data-variant')).toBe('ghost')
    expect(clear.attributes('data-size')).toBe('sm')
  })

  it('passes size and variant down to the toolbar surface', () => {
    const muted = mount(TableSelectionToolbar, { props: { count: 1 } })
    expect(muted.get('.astryx-toolbar').classes()).toContain('astryx-toolbar--sm')
    expect(muted.get('.astryx-section__inner').attributes('data-variant')).toBe('muted')

    const plain = mount(TableSelectionToolbar, { props: { count: 1, size: 'lg', variant: 'transparent' } })
    expect(plain.get('.astryx-toolbar').classes()).toContain('astryx-toolbar--lg')
    expect(plain.get('.astryx-section__inner').attributes('data-variant')).toBe('transparent')

    const section = mount(TableSelectionToolbar, { props: { count: 1, variant: 'section' } })
    expect(section.get('.astryx-section__inner').attributes('data-variant')).toBe('section')
  })
})

describe('table selection state', () => {
  it('reports the count, the selection flag, and clears every key', () => {
    const { selectionState, selected } = createSelection(['1', '3'])

    expect(selectionState.selectedCount).toBe(2)
    expect(selectionState.hasSelection).toBe(true)
    expect([...selectionState.selectedKeys]).toEqual(['1', '3'])

    selectionState.clearSelection()

    expect(selected.value?.size).toBe(0)
    expect(selectionState.selectedCount).toBe(0)
    expect(selectionState.hasSelection).toBe(false)
  })
})
