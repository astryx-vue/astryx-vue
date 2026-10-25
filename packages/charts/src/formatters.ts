/**
 * 数字、货币、百分比和日期的格式化函数。
 *
 * 三条约定：
 * - 不好看的值原样返回。非有限数（NaN、±Infinity）和读不出数字的字符串不加工，
 *   免得出现「InfinityB」这类垃圾；任何输入都不抛错。
 * - 数字和日期都交给带缓存的 `Intl` 格式化器，所以输出跟随语言，进位也正确。
 * - 日期按格里高利历输出。有些语言（如 `fa-IR`、`th-TH`）默认用别的历法，
 *   不指定就会变成波斯历数字或佛历年份。
 */

/** 一种 BCP 47 语言标签，例如 `'en-US'`、`'de-DE'`。 */
export type ChartLocale = string

/** 每个语言只建一次格式化器，之后复用。 */
function byLocale<T>(create: (locale: ChartLocale | undefined) => T): (locale: ChartLocale | undefined) => T {
  const cache = new Map<ChartLocale | undefined, T>()
  return (locale) => {
    let value = cache.get(locale)
    if (value === undefined) {
      value = create(locale)
      cache.set(locale, value)
    }
    return value
  }
}

const getCompactFormat = byLocale(
  locale => new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }),
)

const getPercentFormat = byLocale(
  locale => new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  }),
)

const getShortDateFormat = byLocale(
  locale => new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    calendar: 'gregory',
  }),
)

const getMonthYearFormat = byLocale(
  locale => new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    calendar: 'gregory',
  }),
)

const getListFormat = byLocale(
  locale => new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }),
)

/** 按语言把几个词连成「甲、乙和丙」这样的并列短语。 */
export function formatList(values: readonly string[], locale: ChartLocale): string {
  return getListFormat(locale).format(values)
}

/**
 * 缩写数字：`1200` → 「1.2K」，`1500000` → 「1.5M」，`1e12` → 「1T」。
 *
 * 读不成有限数的值原样返回，所以可以直接拿它当坐标轴刻度格式化器。
 */
export function compactNumber(value: unknown, locale: ChartLocale): string {
  const n = Number(value)
  if (!Number.isFinite(n))
    return String(value)
  return getCompactFormat(locale).format(n)
}

/**
 * 生成货币格式化函数。
 *
 * 负号的顺序是「符号在前、货币符号在后」，所以负数读作「-$1.5K」而不是「$-1.5K」。
 * 一千以上用缩写，一千以内用带千分位的普通数字。
 *
 * @example
 * ```
 * currency('$', locale)(1500)  // $1.5K
 * currency('€', locale)(12)    // €12
 * ```
 */
export function currency(symbol = '$', locale?: ChartLocale): (value: unknown) => string {
  return (value: unknown) => {
    const n = Number(value)
    if (!Number.isFinite(n))
      return String(value)
    const sign = n < 0 ? '-' : ''
    const abs = Math.abs(n)
    const body = abs >= 1000
      ? getCompactFormat(locale).format(abs)
      : abs.toLocaleString(locale)
    return `${sign}${symbol}${body}`
  }
}

/**
 * 百分比格式化：`0.45` → 「45%」，`1.2` → 「120%」，`0.005` → 「0.5%」。
 *
 * 入参是比例，不是百分数。整数百分比不显示小数位，其余最多一位。
 */
export function percent(value: unknown, locale: ChartLocale): string {
  const n = Number(value)
  if (!Number.isFinite(n))
    return String(value)
  return getPercentFormat(locale).format(n)
}

/**
 * 把值转成 Date，转不了就返回一个无效 Date，让调用方原样返回原值。
 *
 * 接受 `Date`、毫秒时间戳（数字或纯数字字符串）、日期字符串（ISO 8601、RFC 2822 等）。
 *
 * 只有年月日的字符串（`YYYY-MM-DD`）按本地零点构造，而不是规范里的 UTC 零点，
 * 这样在负时区里格式化出来还是同一天（`"2024-01-05"` 不会变成 1 月 4 日）。
 */
function toDate(value: unknown): Date {
  if (value instanceof Date)
    return value
  if (typeof value === 'number')
    return new Date(value)
  if (typeof value === 'string') {
    const s = value.trim()
    if (s === '')
      return new Date(Number.NaN)

    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
    if (dateOnly) {
      const year = Number(dateOnly[1])
      const month = Number(dateOnly[2])
      const day = Number(dateOnly[3])
      const local = new Date(year, month - 1, day)
      // 越界的日期（如 "2024-02-31"）会被 Date 构造器悄悄滚到下个月，
      // 这里判成无效，让原值原样返回。
      if (
        local.getFullYear() !== year
        || local.getMonth() !== month - 1
        || local.getDate() !== day
      ) {
        return new Date(Number.NaN)
      }
      return local
    }

    const asNumber = Number(s)
    return new Date(Number.isFinite(asNumber) ? asNumber : s)
  }
  return new Date(Number.NaN)
}

/** 短日期，例如「Jan 5」「Mar 12」。 */
export function shortDate(value: unknown, locale: ChartLocale): string {
  const d = toDate(value)
  if (Number.isNaN(d.getTime()))
    return String(value)
  return getShortDateFormat(locale).format(d)
}

/** 年月，例如「Jan 2024」「Mar 2025」。 */
export function monthYear(value: unknown, locale: ChartLocale): string {
  const d = toDate(value)
  if (Number.isNaN(d.getTime()))
    return String(value)
  return getMonthYearFormat(locale).format(d)
}
