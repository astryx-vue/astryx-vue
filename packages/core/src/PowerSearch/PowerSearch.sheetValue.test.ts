import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { click, openSheet, phone, pickField, renderPowerSearch, settle, step } from './sheetTestUtils.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

const valueStep = () => step('value')!
const save = () => valueStep().querySelector<HTMLButtonElement>('[data-sheet-save]')!
/** Button 从不渲染原生 disabled，禁用写在 aria-disabled 上。 */
const isSaveOff = () => save().getAttribute('aria-disabled') === 'true'
function radioByLabel(label: string) {
  return [...valueStep().querySelectorAll<HTMLInputElement>('input[type="radio"]')]
    .find(radio => radio.closest('label')?.textContent?.trim() === label)!
}

async function openValueStep(field: string) {
  phone()
  const harness = renderPowerSearch()
  await openSheet()
  await pickField(field)
  return harness
}

async function saveAndFinish(): Promise<void> {
  await click(save())
  await vi.waitFor(() => expect(step('manage')).not.toBeNull())
  await click([...step('manage')!.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.trim() === 'Done'))
}

describe('power search sheet value step', () => {
  it('lists a multi-value choice as checkbox rows and keeps Save off until something is picked', async () => {
    const { filters } = await openValueStep('team')
    const boxes = valueStep().querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
    expect(boxes).toHaveLength(2)
    expect(valueStep().querySelector('[role="combobox"]')).toBeNull()
    expect(isSaveOff()).toBe(true)

    await click(boxes[0])
    await click(boxes[1])
    expect(isSaveOff()).toBe(false)
    await saveAndFinish()
    expect(filters.value).toEqual([{ field: 'team', operator: 'is_any_of', value: { type: 'enum_list', value: ['core', 'web'] } }])
  })

  it('picks the operator from a radio group and lists relative dates as fixed rows', async () => {
    const { filters } = await openValueStep('created')
    await click(radioByLabel('Created relative'))
    await click(radioByLabel('3 days ago'))
    await saveAndFinish()
    expect(filters.value).toEqual([{ field: 'created', operator: 'relative', value: { type: 'date_relative', value: '3d_ago' } }])
    // 「筛选条件」的行上读成选项的文字，不是存下的键。
    await click(document.querySelector<HTMLButtonElement>('.astryx-power-search-sheet-trigger'))
    await vi.waitFor(() => expect(step('manage')?.textContent).toContain('3 days ago'))
  })

  it('picks a date range on an inline range calendar', async () => {
    const { filters } = await openValueStep('created')
    const calendar = valueStep().querySelector<HTMLElement>('.astryx-calendar')!
    expect(calendar).not.toBeNull()
    expect(valueStep().querySelector('.astryx-date-range-input')).toBeNull()
    const days = [...calendar.querySelectorAll<HTMLButtonElement>('[data-date]:not(.is-outside)')]
    const start = days[2]!.dataset.date!
    const end = days[5]!.dataset.date!
    await click(days[2])
    await click(days[5])
    await saveAndFinish()
    const [value] = filters.value.map(filter => filter.value)
    expect(value).toEqual({
      type: 'date_range',
      value: {
        start: { type: 'ABSOLUTE', unixSeconds: Date.parse(`${start}T00:00:00Z`) / 1000 },
        end: { type: 'ABSOLUTE', unixSeconds: Date.parse(`${end}T23:59:59Z`) / 1000 },
      },
    })
  })

  it('makes the range calendar inert when the field turns read-only', async () => {
    const { readOnly } = await openValueStep('created')
    readOnly.value = true
    await settle()
    const calendar = valueStep().querySelector<HTMLElement>('.astryx-calendar')!
    expect(calendar.classList.contains('is-disabled')).toBe(true)
    const day = calendar.querySelector<HTMLButtonElement>('[data-date]:not(.is-outside)')!
    await click(day)
    expect(day.getAttribute('aria-selected')).not.toBe('true')
    expect(valueStep().querySelector('[data-sheet-save]')).toBeNull()
  })

  it('uses a bottom-sheet Tokenizer named by the field for list values', async () => {
    await openValueStep('tags')
    const tokenizerTrigger = valueStep().querySelector<HTMLButtonElement>('.astryx-tokenizer-sheet-trigger')!
    expect(tokenizerTrigger).not.toBeNull()
    expect(document.querySelector(`label[for="${tokenizerTrigger.id}"]`)?.textContent).toContain('Tags')
  })

  it('turns Save off again when a typed value is cleared', async () => {
    await openValueStep('name')
    const input = valueStep().querySelector<HTMLInputElement>('input[type="text"]')!
    input.value = 'ada'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()
    expect(isSaveOff()).toBe(false)
    input.value = '  '
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()
    expect(isSaveOff()).toBe(true)
  })
})
