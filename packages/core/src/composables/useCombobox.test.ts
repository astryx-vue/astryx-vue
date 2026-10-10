import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import type { ComboboxOption } from './useCombobox'
import { useCombobox } from './useCombobox'

describe('useCombobox', () => {
  const createOptions = (): ComboboxOption[] => [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
    { value: '4', label: 'Date', disabled: true },
  ]

  it('opens and closes', () => {
    const options = ref(createOptions())
    const modelValue = ref<string | null>(null)
    const onChange = vi.fn()

    const combobox = useCombobox({ options, modelValue, onChange })

    expect(combobox.isOpen.value).toBe(false)

    combobox.open()
    expect(combobox.isOpen.value).toBe(true)

    combobox.close()
    expect(combobox.isOpen.value).toBe(false)
  })

  it('navigates with arrow keys', () => {
    const options = ref(createOptions())
    const modelValue = ref<string | null>(null)
    const onChange = vi.fn()

    const combobox = useCombobox({ options, modelValue, onChange })
    combobox.open()

    expect(combobox.activeIndex.value).toBe(0)

    combobox.highlightNext()
    expect(combobox.activeIndex.value).toBe(1)

    combobox.highlightNext()
    expect(combobox.activeIndex.value).toBe(2)

    // 跳过禁用项
    combobox.highlightNext()
    expect(combobox.activeIndex.value).toBe(0) // 循环到第一项

    combobox.highlightPrevious()
    expect(combobox.activeIndex.value).toBe(2) // 跳过禁用项，回到 Cherry
  })

  it('selects option', () => {
    const options = ref(createOptions())
    const modelValue = ref<string | null>(null)
    const onChange = vi.fn()

    const combobox = useCombobox({ options, modelValue, onChange })
    combobox.open()

    combobox.highlightNext() // Apple -> Banana
    combobox.selectHighlighted()

    expect(onChange).toHaveBeenCalledWith('2')
    expect(combobox.isOpen.value).toBe(false)
  })

  it('filters options when searchable', async () => {
    const options = ref(createOptions())
    const modelValue = ref<string | null>(null)
    const onChange = vi.fn()
    const isSearchable = ref(true)

    const combobox = useCombobox({ options, modelValue, onChange, isSearchable })

    expect(combobox.filteredOptions.value).toHaveLength(4)

    combobox.setSearchQuery('an')
    await nextTick()

    expect(combobox.filteredOptions.value).toHaveLength(1)
    expect(combobox.filteredOptions.value[0].label).toBe('Banana')
  })

  it('jumps to match on typeahead', () => {
    const options = ref(createOptions())
    const modelValue = ref<string | null>(null)
    const onChange = vi.fn()

    const combobox = useCombobox({ options, modelValue, onChange })
    combobox.open()

    combobox.jumpToMatch('c')
    expect(combobox.activeIndex.value).toBe(2) // Cherry

    combobox.jumpToMatch('b')
    expect(combobox.activeIndex.value).toBe(1) // Banana
  })

  it('handles keyboard events', () => {
    const options = ref(createOptions())
    const modelValue = ref<string | null>(null)
    const onChange = vi.fn()

    const combobox = useCombobox({ options, modelValue, onChange })

    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    const preventDefaultSpy = vi.spyOn(downEvent, 'preventDefault')

    combobox.onKeyDown(downEvent)
    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(combobox.isOpen.value).toBe(true)

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    combobox.onKeyDown(enterEvent)
    expect(onChange).toHaveBeenCalled()
  })
})
