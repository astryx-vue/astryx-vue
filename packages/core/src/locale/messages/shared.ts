export function clearLabel(label: string | undefined, fallback: string, prefix: string): string {
  return label != null && label !== '' ? `${prefix}${label}` : fallback
}

const numberFormats = new Map<string, Intl.NumberFormat>()

/**
 * 按语言给数字加千分位，对应原版 ICU 里的 `{count, number}`。
 * 内置文案只有 `en` 和 `zh-CN`，两者都写成 `1,234`。
 */
export function formatCount(value: number, locale: 'en' | 'zh-CN'): string {
  let format = numberFormats.get(locale)
  if (format == null) {
    format = new Intl.NumberFormat(locale)
    numberFormats.set(locale, format)
  }
  return format.format(value)
}

/** 英文单复数：1 用单数，其余用复数，和原版 `plural, one {…} other {…}` 一致。 */
export function englishPlural(count: number, one: string, other: string): string {
  return count === 1 ? one : other
}
