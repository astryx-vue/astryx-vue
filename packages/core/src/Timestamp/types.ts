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
  /**
   * 绝对格式所用的 IANA 时区，如 `'UTC'`、`'America/Los_Angeles'`。不写（或写 `'local'`）就是观看者自己的时区。
   * 写明时区后，服务端和浏览器写出同一段文字，是显示绝对时间又不想水合不一致的办法；
   * 不写则服务端的文字取决于服务端所在的时区。相对格式不指向具体时刻，它显示的文字不受影响，
   * `tooltipEntries` 里没写 `timezoneID` 的行仍然跟随它。不认识的标识在开发期警告一次，回到观看者的时区。
   */
  timezoneID?: string
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
