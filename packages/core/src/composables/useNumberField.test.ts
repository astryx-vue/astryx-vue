import type { UseNumberFieldOptions } from './useNumberField.js'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useNumberField } from './useNumberField.js'

describe('useNumberField', () => {
  it('increments value by step', () => {
    const value = ref(5)
    const onChange = vi.fn()
    const { increment } = useNumberField({
      value,
      step: 1,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('decrements value by step', () => {
    const value = ref(5)
    const onChange = vi.fn()
    const { decrement } = useNumberField({
      value,
      step: 1,
      onChange,
    } as UseNumberFieldOptions)

    decrement()
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('clamps value to max', () => {
    const value = ref(8)
    const onChange = vi.fn()
    const { increment } = useNumberField({
      value,
      min: 0,
      max: 10,
      step: 5,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).toHaveBeenCalledWith(10) // 8 + 5 = 13, clamped to 10
  })

  it('clamps value to min', () => {
    const value = ref(2)
    const onChange = vi.fn()
    const { decrement } = useNumberField({
      value,
      min: 0,
      max: 10,
      step: 5,
      onChange,
    } as UseNumberFieldOptions)

    decrement()
    expect(onChange).toHaveBeenCalledWith(0) // 2 - 5 = -3, clamped to 0
  })

  it('steps an empty value onto the step grid', () => {
    const value = ref<number | null>(null)
    const onChange = vi.fn()
    const { increment } = useNumberField({
      value,
      step: 1,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('steps an empty value to the minimum when one is set', () => {
    const value = ref<number | null>(null)
    const onChange = vi.fn()
    const { increment } = useNumberField({
      value,
      min: 4,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('reports whether another step is possible', () => {
    const value = ref(9)
    const { canIncrement, canDecrement } = useNumberField({
      value,
      max: 10,
      onChange: () => {},
    })

    expect(canIncrement.value).toBe(true)
    expect(canDecrement.value).toBe(true)

    value.value = 10
    expect(canIncrement.value).toBe(false)
  })

  it('steps on whole numbers when integers only', () => {
    const value = ref(2)
    const onChange = vi.fn()
    const { increment } = useNumberField({
      value,
      step: 0.5,
      integerOnly: true,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('ignores decimals when integers only', () => {
    const value = ref(2)
    const onChange = vi.fn()
    const { setValue } = useNumberField({
      value,
      integerOnly: true,
      onChange,
    } as UseNumberFieldOptions)

    setValue(2.5)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not step while read-only', () => {
    const value = ref(2)
    const onChange = vi.fn()
    const { increment } = useNumberField({
      value,
      readOnly: true,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('sets value directly', () => {
    const value = ref(5)
    const onChange = vi.fn()
    const { setValue } = useNumberField({
      value,
      min: 0,
      max: 10,
      onChange,
    } as UseNumberFieldOptions)

    setValue(7)
    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('clamps setValue to range', () => {
    const value = ref(5)
    const onChange = vi.fn()
    const { setValue } = useNumberField({
      value,
      min: 0,
      max: 10,
      onChange,
    } as UseNumberFieldOptions)

    setValue(15)
    expect(onChange).toHaveBeenCalledWith(10)

    setValue(-5)
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('allows setting null value', () => {
    const value = ref(5)
    const onChange = vi.fn()
    const { setValue } = useNumberField({
      value,
      onChange,
    } as UseNumberFieldOptions)

    setValue(null)
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('handles ArrowUp key', () => {
    const value = ref(5)
    const onChange = vi.fn()
    const { onKeyDown } = useNumberField({
      value,
      step: 1,
      onChange,
    } as UseNumberFieldOptions)

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    onKeyDown(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('handles ArrowDown key', () => {
    const value = ref(5)
    const onChange = vi.fn()
    const { onKeyDown } = useNumberField({
      value,
      step: 1,
      onChange,
    } as UseNumberFieldOptions)

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    onKeyDown(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('respects disabled state', () => {
    const value = ref(5)
    const disabled = ref(true)
    const onChange = vi.fn()
    const { increment, decrement, setValue } = useNumberField({
      value,
      disabled,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).not.toHaveBeenCalled()

    decrement()
    expect(onChange).not.toHaveBeenCalled()

    setValue(10)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('uses custom step', () => {
    const value = ref(10)
    const onChange = vi.fn()
    const { increment, decrement } = useNumberField({
      value,
      step: 5,
      onChange,
    } as UseNumberFieldOptions)

    increment()
    expect(onChange).toHaveBeenCalledWith(15)

    onChange.mockClear()
    decrement()
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
