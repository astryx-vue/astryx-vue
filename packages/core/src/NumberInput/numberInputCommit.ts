import { parseLocaleNumber } from './numberParser.js'

interface NumberInputValidationOptions {
  min?: number | null
  max?: number | null
  isIntegerOnly?: boolean
  locale?: string
}

export type NumberInputCommitDecision
  = | { type: 'commit', value: number, didClamp: boolean }
    | { type: 'clear' }
    | { type: 'revert' }

function parseNumericInput(
  input: string,
  options: Pick<NumberInputValidationOptions, 'isIntegerOnly' | 'locale'>,
): number | null {
  const trimmed = input.trim()
  if (trimmed === '')
    return null

  const value = parseLocaleNumber(trimmed, options.locale)
  if (value == null || !Number.isFinite(value))
    return null
  if (options.isIntegerOnly && !Number.isInteger(value))
    return null
  return value
}

/** 草稿在范围内才算有效。超出范围返回 null，输入过程中用来标成无效。 */
export function parseNumberInput(input: string, options: NumberInputValidationOptions): number | null {
  const value = parseNumericInput(input, options)
  if (value === null)
    return null
  if (options.min != null && value < options.min)
    return null
  if (options.max != null && value > options.max)
    return null
  return value
}

/**
 * 整段草稿只在离开或按 Enter 时做一次决定。
 * 空草稿：有清除按钮就清空，否则回到原值。
 * 读不出来就回到原值，不把前面几个数字先交上去。
 * 超出范围收到最近的边界。
 */
export function resolveNumberInputCommit(
  input: string,
  options: NumberInputValidationOptions & { hasClear: boolean },
): NumberInputCommitDecision {
  if (input.trim() === '')
    return options.hasClear ? { type: 'clear' } : { type: 'revert' }

  const value = parseNumericInput(input, options)
  if (value === null)
    return { type: 'revert' }

  const min = options.min == null ? null : (options.isIntegerOnly ? Math.ceil(options.min) : options.min)
  const max = options.max == null ? null : (options.isIntegerOnly ? Math.floor(options.max) : options.max)
  if (min != null && max != null && min > max)
    return { type: 'revert' }

  const committedValue = min != null && value < min ? min : max != null && value > max ? max : value
  return {
    type: 'commit',
    value: committedValue,
    didClamp: committedValue !== value,
  }
}
