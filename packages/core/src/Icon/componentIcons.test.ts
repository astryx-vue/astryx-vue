import type { ThemeDefinition } from '../Theme/types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import CodeBlock from '../Code/CodeBlock.vue'
import { useTableSortable, useTableSortableState } from '../Table/plugins/sortable.js'
import Table from '../Table/Table.vue'
import TableExpansionChevron from '../Table/TableExpansionChevron.vue'
import { defineTheme } from '../Theme/defineTheme.js'
import Theme from '../Theme/Theme.vue'
import TimestampHoverCard from '../Timestamp/TimestampHoverCard.vue'
import { resolveComponentIcon } from './componentIcons.js'

const fallback = { icon: 'copy', size: 'sm' } as const

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('resolving a component icon slot', () => {
  it('keeps the fallback when the theme maps nothing', () => {
    expect(resolveComponentIcon('code-block-copy', { copied: false }, fallback, undefined)).toEqual(fallback)
  })

  it('replaces the icon with a shared name, or hides it with null', () => {
    const named = defineTheme({ name: 'slot-named', componentIcons: { 'code-block-copy': 'checkDouble' } })
    const hidden = defineTheme({ name: 'slot-hidden', componentIcons: { 'code-block-copy': null } })
    expect(resolveComponentIcon('code-block-copy', { copied: false }, fallback, named)).toEqual({ icon: 'checkDouble', size: 'sm' })
    expect(resolveComponentIcon('code-block-copy', { copied: false }, fallback, hidden).icon).toBeNull()
  })

  it('passes the slot state to a function, whose undefined changes nothing', () => {
    const theme = defineTheme({
      name: 'slot-fn',
      componentIcons: { 'code-block-copy': ({ copied }) => (copied ? { icon: 'checkDouble', size: 'lg' } : undefined) },
    })
    expect(resolveComponentIcon('code-block-copy', { copied: true }, fallback, theme)).toEqual({ icon: 'checkDouble', size: 'lg' })
    expect(resolveComponentIcon('code-block-copy', { copied: false }, fallback, theme)).toEqual(fallback)
  })

  it('keeps a variant only when the theme lists it', () => {
    const listed = defineTheme({ name: 'slot-variant', iconVariants: ['filled'], componentIcons: { 'code-block-copy': { variant: 'filled' } } })
    expect(resolveComponentIcon('code-block-copy', { copied: false }, fallback, listed).variant).toBe('filled')
  })

  it('ignores a malformed field with a warning and keeps the valid fields beside it', () => {
    vi.stubEnv('DEV', true)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const theme = { componentIconValues: { 'code-block-copy': { icon: 'nope', size: 'lg' } } } as unknown as ThemeDefinition
    expect(resolveComponentIcon('code-block-copy', { copied: false }, fallback, theme)).toEqual({ icon: 'copy', size: 'lg' })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('unknown icon "nope"'))
  })

  it('never throws while describing a value that cannot be serialized', () => {
    vi.stubEnv('DEV', true)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const cyclic: Record<string, unknown> = {}
    cyclic.self = cyclic
    const theme = {
      componentIconValues: { 'code-block-copy': { icon: cyclic, size: 10n } },
    } as unknown as ThemeDefinition
    expect(() => resolveComponentIcon('code-block-copy', { copied: false }, fallback, theme)).not.toThrow()
    expect(resolveComponentIcon('code-block-copy', { copied: false }, fallback, theme)).toEqual(fallback)
  })

  it('merges slots by name with the theme it extends, and leaves functions out of the static view', () => {
    const base = defineTheme({ name: 'slot-base', componentIcons: { 'code-block-copy': 'checkDouble', 'timestamp-copy': () => null } })
    const child = defineTheme({ name: 'slot-child', extends: base, componentIcons: { 'table-row-expand': 'chevronDown' } })
    expect(child.componentIcons).toEqual({ 'code-block-copy': 'checkDouble', 'table-row-expand': 'chevronDown' })
    expect(resolveComponentIcon('timestamp-copy', { copied: false }, fallback, child).icon).toBeNull()
  })
})

