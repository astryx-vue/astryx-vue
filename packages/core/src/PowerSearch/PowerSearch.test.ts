import type { PowerSearchFilter } from './types.js'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import { completePowerSearchFilter } from './complete.js'
import { createPowerSearchLookup } from './config.js'
import { resolveEditorPlacement } from './placement.js'
import PowerSearch from './PowerSearch.vue'
import { applyPowerSearchFilters, createPowerSearchConfig } from './query.js'
import { searchPowerSearchFields } from './source.js'

const { config, applyFilters } = createPowerSearchConfig([
  { key: 'name', type: 'string', label: 'Name' },
  { key: 'role', type: 'enum', label: 'Role', enumValues: [{ value: 'engineer', label: 'Engineer' }] },
  { key: 'active', type: 'boolean', label: 'Active' },
  { key: 'age', type: 'number', label: 'Age' },
  { key: 'created', type: 'date', label: 'Created' },
] as const)

const people = [
  { name: 'Alice', role: 'engineer', active: true, age: 32, created: 50 },
  { name: 'Bob', role: 'designer', active: false, age: 28, created: 150 },
]

describe('power search filters', () => {
  it('matches strings without caring about case, and keeps table filtering separate', () => {
    const matched = applyFilters([
      { field: 'name', operator: 'contains', value: { type: 'string', value: 'ali' } },
    ], people)
    expect(matched.map(person => person.name)).toEqual(['Alice'])
    expect(applyPowerSearchFilters([], people)).toEqual(people)
  })

  it('treats a string cell as a one-item list and combines nested filters', () => {
    const anyName = applyPowerSearchFilters([
      {
        field: 'name',
        operator: 'any',
        value: {
          type: 'nested',
          value: [
            { field: 'name', operator: 'is', value: { type: 'string', value: 'alice' } },
            { field: 'name', operator: 'is', value: { type: 'string', value: 'bob' } },
          ],
        },
      },
    ], people)
    expect(anyName).toHaveLength(2)
    const none = applyFilters([
      { field: 'role', operator: 'is_none_of', value: { type: 'enum_list', value: ['engineer'] } },
    ], people)
    expect(none.map(person => person.name)).toEqual(['Bob'])
  })

  it('compares numbers and absolute dates, and leaves time filters to the caller', () => {
    expect(applyFilters([
      { field: 'age', operator: 'greater_than', value: { type: 'float', value: 30 } },
      { field: 'created', operator: 'before', value: { type: 'date_absolute', unixSeconds: 100 } },
    ], people).map(person => person.name)).toEqual(['Alice'])
    expect(applyPowerSearchFilters([
      { field: 'name', operator: 'at', value: { type: 'time', value: '09:00' } },
    ], people)).toHaveLength(2)
  })

  it('refuses a nested filter until every child is complete', () => {
    const lookup = createPowerSearchLookup({
      name: 'nested',
      fields: [{
        key: 'match',
        label: 'Match',
        operators: [{ key: 'all', label: 'all of', value: { type: 'nested' } }],
      }, {
        key: 'name',
        label: 'Name',
        operators: [{ key: 'contains', label: 'contains', value: { type: 'string' } }],
      }],
    })
    expect(completePowerSearchFilter({
      field: 'match',
      operator: 'all',
      children: [{ field: 'name', operator: 'contains' }],
    }, lookup)).toBeNull()
    expect(completePowerSearchFilter({
      field: 'match',
      operator: 'all',
      children: [{ field: 'name', operator: 'contains', value: { type: 'string', value: 'a' } }],
    }, lookup)?.value).toEqual({
      type: 'nested',
      value: [{ field: 'name', operator: 'contains', value: { type: 'string', value: 'a' } }],
    })
  })
})

