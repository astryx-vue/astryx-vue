import type { UseGridRovingFocusOptions } from './useGridRovingFocus.js'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useGridRovingFocus } from './useGridRovingFocus.js'

describe('useGridRovingFocus', () => {
  it('initializes row and column from activeIndex', () => {
    const activeIndex = ref(5) // row 1, col 2 (in a 3-column grid)
    const onChange = vi.fn()

    const { row, column } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    expect(row.value).toBe(1)
    expect(column.value).toBe(2)
  })

  it('moves up with ArrowUp', () => {
    const activeIndex = ref(5) // row 1, col 2
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    onKeyDown(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith(2) // row 0, col 2
  })

  it('moves down with ArrowDown', () => {
    const activeIndex = ref(1) // row 0, col 1
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(4) // row 1, col 1
  })

  it('moves left with ArrowLeft', () => {
    const activeIndex = ref(5) // row 1, col 2
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(4) // row 1, col 1
  })

  it('moves right with ArrowRight', () => {
    const activeIndex = ref(4) // row 1, col 1
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(5) // row 1, col 2
  })

  it('moves to first column with Home', () => {
    const activeIndex = ref(5) // row 1, col 2
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'Home' })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(3) // row 1, col 0
  })

  it('moves to last column with End', () => {
    const activeIndex = ref(3) // row 1, col 0
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'End' })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(5) // row 1, col 2
  })

  it('moves to first cell with Ctrl+Home', () => {
    const activeIndex = ref(5) // row 1, col 2
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'Home', ctrlKey: true })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(0) // row 0, col 0
  })

  it('moves to last cell with Ctrl+End', () => {
    const activeIndex = ref(0) // row 0, col 0
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'End', ctrlKey: true })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(8) // row 2, col 2
  })

  it('moves to first row with PageUp', () => {
    const activeIndex = ref(5) // row 1, col 2
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'PageUp' })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(2) // row 0, col 2
  })

  it('moves to last row with PageDown', () => {
    const activeIndex = ref(1) // row 0, col 1
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    const event = new KeyboardEvent('keydown', { key: 'PageDown' })
    onKeyDown(event)

    expect(onChange).toHaveBeenCalledWith(7) // row 2, col 1
  })

  it('clamps to grid boundaries', () => {
    const activeIndex = ref(0) // row 0, col 0
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    // Try to move up from top row - moveTo will clamp to row 0, which is the same
    onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    // moveTo(0 - 1, 0) -> moveTo(-1, 0) -> clamped to moveTo(0, 0) -> index 0
    // Since we're already at index 0, onChange won't be called (same index)
    // Actually, looking at the implementation, it will call onChange with the clamped value
    // Let me check: moveTo clamps then calls onChange with the index
    // So it will call onChange(0) even though we're already at 0
    expect(onChange).toHaveBeenCalledWith(0)

    onChange.mockClear()

    // Try to move left from first column
    onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    // moveTo(0, 0 - 1) -> moveTo(0, -1) -> clamped to moveTo(0, 0) -> index 0
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('skips disabled cells', () => {
    const activeIndex = ref(0)
    const onChange = vi.fn()
    const isDisabled = (row: number, col: number) => row === 0 && col === 1

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      isDisabled,
      onChange,
    } as UseGridRovingFocusOptions)

    // Try to move right to a disabled cell
    onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('respects isEnabled flag', () => {
    const activeIndex = ref(0)
    const isEnabled = ref(false)
    const onChange = vi.fn()

    const { onKeyDown } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      isEnabled,
      onChange,
    } as UseGridRovingFocusOptions)

    onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('moveTo jumps to specific cell', () => {
    const activeIndex = ref(0)
    const onChange = vi.fn()

    const { moveTo } = useGridRovingFocus({
      rows: ref(3),
      columns: ref(3),
      activeIndex,
      onChange,
    } as UseGridRovingFocusOptions)

    moveTo(2, 1)
    expect(onChange).toHaveBeenCalledWith(7) // row 2, col 1
  })
})
