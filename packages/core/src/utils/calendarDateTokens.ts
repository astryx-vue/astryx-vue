import type { CalendarDateLexicon } from './calendarDateLexicon.js'
import { unicodeRegExp } from './unicodeRegExp.js'

/** 日期文字切成的词：数字、月份名、纪元、闰月标记、别的词和分隔符。 */
export type Token
  = | { readonly t: 'num', readonly v: string, readonly isAlias?: boolean }
    | { readonly t: 'month', readonly keys: ReadonlySet<string>, readonly isWeekday?: boolean }
    | { readonly t: 'monthNum', readonly v: string, readonly isLeap: boolean }
    | { readonly t: 'era', readonly code: string, readonly isWeekday?: boolean }
    | { readonly t: 'leap' }
    | { readonly t: 'word', readonly isYearMarker?: boolean }
    | { readonly t: 'sep', readonly v: string }

export type NumToken = Extract<Token, { t: 'num' }>
export type Tokens = Token[] | 'incomplete' | 'unreadable'

const LETTER = unicodeRegExp('[\\p{L}\\p{M}]')
const SEPARATOR = unicodeRegExp('[\\p{P}\\p{S}]')
const NOT_WORDS = unicodeRegExp('[\\d\\p{P}\\p{S}]+', 'gu')
// 词与词之间不写空格的文字：名字可能紧挨着下一个词，匹配时不要求词边界。
const SPACELESS = unicodeRegExp('[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Hangul}\\p{Script=Thai}\\p{Script=Lao}\\p{Script=Khmer}\\p{Script=Myanmar}]')

export function tokenize(s: string, lex: CalendarDateLexicon, isDigitNameRead = true): Tokens {
  const out: Token[] = []
  let hasDigitName = false
  let i = 0
  const end = s.trimEnd().length
  while (i < end) {
    const ch = s[i]!
    if (/\s/.test(ch)) {
      i++
      continue
    }
    const template = matchTemplate(s, i, lex)
    if (template != null) {
      out.push(template.token)
      i = template.end
      continue
    }
    const digitName = isDigitNameRead && /\d/.test(ch) && matchWord(s, i, lex)
    if (digitName) {
      out.push(wordToken(digitName, lex))
      hasDigitName = true
      i += digitName.length
      continue
    }
    if (/\d/.test(ch)) {
      let j = i
      while (j < s.length && /\d/.test(s[j]!))
        j++
      out.push({ t: 'num', v: s.slice(i, j) })
      i = j
      continue
    }
    const word = matchWord(s, i, lex)
    if (word != null) {
      out.push(wordToken(word, lex))
      i += word.length
      continue
    }
    if (SEPARATOR.test(ch)) {
      let j = i
      while (j < end && (SEPARATOR.test(s[j]!) || /\s/.test(s[j]!)))
        j++
      out.push({ t: 'sep', v: s.slice(i, j).replace(/\s+/g, '') })
      i = j
      continue
    }
    let j = i
    while (j < end && LETTER.test(s[j]!))
      j++
    const run = s.slice(i, j)
    const joined = matchJoinedWord(s, i, lex)
    if (joined != null) {
      out.push(wordToken(joined, lex))
      i += joined.length
      continue
    }
    const keys = monthByPrefix(run, lex)
    if (keys != null) {
      out.push({ t: 'month', keys })
      i = j
      continue
    }
    if (j >= end && run && lex.vocabulary.some(w => w.startsWith(run)))
      return 'incomplete'
    return 'unreadable'
  }
  // 拉脱维亚语的 "1. adars" 是一个月名，也是 "adars" 月 1 日。没有别的数字能当日子时它是日子。
  // 年份字前面的数字（"26. g."）是年份。
  const canBeDay = (token: Token, k: number): boolean => {
    const next = out.slice(k + 1).find(t => t.t !== 'sep')
    const isYear = next?.t === 'word' && next.isYearMarker === true
    return token.t === 'num' && Number(token.v) <= 31 && !isYear
  }
  if (hasDigitName && !out.some(canBeDay))
    return tokenize(s, lex, false)
  return out
}

