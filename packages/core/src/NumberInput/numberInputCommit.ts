import { parseLocaleNumber } from './numberParser.js'

interface NumberInputValidationOptions {
  min?: number | null
  max?: number | null
  isIntegerOnly?: boolean
  locale?: string
}

/** 草稿为什么提交不了：读不成数字、整数字段里带小数，或者范围里没有任何数能放（`min` 大于 `max`）。 */
export type NumberInputRejection
  = | { kind: 'unreadable' }
    | { kind: 'fractional' | 'outOfRange', value: number }

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

/** 提交时夹到的范围：整数字段把边界往里取整。 */
function resolveCommitRange(options: NumberInputValidationOptions): { min: number | null, max: number | null } {
  return {
    min: options.min == null ? null : (options.isIntegerOnly ? Math.ceil(options.min) : options.min),
    max: options.max == null ? null : (options.isIntegerOnly ? Math.floor(options.max) : options.max),
  }
}

/**
 * 提交不了的草稿的拒绝；能提交的草稿（包括空草稿）返回 null。
 * 超出普通范围的数会被夹到边界，不算拒绝。
 */
export function getNumberInputRejection(input: string, options: NumberInputValidationOptions): NumberInputRejection | null {
  const trimmed = input.trim()
  if (trimmed === '')
    return null
  const value = parseLocaleNumber(trimmed, options.locale)
  if (value == null || !Number.isFinite(value))
    return { kind: 'unreadable' }
  if (options.isIntegerOnly && !Number.isInteger(value))
    return { kind: 'fractional', value }
  const { min, max } = resolveCommitRange(options)
  if (min != null && max != null && min > max)
    return { kind: 'outOfRange', value }
  return null
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

  const { min, max } = resolveCommitRange(options)
  if (min != null && max != null && min > max)
    return { type: 'revert' }

  const committedValue = min != null && value < min ? min : max != null && value > max ? max : value
  return {
    type: 'commit',
    value: committedValue,
    didClamp: committedValue !== value,
  }
}