function inTheme(theme: ThemeDefinition, render: () => ReturnType<typeof h>) {
  return mount(Theme, { props: { theme }, slots: { default: render }, attachTo: document.body })
}

describe('component icon slots in components', () => {
  it('code-block-copy maps the copy button glyph by its copied state', () => {
    const theme = defineTheme({ name: 'slot-code', componentIcons: { 'code-block-copy': ({ copied }) => ({ icon: copied ? 'checkDouble' : 'search' }) } })
    const wrapper = inTheme(theme, () => h(CodeBlock, { code: 'let a = 1', language: 'ts' }))
    const button = wrapper.find('.astryx-code-block-copy-button')
    expect(button.find('.astryx-icon--search').exists()).toBe(true)
    wrapper.unmount()
  })

  it('code-block-copy null hides only the glyph', () => {
    const theme = defineTheme({ name: 'slot-code-hidden', componentIcons: { 'code-block-copy': null } })
    const wrapper = inTheme(theme, () => h(CodeBlock, { code: 'let a = 1', language: 'ts' }))
    const button = wrapper.find('.astryx-code-block-copy-button')
    expect(button.exists()).toBe(true)
    expect(button.find('.astryx-icon').exists()).toBe(false)
    wrapper.unmount()
  })

  it('timestamp-copy maps the hover card copy glyph', () => {
    const theme = defineTheme({ name: 'slot-timestamp', componentIcons: { 'timestamp-copy': 'checkDouble' } })
    const wrapper = mount(Theme, {
      props: { theme },
      slots: { default: () => h(TimestampHoverCard, { label: 'When', lines: [{ value: '2026-01-01', isCopyable: true }] }) },
      global: { stubs: { HoverCard: { template: '<div><slot /><slot name="content" /></div>' } } },
    })
    const action = wrapper.find('.astryx-timestamp__action')
    expect(action.find('.astryx-icon--check-double').exists()).toBe(true)
    expect(action.find('.astryx-icon--copy').exists()).toBe(false)
  })

  it('table-row-expand maps the expansion toggle glyph by its expanded state', () => {
    const theme = defineTheme({ name: 'slot-expand', componentIcons: { 'table-row-expand': ({ expanded }) => ({ icon: expanded ? 'close' : 'menu' }) } })
    const collapsed = inTheme(theme, () => h(TableExpansionChevron, { expanded: false }))
    expect(collapsed.find('.astryx-icon--menu').exists()).toBe(true)
    collapsed.unmount()
    const open = inTheme(theme, () => h(TableExpansionChevron, { expanded: true }))
    expect(open.find('.astryx-icon--close').exists()).toBe(true)
    expect(open.find('[aria-expanded="true"]').exists()).toBe(true)
    open.unmount()
  })

  it('table-sort-indicator maps the sort glyph by direction, and null keeps aria-sort and the control', () => {
    const theme = defineTheme({
      name: 'slot-sort',
      componentIcons: { 'table-sort-indicator': ({ direction }) => (direction === 'none' ? null : { icon: 'chevronDown' }) },
    })
    const SortTable = defineComponent({
      setup() {
        const { sortedData, sortConfig } = useTableSortableState({
          data: [{ id: '1', name: 'a', age: 1 }],
          defaultSort: [{ sortKey: 'name', direction: 'ascending' as const }],
        })
        const sortable = useTableSortable(sortConfig)
        return () => h(Table, {
          data: sortedData.value,
          columns: [{ key: 'name', header: 'Name', sortable: true }, { key: 'age', header: 'Age', sortable: true }],
          plugins: { sortable },
          idKey: 'id',
        })
      },
    })
    const wrapper = inTheme(theme, () => h(SortTable))
    const [sorted, unsorted] = wrapper.findAll('th')
    expect(sorted.attributes('aria-sort')).toBe('ascending')
    expect(sorted.find('.astryx-table__sort-icon .astryx-icon--chevron-down').exists()).toBe(true)
    expect(unsorted.find('.astryx-table__sort').exists()).toBe(true)
    expect(unsorted.find('.astryx-table__sort-icon .astryx-icon').exists()).toBe(false)
    wrapper.unmount()
  })
})
