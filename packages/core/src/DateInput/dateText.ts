import type { FieldStatusInput } from '../Field/types.js'
import type { DateInputFormat, DateInputStatus } from './types.js'
import { formatInstant } from '../Timestamp/formatInstant.js'

/** 本地日期写成 `YYYY-MM-DD`。 */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 读 `YYYY-M-D` 形式的文字。不是真实存在的日子就返回 `null`。 */
export function parseTypedDate(text: string): Date | null {
  const match = text.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!match)
    return null
  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (Number.isNaN(date.getTime()) || date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day))
    return null
  return date
}

/** 已提交日期的显示文字。 */
export function formatCommittedDate(date: Date | null | undefined, format: DateInputFormat | undefined, locale: string): string {
  if (!date)
    return ''
  const iso = toIsoDate(date)
  if (typeof format === 'function')
    return format(iso)
  if (format === 'system_date')
    return iso
  return formatInstant(date, format ?? 'date_long', locale)
}

/** 把字符串写法的状态展开成 `{ type }`，`default` 当作没有状态。 */
export function resolveDateStatus(status: DateInputStatus | undefined): FieldStatusInput | undefined {
  if (status == null || status === 'default')
    return undefined
  if (typeof status === 'string')
    return { type: status }
  return status
}
