import type { ComboboxOption } from './useCombobox'
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useCombobox } from './useCombobox'

enableAutoUnmount(afterEach)

function options(): ComboboxOption[] {
  return [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana', disabled: true },
    { value: 'c', label: 'Cherry' },
  ]
}

function setup(list = options()) {
  const optionsRef = ref(list)
  const onChange = vi.fn()
  const { result } = mountComposable(() => useCombobox({ options: optionsRef, modelValue: ref<string | null>(null), onChange, listboxId: 'list' }))
  return { optionsRef, onChange, combobox: result }
}

function key(init: KeyboardEventInit & { key: string }): KeyboardEvent {
  return new KeyboardEvent('keydown', { cancelable: true, ...init })
}

describe('useCombobox 调用方自己渲染的输入框', () => {
  it('收起时 aria-expanded 为 false，不指向任何东西', () => {
    const { combobox } = setup()
    const props = combobox.getFieldProps()
    expect(props).toMatchObject({ 'role': 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': false })
    expect(props['aria-controls']).toBeUndefined()
    expect(props['aria-activedescendant']).toBeUndefined()
  })

  it('收起时 ArrowDown 显示列表并高亮第一个可用选项', () => {
    const { combobox } = setup()
    const event = key({ key: 'ArrowDown' })
    combobox.getFieldProps().onKeydown(event)
    expect(event.defaultPrevented).toBe(true)
    const props = combobox.getFieldProps()
    expect(props['aria-expanded']).toBe(true)
    expect(props['aria-controls']).toBe('list')
    expect(props['aria-activedescendant']).toBe('list-option-0')
  })

  it('没有选项时 ArrowDown 留给输入框，打开了但没选项的列表不算展开', () => {
    const { combobox } = setup([])
    const event = key({ key: 'ArrowDown' })
    combobox.getFieldProps().onKeydown(event)
    expect(event.defaultPrevented).toBe(false)
    combobox.open()
    expect(combobox.getFieldProps()['aria-expanded']).toBe(false)
    expect(combobox.getFieldProps()['aria-controls']).toBeUndefined()
  })

  it('方向键跳过禁用项并在两头循环', () => {
    const { combobox } = setup()
    combobox.open()
    const down = () => combobox.getFieldProps().onKeydown(key({ key: 'ArrowDown' }))
    combobox.activeIndex.value = -1
    down()
    expect(combobox.activeIndex.value).toBe(0)
    down()
    expect(combobox.activeIndex.value).toBe(2)
    down()
    expect(combobox.activeIndex.value).toBe(0)
    combobox.getFieldProps().onKeydown(key({ key: 'ArrowUp' }))
    expect(combobox.activeIndex.value).toBe(2)
  })

  it('回车只在选中时拦下输入框自己的回车', () => {
    const { combobox, onChange } = setup()
    combobox.open()
    combobox.activeIndex.value = -1
    const idle = key({ key: 'Enter' })
    combobox.getFieldProps().onKeydown(idle)
    expect(idle.defaultPrevented).toBe(false)
    expect(onChange).not.toHaveBeenCalled()

    combobox.activeIndex.value = 2
    const pick = key({ key: 'Enter' })
    combobox.getFieldProps().onKeydown(pick)
    expect(pick.defaultPrevented).toBe(true)
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('escape 不管带不带修饰键都收起列表并认领按键；其他带修饰键的按键归输入框', () => {
    const { combobox, onChange } = setup()
    combobox.open()
    const chord = key({ key: 'Enter', shiftKey: true })
    combobox.getFieldProps().onKeydown(chord)
    expect(chord.defaultPrevented).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
    const escape = key({ key: 'Escape', ctrlKey: true })
    combobox.getFieldProps().onKeydown(escape)
    expect(escape.defaultPrevented).toBe(true)
    expect(combobox.isOpen.value).toBe(false)
  })

  it('输入法组词时每个键都归输入法', () => {
    const { combobox } = setup()
    const event = key({ key: 'ArrowDown', isComposing: true })
    combobox.getFieldProps().onKeydown(event)
    expect(event.defaultPrevented).toBe(false)
    expect(combobox.isOpen.value).toBe(false)
  })

  it('自己的 onKeydown 在组合框之后运行，组合框认领了的按键不再交给它', () => {
    const { combobox } = setup()
    const own = vi.fn()
    const props = combobox.getFieldProps({ onKeydown: own })
    props.onKeydown(key({ key: 'a' }))
    expect(own).toHaveBeenCalledTimes(1)
    props.onKeydown(key({ key: 'ArrowDown' }))
    expect(own).toHaveBeenCalledTimes(1)
  })

  it('home 和 End 留给光标', () => {
    const { combobox } = setup()
    combobox.open()
    const event = key({ key: 'End' })
    combobox.getFieldProps().onKeydown(event)
    expect(event.defaultPrevented).toBe(false)
  })
})

describe('useCombobox 列表和选项的属性', () => {
  it('列表按下不把焦点带走，选项带 id、角色和选中状态', () => {
    const { combobox, onChange } = setup()
    const list = combobox.getListboxProps()
    expect(list).toMatchObject({ id: 'list', role: 'listbox' })
    const down = new MouseEvent('mousedown', { cancelable: true })
    list.onMousedown(down)
    expect(down.defaultPrevented).toBe(true)

    combobox.open()
    const first = combobox.getOptionProps(0)
    expect(first).toMatchObject({ 'id': 'list-option-0', 'role': 'option', 'aria-selected': true })
    expect(first['aria-disabled']).toBeUndefined()
    expect(combobox.getOptionProps(1)).toMatchObject({ 'aria-selected': false, 'aria-disabled': true })

    combobox.getOptionProps(2).onMousemove()
    expect(combobox.activeIndex.value).toBe(2)
    combobox.getOptionProps(1).onMousemove()
    expect(combobox.activeIndex.value).toBe(2)
    combobox.getOptionProps(2).onClick()
    expect(onChange).toHaveBeenCalledWith('c')
    combobox.getOptionProps(1).onClick()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('getItemId 和选项的 id 一致；没给 listboxId 也有一个自动的', () => {
    const { result } = mountComposable(() => useCombobox({ options: ref(options()), modelValue: ref(null), onChange: () => {} }))
    expect(result.getListboxProps().id).toMatch(/^astryx-combobox-/)
    expect(result.getItemId(1)).toBe(`${result.getListboxProps().id}-option-1`)
  })
})
