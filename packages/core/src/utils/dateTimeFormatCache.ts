/** Options that print a time of day or a zone, which a PlainDate lacks. */
export const TIME_OF_DAY_FIELDS = [
  'timeZoneName',
  'hour',
  'minute',
  'second',
  'fractionalSecondDigits',
  'dayPeriod',
  'timeStyle',
] as const satisfies ReadonlyArray<keyof Intl.DateTimeFormatOptions>

/**
 * One `Intl.DateTimeFormat` per locale and options, built on first use. A
 * calendar formats each of a month's 42 day labels with the same options on
 * every render, and building a formatter costs far more than using one. The
 * options are keyed in a fixed order, so the same options written in another
 * order share a formatter.
 */
const dateTimeFormats = new Map<string, Intl.DateTimeFormat>()

/** @internal */
export function dateTimeFormatFor(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = JSON.stringify([
    locale,
    Object.entries(options).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  ])
  let format = dateTimeFormats.get(key)
  if (format == null) {
    format = new Intl.DateTimeFormat(locale, options)
    dateTimeFormats.set(key, format)
  }
  return format
}
