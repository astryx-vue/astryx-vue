import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export interface UseNumberFieldOptions {
  /** 当前值 */
  value: Ref<number | null>
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步进值 */
  step?: number
  /** 是否禁用 */
  disabled?: Ref<boolean>
  /** 值变化回调 */
  onChange: (value: number | null) => void
}

export interface NumberField {
  /** 增加值 */
  increment: () => void
  /** 减少值 */
  decrement: () => void
  /** 设置值（带验证） */
  setValue: (value: number | null) => void
  /** 处理键盘事件 */
  onKeyDown: (event: KeyboardEvent) => void
}

/**
 * 数字输入框逻辑：步进、范围限制、键盘增减。
 */
export function useNumberField(options: UseNumberFieldOptions): NumberField {
  const {
    value,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    disabled = ref(false),
    onChange,
  } = options

  function clamp(val: number): number {
    return Math.max(min, Math.min(max, val))
  }

  function increment(): void {
    if (disabled.value)
      return
    const current = value.value ?? 0
    const next = clamp(current + step)
    onChange(next)
  }

  function decrement(): void {
    if (disabled.value)
      return
    const current = value.value ?? 0
    const next = clamp(current - step)
    onChange(next)
  }

  function setValue(val: number | null): void {
    if (disabled.value)
      return
    if (val === null) {
      onChange(null)
    }
    else {
      onChange(clamp(val))
    }
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (disabled.value)
      return

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        increment()
        break
      case 'ArrowDown':
        event.preventDefault()
        decrement()
        break
    }
  }

  // 当外部值变化时，确保在范围内
  watch(value, (val) => {
    if (val !== null && (val < min || val > max)) {
      onChange(clamp(val))
    }
  })

  return {
    increment,
    decrement,
    setValue,
    onKeyDown,
  }
}
