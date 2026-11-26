import type { ComboboxOption } from './useCombobox'
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useCombobox } from './useCombobox'

enableAutoUnmount(afterEach)

function fruits(): ComboboxOption[] {
  return [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana' },
    { value: 'c', label: 'Cherry' },
    { value: 'l', label: 'Łódź' },
  ]
}

function setup(initial = fruits()) {
  const options = ref(initial)
  const modelValue = ref<string | null>(null)
  const onChange = vi.fn()
  const isEnabled = ref(true)
  const { result: combobox } = mountComposable(() => useCombobox({ options, modelValue, onChange, isEnabled }))
  return { options, onChange, isEnabled, combobox }
}

function key(init: KeyboardEventInit & { key: string }, altGraph = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', init)
  if (altGraph)
    event.getModifierState = name => name === 'AltGraph'
  return event
}

describe('useCombobox 按字母跳转的修饰键', () => {
  it('altGr 键入的字母照常跳转（Windows 上它同时报 Control 和 Alt）', () => {
    const { combobox } = setup()
    combobox.open()
    combobox.onKeyDown(key({ key: 'ł', ctrlKey: true, altKey: true }, true))
    expect(combobox.activeIndex.value).toBe(3)
  })

  it('单独的 Alt（macOS 的 Option 加字母）也算键入', () => {
    const { combobox } = setup()
    combobox.open()
    combobox.onKeyDown(key({ key: 'c', altKey: true }))
    expect(combobox.activeIndex.value).toBe(2)
  })

  it('control 或 Command 快捷键不跳转', () => {
    const { combobox } = setup()
    combobox.open()
    const before = combobox.activeIndex.value
    combobox.onKeyDown(key({ key: 'c', ctrlKey: true }))
    combobox.onKeyDown(key({ key: 'c', metaKey: true }))
    expect(combobox.activeIndex.value).toBe(before)
  })
})

describe('useCombobox 选中与禁用', () => {
  it('列表打开后被禁用，选中不再改值', () => {
    const { combobox, onChange, isEnabled } = setup()
    combobox.open()
    isEnabled.value = false
    combobox.select('b')
    combobox.selectHighlighted()
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('useCombobox 高亮跟着选项走', () => {
  it('选项重新加载，高亮按值留在原来的选项上', async () => {
    const { combobox, options } = setup()
    combobox.open()
    combobox.highlightLast()
    combobox.highlightPrevious()
    expect(combobox.filteredOptions.value[combobox.activeIndex.value]?.value).toBe('c')
    options.value = [{ value: 'z', label: 'Zucchini' }, ...fruits()]
    await nextTick()
    expect(combobox.filteredOptions.value[combobox.activeIndex.value]?.value).toBe('c')
  })

  it('高亮的选项消失，落到后面第一个可用的；后面没有就落到前面最近的', async () => {
    const { combobox, options } = setup()
    combobox.open()
    combobox.highlightNext()
    options.value = [fruits()[0]!, fruits()[2]!]
    await nextTick()
    expect(combobox.filteredOptions.value[combobox.activeIndex.value]?.value).toBe('c')
    options.value = [fruits()[0]!]
    await nextTick()
    expect(combobox.filteredOptions.value[combobox.activeIndex.value]?.value).toBe('a')
    options.value = []
    await nextTick()
    expect(combobox.activeIndex.value).toBe(-1)
  })

  it('高亮的选项被禁用，当作消失处理', async () => {
    const { combobox, options } = setup()
    combobox.open()
    combobox.highlightNext()
    options.value = fruits().map(option => option.value === 'b' ? { ...option, disabled: true } : option)
    await nextTick()
    expect(combobox.filteredOptions.value[combobox.activeIndex.value]?.value).toBe('c')
  })

  it('查询变化时高亮清空，有查询才重新落在第一项', async () => {
    const { combobox } = setup()
    combobox.open()
    combobox.highlightLast()
    combobox.setSearchQuery('')
    expect(combobox.activeIndex.value).toBe(-1)
  })
})
