import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import type { FakeMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import type { PowerSearchChangeType, PowerSearchConfig, PowerSearchFilter } from './types.js'
import { flushPromises, mount } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { COMPACT_TOUCH, installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import PowerSearch from './PowerSearch.vue'

/** PowerSearch 底部弹层呈现的测试夹具：受控的字段，记下每次 `change`。 */
export const sheetConfig: PowerSearchConfig = {
  name: 'people',
  fields: [
    {
      key: 'name',
      label: 'Name',
      operators: [
        { key: 'contains', label: 'contains', value: { type: 'string' } },
        { key: 'is', label: 'is', value: { type: 'string' } },
      ],
    },
    {
      key: 'role',
      label: 'Role',
      operators: [{ key: 'is', label: 'is', value: { type: 'enum', values: [{ value: 'engineer', label: 'Engineer' }, { value: 'designer', label: 'Designer' }] } }],
    },
    {
      key: 'team',
      label: 'Team',
      operators: [{ key: 'is_any_of', label: 'is any of', value: { type: 'enum_list', values: [{ value: 'core', label: 'Core' }, { value: 'web', label: 'Web' }] } }],
    },
    {
      key: 'tags',
      label: 'Tags',
      operators: [{ key: 'has', label: 'has', value: { type: 'string_list' } }],
    },
    {
      key: 'created',
      label: 'Created',
      operators: [
        { key: 'between', label: 'between', value: { type: 'date_range' } },
        { key: 'relative', label: 'relative', value: { type: 'date_relative' } },
      ],
    },
  ],
}

export const nameFilter = (value: string, extra: Partial<PowerSearchFilter> = {}): PowerSearchFilter => ({ field: 'name', operator: 'contains', value: { type: 'string', value }, ...extra })

export function phone(): FakeMatchMedia {
  return installMatchMedia(query => query === COMPACT_TOUCH)
}

export async function settle(): Promise<void> {
  await flushPromises()
  await vi.waitFor(() => {})
  await nextTick()
}

export interface PowerSearchHarness {
  wrapper: VueWrapper
  filters: Ref<PowerSearchFilter[]>
  readOnly: Ref<boolean>
  changes: Array<[PowerSearchFilter[], PowerSearchChangeType, number]>
}

export function renderPowerSearch(options: { filters?: PowerSearchFilter[], props?: Record<string, unknown> } = {}): PowerSearchHarness {
  const filters = ref<PowerSearchFilter[]>(options.filters ?? [])
  const readOnly = ref(false)
  const changes: Array<[PowerSearchFilter[], PowerSearchChangeType, number]> = []
  const Host = defineComponent({
    setup() {
      return () => h('div', [
        h(PowerSearch, {
          'label': 'Search people',
          'config': sheetConfig,
          'filters': filters.value,
          'readOnly': readOnly.value,
          'onUpdate:filters': (next: PowerSearchFilter[]) => {
            filters.value = next
          },
          'onChange': (next: PowerSearchFilter[], changeType: PowerSearchChangeType, index: number) => changes.push([next, changeType, index]),
          ...options.props,
        }),
      ])
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  return { wrapper, filters, readOnly, changes }
}

export const trigger = (): HTMLButtonElement => document.querySelector<HTMLButtonElement>('.astryx-power-search-sheet-trigger')!
export const combobox = (): HTMLInputElement | null => document.querySelector<HTMLInputElement>('input[role="combobox"]')
export const openDialogs = (): HTMLDialogElement[] => [...document.querySelectorAll<HTMLDialogElement>('dialog.astryx-bottom-sheet-dialog[open]')]
export const step = (name: 'manage' | 'fields' | 'value'): HTMLElement | null => document.querySelector<HTMLElement>(`[data-sheet-step="${name}"]`)
export const confirmation = (): HTMLDialogElement | null => document.querySelector<HTMLDialogElement>('dialog.astryx-sheet-confirmation[open]')

export function buttonByText(root: ParentNode, text: string): HTMLButtonElement {
  const button = [...root.querySelectorAll<HTMLButtonElement>('button')].find(candidate => candidate.textContent?.trim() === text)
  if (button == null)
    throw new Error(`no button "${text}"`)
  return button
}

export async function click(element: HTMLElement | null | undefined): Promise<void> {
  element!.click()
  await settle()
}

export async function openSheet(): Promise<void> {
  await click(trigger())
  await vi.waitFor(() => expect(openDialogs().length).toBeGreaterThan(0))
  await settle()
}

export async function pickField(key: string): Promise<void> {
  await vi.waitFor(() => expect(step('fields')).not.toBeNull())
  await click(step('fields')!.querySelector<HTMLElement>(`[data-sheet-field="${key}"] button`))
  await vi.waitFor(() => expect(step('value')).not.toBeNull())
  await settle()
}