function matchTemplate(s: string, i: number, lex: CalendarDateLexicon): { token: Token, end: number } | null {
  for (const template of lex.monthTemplates) {
    if (!s.startsWith(template.pre, i))
      continue
    const digits = /^\d+/.exec(s.slice(i + template.pre.length))
    if (digits == null)
      continue
    const after = i + template.pre.length + digits[0].length
    if (template.post && !s.startsWith(template.post, after))
      continue
    if (!template.post && !template.pre)
      continue
    return { token: { t: 'monthNum', v: digits[0], isLeap: template.isLeap }, end: after + template.post.length }
  }
  return null
}

/** 在 `i` 处最长的、结尾处可以断词的已知词。 */
function matchWord(s: string, i: number, lex: CalendarDateLexicon): string | null {
  for (const word of lex.vocabulary) {
    if (!s.startsWith(word, i))
      continue
    const next = s[i + word.length] ?? ''
    const last = word[word.length - 1]!
    if (!LETTER.test(next) || SPACELESS.test(next) || SPACELESS.test(last) || !LETTER.test(last))
      return word
  }
  return null
}

/** 和下一个词连写的已知词，例如月份名前的希伯来文 ב，或者月份名后的闰月记号（"Eighth Monthbis"）。 */
function matchJoinedWord(s: string, i: number, lex: CalendarDateLexicon): string | null {
  for (const word of lex.vocabulary) {
    if (s.startsWith(word, i) && lex.vocabulary.some(w => s.startsWith(w, i + word.length)))
      return word
  }
  return null
}

function wordToken(word: string, lex: CalendarDateLexicon): Token {
  const isWeekday = lex.weekdays.has(word.replace(NOT_WORDS, ''))
  const keys = lex.months.get(word)
  if (keys != null)
    return { t: 'month', keys, isWeekday }
  const era = lex.eras.get(word)
  if (era != null)
    return { t: 'era', code: era, isWeekday }
  if (lex.leapMarkers.has(word))
    return { t: 'leap' }
  const alias = lex.yearAliases.get(word)
  if (alias != null)
    return { t: 'num', v: alias, isAlias: true }
  return { t: 'word', isYearMarker: lex.yearMarkers.has(word) }
}

function sameKeys(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  return a.size === b.size && [...a].every(key => b.has(key))
}

/** 打了一个月份名的开头，而且只有一个月份名这样开头时，就是那个月。 */
function monthByPrefix(run: string, lex: CalendarDateLexicon): ReadonlySet<string> | null {
  if (run.length < 3)
    return null
  let found: ReadonlySet<string> | null = null
  for (const [name, keys] of lex.months) {
    if (name.startsWith(run)) {
      if (found != null && !sameKeys(found, keys))
        return null
      found = keys
    }
  }
  return found
}

/** 星期几的词也可能是月份名或纪元名（法语 "mar."）。文字里还有别的月份或纪元时，第一个这样的词是星期几。 */
export function weekdaysAsWords(tokens: Token[]): Token[] {
  let out = tokens
  for (const kinds of [['month', 'monthNum'], ['era']]) {
    const named = out.filter(t => kinds.includes(t.t))
    const weekday = named.find(t => 'isWeekday' in t && t.isWeekday)
    if (named.length > 1 && weekday != null)
      out = out.map(t => (t === weekday ? { t: 'word' } : t))
  }
  return out
}

/** 数字之间的分隔符是不是同一种。语言自己的数字写法里的两种分隔符也算一种，例如印地语佛历的 "1/1`/2443"。 */
export function sameSeparators(tokens: Token[], lex: CalendarDateLexicon): boolean {
  let previous: string | null = null
  let seenNumber = false
  let pending: string | null = null
  for (const token of tokens) {
    if (token.t === 'num') {
      if (seenNumber) {
        const separator = pending ?? ''
        if (previous != null && separator !== previous && !(lex.separators.has(separator) && lex.separators.has(previous)))
          return false
        previous = separator
      }
      seenNumber = true
      pending = null
    }
    else if (token.t === 'sep') {
      pending = token.v
    }
    else {
      pending = null
      seenNumber = false
      previous = null
    }
  }
  return true
}

export function lastNumber(tokens: Token[]): Token | undefined {
  const last = tokens.filter(token => token.t !== 'sep').at(-1)
  return last?.t === 'num' ? last : undefined
}
