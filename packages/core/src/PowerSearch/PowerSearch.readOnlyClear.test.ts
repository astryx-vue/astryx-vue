import type { PowerSearchConfig, PowerSearchFilter } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import PowerSearch from './PowerSearch.vue'
import PowerSearchEditor from './PowerSearchEditor.vue'

const config: PowerSearchConfig = {
  name: 'clear',
  fields: [
    {
      key: 'name',
      label: 'Name',
      operators: [{ key: 'contains', label: 'contains', value: { type: 'string' } }],
    },
    {
      key: 'active',
      label: 'Active',
      operators: [{ key: 'is_true', label: 'is true', value: { type: 'empty' } }],
    },
  ],
}

const editable: PowerSearchFilter = { field: 'name', operator: 'contains', value: { type: 'string', value: 'ali' } }
const locked: PowerSearchFilter = { field: 'active', operator: 'is_true', value: { type: 'empty' }, isReadOnly: true }

const mounted: Array<{ unmount: () => void }> = []

function mountSearch(filters: PowerSearchFilter[], props: Record<string, unknown> = {}) {
  const wrapper = mount(PowerSearch, { props: { config, filters, ...props }, attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

async function settle(): Promise<void> {
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))
  await new Promise(resolve => requestAnimationFrame(resolve))
}

function liveText(): string {
  return [...document.querySelectorAll('[data-astryx-live-region]')].map(node => node.textContent).join(' ')
}

afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  resetLiveRegionsForTest()
})

describe('power search clear all and read-only filters', () => {
  it('removes the editable filters, keeps the read-only ones, and reports the first removed index', async () => {
    const wrapper = mountSearch([locked, editable, { ...editable, value: { type: 'string', value: 'bob' } }])
    await wrapper.get('.astryx-power-search-clear').trigger('click')
    await settle()

    expect(wrapper.emitted('update:filters')?.at(-1)).toEqual([[locked]])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[locked], 'remove', 1])
    expect(liveText()).toContain('Editable filters removed')
  })

  it('announces the all-removed words once when no read-only filter stays', async () => {
    const wrapper = mountSearch([editable])
    await wrapper.get('.astryx-power-search-clear').trigger('click')
    await settle()

    expect(wrapper.emitted('change')?.at(-1)).toEqual([[], 'remove', 0])
    expect(liveText()).toContain('All filters removed')
    expect(liveText()).not.toContain('Editable filters removed')
  })

  it('shows clear all only while an editable filter exists', async () => {
    const wrapper = mountSearch([locked])
    expect(wrapper.find('.astryx-power-search-clear').exists()).toBe(false)
    await wrapper.setProps({ filters: [locked, editable] })
    expect(wrapper.find('.astryx-power-search-clear').exists()).toBe(true)
  })

  it('removes no filter with Backspace when the last one is read-only, or the field is read-only', async () => {
    const lastLocked = mountSearch([editable, locked])
    await lastLocked.get('input').trigger('keydown', { key: 'Backspace' })
    expect(lastLocked.emitted('change')).toBeUndefined()

    const readOnly = mountSearch([editable], { readOnly: true })
    await readOnly.get('input').trigger('keydown', { key: 'Backspace' })
    expect(readOnly.emitted('change')).toBeUndefined()
    expect(readOnly.find('.astryx-power-search-clear').exists()).toBe(false)
  })
})

describe('power search token press', () => {
  it('does not open the field suggestions when a token is pressed', async () => {
    const wrapper = mountSearch([editable])
    const token = wrapper.get('.astryx-power-search-tokens .astryx-power-search-token button')
    await token.trigger('mousedown')
    await token.trigger('click')
    await nextTick()
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('false')
  })
})

describe('power search field attributes', () => {
  it('asks a touch keyboard for the Search key and no autocorrection', () => {
    const input = mountSearch([]).get('input')
    expect(input.attributes('enterkeyhint')).toBe('search')
    expect(input.attributes('autocorrect')).toBe('off')
  })

  it('draws the status as an info button when statusVariant is tooltip', () => {
    const tooltip = mountSearch([], { status: 'error', statusMessage: 'Too many filters', statusVariant: 'tooltip' })
    expect(tooltip.find('.astryx-power-search-end button').exists()).toBe(true)
    const attached = mountSearch([], { status: 'error', statusMessage: 'Too many filters' })
    expect(attached.find('.astryx-power-search-end button').exists()).toBe(false)
    expect(attached.find('.astryx-power-search-end .astryx-field-icon').exists()).toBe(true)
  })

  it('names the missing config in a development build', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(PowerSearch)).toThrow('PowerSearch: `config` is required')
    expect(() => mount(PowerSearchEditor)).toThrow('PowerSearchEditor: `config` is required')
    vi.restoreAllMocks()
  })
})
