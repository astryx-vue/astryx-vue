/** 书写方向。 */
export type TextDirection = 'ltr' | 'rtl'

/**
 * 从右往左书写的语言。运行时拿不到 `Intl.Locale#getTextInfo` 时用它兜底，
 * 例如较老的浏览器和部分测试环境。
 */
const RTL_LANGUAGES = new Set([
  'ar',
  'arc',
  'ckb',
  'dv',
  'fa',
  'he',
  'iw',
  'ji',
  'ks',
  'ku',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
])

interface TextInfo {
  direction?: string
}

interface LocaleWithTextInfo extends Intl.Locale {
  getTextInfo?: () => TextInfo
}

/**
 * 由语言标签推导书写方向。`ar-SA`、`he` 这类语言得到 `rtl`，其余得到 `ltr`。
 * 解析不了的标签按 `ltr` 处理。
 */
export function getLocaleDirection(locale: string): TextDirection {
  const tag = locale.trim()
  if (tag === '')
    return 'ltr'

  let parsed: Intl.Locale
  try {
    parsed = new Intl.Locale(tag)
  }
  catch {
    return 'ltr'
  }

  const readTextInfo = (parsed as LocaleWithTextInfo).getTextInfo
  if (typeof readTextInfo === 'function') {
    const direction = readTextInfo.call(parsed).direction
    if (direction === 'rtl' || direction === 'ltr')
      return direction
  }

  return RTL_LANGUAGES.has(parsed.language.toLowerCase()) ? 'rtl' : 'ltr'
}
