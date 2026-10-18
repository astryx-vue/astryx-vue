import type { MaybeRefOrGetter, Ref } from 'vue'
import { computed, toValue, watch } from 'vue'

export type NumberStepDirection = 1 | -1

export interface UseNumberFieldOptions {
  /** 当前值 */
  value: Ref<number | null>
  /** 最小值 */
  min?: MaybeRefOrGetter<number | null | undefined>
  /** 最大值 */
  max?: MaybeRefOrGetter<number | null | undefined>
  /** 步进值 */
  step?: MaybeRefOrGetter<number | null | undefined>
  /** 是否禁用 */
  disabled?: MaybeRefOrGetter<boolean | undefined>
  /** 是否只读。只读时步进全部关闭 */
  readOnly?: MaybeRefOrGetter<boolean | undefined>
  /** 是否只接受整数 */
  integerOnly?: MaybeRefOrGetter<boolean | undefined>
  /** 值变化回调 */
  onChange: (value: number | null) => void
}

export interface NumberField {
  /** 增加值 */
  increment: () => void
  /** 减少值 */
  decrement: () => void
  /** 按方向步进。走了就返回 true */
  step: (direction: NumberStepDirection) => boolean
  /** 还能不能再加一步 */
  canIncrement: Ref<boolean>
  /** 还能不能再减一步 */
  canDecrement: Ref<boolean>
  /** 设置值（带验证） */
  setValue: (value: number | null) => void
  /** 处理键盘事件 */
  onKeyDown: (event: KeyboardEvent) => void
}

/** 小数位数。指数写法按尾数算，避免 1e-7 被当成 0 位。 */
function decimalPlaces(value: number): number {
  const [coefficient, exponentText] = String(value).toLowerCase().split('e')
  const fractionLength = coefficient.split('.')[1]?.length ?? 0
  const exponent = exponentText == null ? 0 : Number(exponentText)
  return Math.max(0, fractionLength - exponent)
}

/**
 * 整数模式下非整数步长退回 1：按 0.5 走一步会落在 2.5，而字段只收整数。
 */
function effectiveStep(step: number | null | undefined, integerOnly: boolean): number {
  if (step == null || !Number.isFinite(step) || step <= 0)
    return 1
  if (integerOnly && !Number.isInteger(step))
    return 1
  return step
}

interface SteppedValueOptions {
  currentValue: number | null
  direction: NumberStepDirection
  min: number | null
  max: number | null
  step: number | null | undefined
  integerOnly: boolean
}

/**
 * 按步长网格走一格：以 min 为起点对齐，先取整再夹到范围内。
 */
function steppedValue(options: SteppedValueOptions): number | null {
  const { currentValue, direction, min, max, step, integerOnly } = options
  const stride = effectiveStep(step, integerOnly)
  const stepBase = min != null && (!integerOnly || Number.isInteger(min)) ? min : 0

  let nextValue: number
  if (currentValue == null) {
    nextValue = direction === 1 ? (min ?? 0) : (max ?? 0)
    if (integerOnly)
      nextValue = direction === 1 ? Math.ceil(nextValue) : Math.floor(nextValue)
  }
  else {
    const stepPosition = (currentValue - stepBase) / stride
    const tolerance = Number.EPSILON * Math.max(1, Math.abs(stepPosition)) * 4
    const nextStepPosition = direction === 1
      ? Math.floor(stepPosition + tolerance) + 1
      : Math.ceil(stepPosition - tolerance) - 1
    nextValue = stepBase + nextStepPosition * stride
  }

  const precision = Math.min(12, Math.max(decimalPlaces(stride), decimalPlaces(stepBase)))
  nextValue = Number(nextValue.toFixed(precision))

  // 先取整再夹范围：比步长更精细的边界不能被舍入掉。
  if (min != null)
    nextValue = Math.max(min, nextValue)
  if (max != null)
    nextValue = Math.min(max, nextValue)

  if (!Number.isFinite(nextValue))
    return currentValue
  if (integerOnly && !Number.isInteger(nextValue))
    return currentValue
  return Object.is(nextValue, -0) ? 0 : nextValue
}

/**
 * 数字输入框逻辑：步进、范围限制、整数限制、键盘增减。
 */
export function useNumberField(options: UseNumberFieldOptions): NumberField {
  const { value, onChange } = options
  const readMin = (): number | null => toValue(options.min) ?? null
  const readMax = (): number | null => toValue(options.max) ?? null
  const readStep = (): number | null | undefined => toValue(options.step)
  const readDisabled = (): boolean => Boolean(toValue(options.disabled))
  const readReadOnly = (): boolean => Boolean(toValue(options.readOnly))
  const readIntegerOnly = (): boolean => Boolean(toValue(options.integerOnly))
  const locked = (): boolean => readDisabled() || readReadOnly()

  function nextValue(direction: NumberStepDirection): number | null {
    return steppedValue({
      currentValue: value.value,
      direction,
      min: readMin(),
      max: readMax(),
      step: readStep(),
      integerOnly: readIntegerOnly(),
    })
  }

  const canIncrement = computed(() => nextValue(1) !== value.value)
  const canDecrement = computed(() => nextValue(-1) !== value.value)

  function step(direction: NumberStepDirection): boolean {
    if (locked())
      return false
    const next = nextValue(direction)
    if (next == null || next === value.value)
      return false
    onChange(next)
    return true
  }

  function increment(): void {
    step(1)
  }

  function decrement(): void {
    step(-1)
  }

  function clamp(val: number, integerOnly: boolean): number {
    const rawMin = readMin()
    const rawMax = readMax()
    // 整数模式下边界也取整，否则会把小数边界当成可提交的值
    const min = rawMin == null ? null : (integerOnly ? Math.ceil(rawMin) : rawMin)
    const max = rawMax == null ? null : (integerOnly ? Math.floor(rawMax) : rawMax)
    let clamped = val
    if (min != null)
      clamped = Math.max(min, clamped)
    if (max != null)
      clamped = Math.min(max, clamped)
    return clamped
  }

  function setValue(val: number | null): void {
    if (readDisabled())
      return
    if (val === null) {
      onChange(null)
      return
    }
    const integerOnly = readIntegerOnly()
    const bounded = clamp(val, integerOnly)
    // 整数模式下小数不提交，保持上一个值
    if (integerOnly && !Number.isInteger(bounded))
      return
    onChange(Object.is(bounded, -0) ? 0 : bounded)
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (locked())
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

  // 外部传入的值跑出范围时拉回来
  watch(value, (val) => {
    if (val == null)
      return
    const bounded = clamp(val, readIntegerOnly())
    if (bounded !== val)
      onChange(Object.is(bounded, -0) ? 0 : bounded)
  })

  return {
    canDecrement,
    canIncrement,
    decrement,
    increment,
    onKeyDown,
    setValue,
    step,
  }
}
