import type { DateTimeRangePart } from './types.js'

const SECONDS_BY_UNIT = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
  year: 31536000,
} as const

/** 把绝对、当前和相对的区间端点折成同一时刻上的 Unix 秒。 */
export function resolveDateTimeRangePart(part: DateTimeRangePart, nowSeconds = Date.now() / 1000): number {
  switch (part.type) {
    case 'NOW':
      return Math.floor(nowSeconds)
    case 'ABSOLUTE':
      return part.unixSeconds
    case 'RELATIVE':
      return Math.floor(nowSeconds - part.backValue * SECONDS_BY_UNIT[part.unit])
  }
}