describe('power search placement and menu', () => {
  it('keeps the editor between 400 and 720, and hugs the nearer edge only when capped', () => {
    const open = {
      anchorTop: 40,
      anchorBottom: 72,
      viewportHeight: 800,
    }
    const roomy = resolveEditorPlacement({
      ...open,
      outer: { left: 20, right: 520, width: 500 },
      control: { left: 400, right: 480, width: 80 },
      viewportWidth: 1200,
      direction: 'ltr',
    })
    expect(roomy).toMatchObject({ width: 500, capped: false, edge: 'left', left: 20 })

    const capped = resolveEditorPlacement({
      ...open,
      outer: { left: 10, right: 910, width: 900 },
      control: { left: 800, right: 880, width: 80 },
      viewportWidth: 1400,
      direction: 'ltr',
    })
    expect(capped).toMatchObject({ width: 720, capped: true, edge: 'right', left: 190 })

    const narrow = resolveEditorPlacement({
      ...open,
      outer: { left: 0, right: 900, width: 900 },
      control: { left: 0, right: 40, width: 40 },
      viewportWidth: 300,
      direction: 'ltr',
    })
    expect(narrow.width).toBe(284)
    expect(narrow.capped).toBe(true)
  })

  it('browses fields when the query is empty and offers a content search otherwise', () => {
    const lookup = createPowerSearchLookup({ ...config, contentSearchFieldKey: 'name' })
    const browse = searchPowerSearchFields(lookup, '', powerSearchMessages.en, 10)
    expect(browse.map(item => item.label)).toContain('Name')
    const typed = searchPowerSearchFields(lookup, 'zzz', powerSearchMessages.en, 10)
    expect(typed[0]?.label).toBe('"zzz"')
    expect(typed[0]?.auxiliaryData?.filterValue).toEqual({ type: 'string', value: 'zzz' })
  })
})

describe('power search', () => {
  it('adds an empty operator immediately and removes the last filter with backspace', async () => {
    const filters = ref<PowerSearchFilter[]>([])
    const wrapper = mount(PowerSearch, {
      props: {
        config,
        'filters': filters.value,
        'resultCount': 1,
        'onUpdate:filters': (next: typeof filters.value) => {
          filters.value = next
        },
      },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('1 result')
    await wrapper.get('input').trigger('focus')
    await flushPromises()
    await nextTick()
    const option = [...document.body.querySelectorAll('[role="option"]')].find(node => node.textContent?.includes('Active'))
    expect(option).toBeTruthy()
    option?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(filters.value).toHaveLength(1)
    expect(filters.value[0]).toMatchObject({ field: 'active', operator: 'is_true', value: { type: 'empty' } })
    await wrapper.setProps({ filters: filters.value })
    await wrapper.get('input').trigger('keydown', { key: 'Backspace' })
    expect(filters.value).toHaveLength(0)
    wrapper.unmount()
  })

  it('translates the original prop and slot names onto the same behaviour', async () => {
    const filters = ref<PowerSearchFilter[]>([
      { field: 'active', operator: 'is_true', value: { type: 'empty' } },
    ])
    const wrapper = mount(PowerSearch, {
      props: {
        config,
        'filters': filters.value,
        'hasClear': false,
        'disabled': true,
        'disabledMessage': 'You need edit access',
        'onUpdate:filters': (next: typeof filters.value) => {
          filters.value = next
        },
      },
      slots: { endContent: '<span class="end-content">Save view</span>' },
      attachTo: document.body,
    })
    expect(wrapper.find('.astryx-power-search-clear').exists()).toBe(false)
    expect(wrapper.find('.end-content').text()).toBe('Save view')
    expect(wrapper.text()).toContain('You need edit access')
    wrapper.unmount()
  })

  it('hides the clear button through hasClear and shows it by default', () => {
    const enabled = mount(PowerSearch, { props: { config, filters: [{ field: 'active', operator: 'is_true', value: { type: 'empty' } }] } })
    expect(enabled.find('.astryx-power-search-clear').exists()).toBe(true)
    enabled.unmount()

    const legacy = mount(PowerSearch, { props: { config, filters: [{ field: 'active', operator: 'is_true', value: { type: 'empty' } }], clearable: false } })
    expect(legacy.find('.astryx-power-search-clear').exists()).toBe(false)
    legacy.unmount()
  })
})
