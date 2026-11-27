import type { PowerSearchSheetMessages } from '../locale/messages/power-search-sheet.js'
import type { DateRelativeOperatorValue } from './types.js'

export interface RelativeDateOption {
  readonly value: string
  readonly label: string
}

type RelativeLabel = keyof Pick<
  PowerSearchSheetMessages,
  'relativeDaysAgo' | 'relativeDaysFromNow' | 'relativeWeeksAgo' | 'relativeWeeksFromNow' | 'relativeMonthsAgo' | 'relativeMonthsFromNow'
>

const RELATIVE_DATE_UNITS: ReadonlyArray<{
  unit: 'day' | 'week' | 'month'
  amounts: readonly number[]
  ago: RelativeLabel
  fromNow: RelativeLabel
}> = [
  { unit: 'day', amounts: [1, 3, 7, 14, 30], ago: 'relativeDaysAgo', fromNow: 'relativeDaysFromNow' },
  { unit: 'week', amounts: [1, 2, 4], ago: 'relativeWeeksAgo', fromNow: 'relativeWeeksFromNow' },
  { unit: 'month', amounts: [1, 3, 6, 12], ago: 'relativeMonthsAgo', fromNow: 'relativeMonthsFromNow' },
]

/**
 * 相对日期运算符提供的选项，按显示顺序排列。桌面浮层的 Selector 和底部弹层的单选行共用这一份，
 * 两边列出的值一样。值写成 `3d_ago`、`2w_from_now` 这种形式；`isPastAllowed` / `isFutureAllowed`
 * 写 false 时去掉对应方向的选项。
 */
export function buildRelativeDateOptions(
  operatorValue: Pick<DateRelativeOperatorValue, 'isPastAllowed' | 'isFutureAllowed'>,
  messages: PowerSearchSheetMessages,
): RelativeDateOption[] {
  const options: RelativeDateOption[] = []
  for (const { unit, amounts, ago, fromNow } of RELATIVE_DATE_UNITS) {
    for (const amount of amounts) {
      if (operatorValue.isPastAllowed !== false)
        options.push({ value: `${amount}${unit[0]}_ago`, label: messages[ago](amount) })
      if (operatorValue.isFutureAllowed !== false)
        options.push({ value: `${amount}${unit[0]}_from_now`, label: messages[fromNow](amount) })
    }
  }
  return options
}
