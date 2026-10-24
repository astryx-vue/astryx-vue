/**
 * 把人贴进来的数字读成数值。分组符、小数点、位数和数字字形都从 Intl 来。
 * 读不出来就返回 null，不猜。两种读法都成立时，听当前语言。
 * 分组必须正好符合这个语言自己的组宽：末组等于主组宽，中间组等于次组宽，首组不超过次组宽。
 * 所以 de-DE 的 `1.234` 是 1234，而 `1.2345` 末组太长，句点仍是小数点。
 * 三位数一组的重复分隔符在所有语言里都当分组，`1,234,567` 到处一样。
 * 空格和撇号没有语言拿来当小数点，出现一次就够，en-US 的 `1 234` 是 1234。
 */

interface LocaleNumberSymbols {
  group: string
  decimal: string
  /** 最右边一组有几位。大多数语言是 3。 */
  primaryGroupSize: number
  /** 它左边每一组有几位。en-IN 的十万分组是 2。 */
  secondaryGroupSize: number
}

const symbolsByLocale = new Map<string, LocaleNumberSymbols>()

function getLocaleNumberSymbols(locale: string | undefined): LocaleNumberSymbols {
  const key = locale ?? ''
  let symbols = symbolsByLocale.get(key)
  if (symbols === undefined) {
    let format: Intl.NumberFormat
    try {
      format = new Intl.NumberFormat(locale)
    }
    catch {
      format = new Intl.NumberFormat('en')
    }
    const parts = format.formatToParts(12345.6)
    const groupSizes = format
      .formatToParts(11111111111)
      .filter(part => part.type === 'integer')
      .map(part => part.value.length)
    const hasGrouping = groupSizes.length > 1
    const primary = groupSizes[groupSizes.length - 1]
    const secondary = groupSizes[groupSizes.length - 2]
    symbols = {
      group: (parts.find(part => part.type === 'group')?.value ?? ',').normalize('NFKC'),
      decimal: parts.find(part => part.type === 'decimal')?.value ?? '.',
      primaryGroupSize: hasGrouping && primary != null ? primary : 3,
      secondaryGroupSize: hasGrouping && secondary != null ? secondary : 3,
    }
    symbolsByLocale.set(key, symbols)
  }
  return symbols
}

const DECIMAL_DIGIT = /\p{Nd}/u
const CURRENCY = /\p{Sc}/u
const INVISIBLES = /[\u200B-\u200D\u200E\u200F\u061C\u2066-\u2069\uFEFF]/g
// 连字符放最后，否则在字符类开头会被当成范围。
const MINUS_SIGNS = '\u2212\u2012\u2013-'

/**
 * 语言会写在数字之间的字符。逗号、句点、撇号、空格（NFKC 后归成普通空格）、
 * 阿拉伯小数点和千分位。U+2019 是瑞士写法里常见的撇号。
 * 字母表有边界：连字符不在里面，所以 `123-456-789` 不是数字。
 */
const SEPARATOR_CHARS = ',.\' \u2019\u066B\u066C'
const NUMBER_BODY = new RegExp(`^[0-9${SEPARATOR_CHARS}]+$`)
/** 没有分组、最多一个句点，也就是 `Number()` 能直接读的样子。 */
const MACHINE_NUMBER = /^(?:\d+(?:\.\d*)?|\.\d+)$/

/** 十进制数字的数值。每种数字从 0 起连续排，往回找到 0 即可。 */
function digitValue(char: string): number | null {
  const codePoint = char.codePointAt(0)
  if (codePoint == null)
    return null
  for (let zero = codePoint; codePoint - zero < 10; zero--) {
    if (!DECIMAL_DIGIT.test(String.fromCodePoint(zero - 1)))
      return codePoint - zero
  }
  return null
}

function toAsciiDigits(text: string): string | null {
  let out = ''
  for (const char of text) {
    if (!DECIMAL_DIGIT.test(char)) {
      out += char
      continue
    }
    const value = digitValue(char)
    if (value == null)
      return null
    out += String(value)
  }
  return out
}

/**
 * 按一种读法把数字和分隔符收成机器数字。不成组就返回 null。
 * `minGroups` 是至少要看到几个分组符，才相信它是分组而不是小数点。
 */
function readUnder(
  core: string,
  group: string,
  decimal: string,
  primaryGroupSize: number,
  secondaryGroupSize: number,
  minGroups: number,
): string | null {
  let intText = core
  let fracText: string | null = null

  if (decimal !== '' && core.includes(decimal)) {
    const at = core.indexOf(decimal)
    if (core.includes(decimal, at + decimal.length))
      return null
    intText = core.slice(0, at)
    fracText = core.slice(at + decimal.length)
    if (!/^\d*$/.test(fracText))
      return null
  }

  let digits: string
  if (group !== '' && intText.includes(group)) {
    const chunks = intText.split(group)
    if (chunks.length - 1 < minGroups || !chunks.every(chunk => /^\d+$/.test(chunk)))
      return null
    const first = chunks[0] ?? ''
    const last = chunks[chunks.length - 1] ?? ''
    if (last.length !== primaryGroupSize || first.length > secondaryGroupSize)
      return null
    for (let index = 1; index < chunks.length - 1; index++) {
      if ((chunks[index] ?? '').length !== secondaryGroupSize)
        return null
    }
    digits = chunks.join('')
  }
  else {
    if (!/^\d*$/.test(intText))
      return null
    digits = intText
  }

  if (digits === '' && (fracText == null || fracText === ''))
    return null
  return fracText == null ? digits : `${digits}.${fracText}`
}

