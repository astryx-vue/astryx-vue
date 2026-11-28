import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { foldTypeaheadText } from './internal/typeaheadText.js'
import { useCombobox } from './useCombobox.js'

function makeCombobox(options: { value: string, label: string, disabled?: boolean }[], selected: string | null = null) {
  return useCombobox({
    options: ref(options),
    modelValue: ref(selected),
    onChange: () => {},
  })
}

describe('useCombobox opening highlight', () => {
  it('opens on the first enabled option, not a disabled first one', () => {
    const combobox = makeCombobox([
      { value: 'a', label: 'Alpha', disabled: true },
      { value: 'b', label: 'Beta' },
    ])
    combobox.open()
    expect(combobox.activeIndex.value).toBe(1)
  })

  it('does not highlight a disabled selected option', () => {
    const combobox = makeCombobox([
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta', disabled: true },
    ], 'b')
    combobox.open()
    expect(combobox.activeIndex.value).toBe(0)
  })
})

describe('type-to-select ignores accents', () => {
  const options = [
    { value: 'dao', label: 'Đào' },
    { value: 'anh', label: 'Ánh' },
    { value: 'asa', label: 'Åsa' },
    { value: 'nandu', label: 'Ñandú' },
    { value: 'lodz', label: 'Łódź' },
    { value: 'isparta', label: 'Isparta' },
    { value: 'izmir', label: 'İzmir' },
  ]

  it.each([
    ['d', 0],
    ['a', 1],
    ['n', 3],
    ['l', 4],
    ['ı', 5],
  ])('%s reaches option %i', (key, index) => {
    const combobox = makeCombobox(options)
    combobox.open()
    combobox.activeIndex.value = -1
    combobox.jumpToMatch(key)
    expect(combobox.activeIndex.value).toBe(index)
  })

  it('prefers an exact match when the accented letter itself is typed', () => {
    const combobox = makeCombobox(options)
    combobox.open()
    combobox.activeIndex.value = -1
    combobox.jumpToMatch('å')
    expect(combobox.activeIndex.value).toBe(2)
  })

  it('folds case, combining marks, stroked letters and Turkish i', () => {
    expect(foldTypeaheadText('ĐàoÅŁø')).toBe('daoalo')
    expect(foldTypeaheadText('İ')).toBe('i')
  })
})
