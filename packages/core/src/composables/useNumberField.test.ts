import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useNumberField } from './useNumberField.js'

describe('useNumberField', () => {
  it('应该正确递增值', () => {
    const value = ref(5)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(10),
      step: ref(1),
    })

    field.increment()
    expect(value.value).toBe(6)
  })

  it('应该正确递减值', () => {
    const value = ref(5)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(10),
      step: ref(1),
    })

    field.decrement()
    expect(value.value).toBe(4)
  })

  it('应该遵守最大值限制', () => {
    const value = ref(9)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(10),
      step: ref(1),
    })

    field.increment()
    expect(value.value).toBe(10)

    field.increment()
    expect(value.value).toBe(10)
  })

  it('应该遵守最小值限制', () => {
    const value = ref(1)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(10),
      step: ref(1),
    })

    field.decrement()
    expect(value.value).toBe(0)

    field.decrement()
    expect(value.value).toBe(0)
  })

  it('应该支持自定义步进值', () => {
    const value = ref(5)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(20),
      step: ref(5),
    })

    field.increment()
    expect(value.value).toBe(10)

    field.decrement()
    expect(value.value).toBe(5)
  })

  it('应该支持小数步进值', () => {
    const value = ref(1.0)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(2),
      step: ref(0.1),
    })

    field.increment()
    expect(value.value).toBeCloseTo(1.1)

    field.decrement()
    expect(value.value).toBeCloseTo(1.0)
  })

  it('clamp 应该将值限制在范围内', () => {
    const value = ref(15)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(10),
      step: ref(1),
    })

    field.clamp()
    expect(value.value).toBe(10)

    value.value = -5
    field.clamp()
    expect(value.value).toBe(0)
  })

  it('键盘处理应该正确递增/递减', () => {
    const value = ref(5)
    const field = useNumberField({
      value,
      min: ref(0),
      max: ref(10),
      step: ref(1),
    })

    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    field.handleKeyDown(upEvent)
    expect(value.value).toBe(6)

    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    field.handleKeyDown(downEvent)
    expect(value.value).toBe(5)
  })
})