/** 没有语言拿来当小数点的分隔符。出现一次、组宽正确，就可以当分组。 */
function isGroupOnlySeparator(separator: string): boolean {
  return /^[\s'\u2019]$/.test(separator)
}

function toPlainNumber(core: string, locale: string | undefined): string | null {
  if (!NUMBER_BODY.test(core))
    return null

  const { group, decimal, primaryGroupSize, secondaryGroupSize } = getLocaleNumberSymbols(locale)
  const inLocale = readUnder(core, group, decimal, primaryGroupSize, secondaryGroupSize, 1)
  if (inLocale != null)
    return inLocale

  // 当前语言读不了的句点，再按机器数字试一次。`1.234` 在 de-DE 已经按分组读走了，到不了这里。
  if (MACHINE_NUMBER.test(core))
    return core

  // 同一个分隔符重复、每组三位，只能是分组。这样从表格贴进另一种语言也能读。
  const separators = [...new Set(core.replace(/\d/g, ''))]
  if (separators.length === 0 || separators.length > 2)
    return null
  for (const candidate of separators) {
    const occurrences = core.split(candidate).length - 1
    const minGroups = isGroupOnlySeparator(candidate) ? 1 : 2
    if (occurrences < minGroups)
      continue
    const other = separators.find(item => item !== candidate) ?? ''
    if (other !== '' && core.split(other).length - 1 !== 1)
      continue
    const read = readUnder(core, candidate, other, 3, 3, minGroups)
    if (read != null)
      return read
  }
  return null
}

function stripCurrency(text: string): string {
  let out = text.trim()
  if (CURRENCY.test(out.charAt(0)))
    out = out.slice(1).trim()
  if (CURRENCY.test(out.charAt(out.length - 1)))
    out = out.slice(0, -1).trim()
  return out
}

/**
 * 按 `locale` 的写法读一个数字：分组、小数点、数字字形、可选的货币符号，以及表格贴出来的样子。
 * 读不出就返回 null。`123-456-789` 不是数字。
 */
export function parseLocaleNumber(text: string, locale?: string): number | null {
  const normalized = toAsciiDigits(text.normalize('NFKC').replace(INVISIBLES, ''))
  if (normalized == null)
    return null

  let rest = normalized.trim()
  let sign = 1

  // 表格把负数写成 (1,234)。
  const accounting = /^\((.*)\)$/s.exec(rest)
  if (accounting) {
    sign = -1
    rest = (accounting[1] ?? '').trim()
  }

  rest = stripCurrency(rest)

  let hasWrittenSign = false
  const leadingSign = new RegExp(`^([+${MINUS_SIGNS}])\\s*`).exec(rest)
  if (leadingSign) {
    hasWrittenSign = true
    sign = leadingSign[1] === '+' ? sign : -sign
    rest = rest.slice(leadingSign[0].length)
  }
  else {
    const trailingSign = new RegExp(`\\s*([+${MINUS_SIGNS}])$`).exec(rest)
    if (trailingSign) {
      hasWrittenSign = true
      sign = trailingSign[1] === '+' ? sign : -sign
      rest = rest.slice(0, rest.length - trailingSign[0].length)
    }
  }

  // 括号已经表示负数，里面再写符号就有两种读法。
  if (accounting && hasWrittenSign)
    return null

  rest = stripCurrency(rest)

  let exponent = 0
  const exponentMatch = /\s*e\s*([+-]?\d+)$/i.exec(rest)
  if (exponentMatch) {
    exponent = Number(exponentMatch[1])
    rest = rest.slice(0, rest.length - exponentMatch[0].length)
  }

  const core = rest.trim()
  if (core === '')
    return null

  const plain = toPlainNumber(core, locale)
  if (plain == null)
    return null

  const magnitude = Number(plain)
  if (!Number.isFinite(magnitude))
    return null

  // 1.23 * 1e3 在二进制里是 1229.9999999999998，提交这个数就没把 1230 读回来。
  const scaled = exponent === 0 ? magnitude : Number((magnitude * 10 ** exponent).toPrecision(15))
  if (!Number.isFinite(scaled))
    return null
  const result = sign * scaled
  return Object.is(result, -0) ? 0 : result
}

/** 聚焦时显示的文字：机器数字，只把小数点换成当前语言的。 */
export function formatEditableNumber(value: number, locale?: string): string {
  const { decimal } = getLocaleNumberSymbols(locale)
  const raw = String(value)
  return decimal === '.' ? raw : raw.replace('.', decimal)
}
