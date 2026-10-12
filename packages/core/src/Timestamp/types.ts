import type { TextColor, TextSize, TextType, TextWeight } from '../Text/types.js'
import type { TimestampTooltipEntry } from './tooltipEntries.js'

export type TimestampFormat
  = | 'relative'
    | 'relative_short'
    | 'auto'
    | 'date'
    | 'date_long'
    | 'date_weekday'
    | 'date_time'
    | 'time'
    | 'system_date'
    | 'system_date_time'
    | 'system_time'
    | 'unix_seconds'

export type TimestampColor = TextColor | 'disabled'

export interface TimestampProps {
  value: string | number
  /** @default 'auto' */
  format?: TimestampFormat
  /** Seconds before `auto` switches from relative to date_time. @default 604800 */
  autoThreshold?: number
  /** @default true */
  hasTooltip?: boolean
  tooltipEntries?: readonly TimestampTooltipEntry[]
  /** Append a short zone name to `date_time` and `time`. @default false */
  isTimezoneShown?: boolean
  /** Refresh a relative reading on a live interval. @default false */
  isLive?: boolean
  /** @default 'supporting' */
  type?: TextType
  size?: TextSize
  /** @default 'secondary' */
  color?: TimestampColor
  weight?: TextWeight
}

export type { TimestampTooltipEntry, TimestampTooltipFormat, TimestampTooltipLine } from './tooltipEntries.js'
