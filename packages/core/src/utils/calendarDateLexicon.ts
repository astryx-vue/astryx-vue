import type { DateField } from './calendarDateIntl.js'
import type { CalendarSystem } from './calendarSystem.js'
import type { PlainDate } from './plainDate.js'
import {
  calendarEraYear,
  calendarYearOf,
  displayOptions,
  fieldOrder,
  LONG,
  LUNISOLAR,
  normalizeDateText,
  NUMERIC,
  partsOf,
  partType,
  textCalendar,
} from './calendarDateIntl.js'
import {
  calendarAddMonths,
  calendarMonthFromYearMonth,
  calendarMonthKey,
  calendarMonthLabelDay,
  calendarMonthsInCalendarYear,
  isGregorianAligned,
} from './calendarSystem.js'
import { SHARED_DATE_FORMAT_OPTIONS } from './plainDate.js'
import { unicodeRegExp } from './unicodeRegExp.js'

/**
 * 一种语言在一种历法里怎么写日期，全部从 `Intl` 学来：字段顺序、月份名、纪元名、
 * 闰月记号、分隔符、星期几（读的时候跳过）。第一次用到时建好并缓存。
 *
 * 月份用「月份键」认：同一个月每年都一样的名字，见 `calendarMonthKey`。
 */

/** 纪元年怎么换成公历年：`base` 是纪元元年之前（倒数的纪元是之后）那一年。 */
export interface EraArithmetic {
  readonly base: number
  readonly isForward: boolean
}

/** 带前后缀的月份数字，例如 "11月"、"윤6"。 */
export interface MonthTemplate {
  readonly pre: string
  readonly post: string
  readonly isLeap: boolean
}

export interface CalendarDateLexicon {
  readonly locale: string
  readonly calendar: CalendarSystem
  /** 纯数字写法的字段顺序。 */
  readonly order: ReadonlyArray<DateField>
  /** 带月份名写法的字段顺序。 */
  readonly nameOrder: ReadonlyArray<DateField>
  /** 归一后的月份名 → 它可能指的月份键。 */
  readonly months: ReadonlyMap<string, ReadonlySet<string>>
  readonly monthTemplates: ReadonlyArray<MonthTemplate>
  readonly leapMarkers: ReadonlySet<string>
  /** 归一后的纪元名 → 纪元代码。 */
  readonly eras: ReadonlyMap<string, string>
  /** 写成文字的年份，例如日语的「元」年。 */
  readonly yearAliases: ReadonlyMap<string, string>
  /** 日期末尾可以跟的标点，例如 "." 。 */
  readonly trailers: ReadonlySet<string>
  /** 跟在年份后面的字，例如 "年"、"g." 。 */
  readonly yearMarkers: ReadonlySet<string>
  /** 纯数字写法用到的分隔符。 */
  readonly separators: ReadonlySet<string>
  readonly weekdays: ReadonlySet<string>
  /** 所有认识的词，长的在前。 */
  readonly vocabulary: ReadonlyArray<string>
  readonly vocabularySet: ReadonlySet<string>
  /** 打进来的月份数字是月份在那一年里的序号（希伯来历），而不是月份键的数字（农历）。 */
  readonly isNumericMonthOrdinal: boolean
  readonly eraArithmetic: ReadonlyMap<string, EraArithmetic>
}

const YEAR_ONLY_SAMPLE_YEAR = 2026
const LONG_WITH_ERA: Intl.DateTimeFormatOptions = { ...LONG, era: 'long' }
const LONG_WITH_WEEKDAY: Intl.DateTimeFormatOptions = { ...LONG, weekday: 'short' }
const ERA_WIDTHS: Readonly<Record<string, Intl.DateTimeFormatOptions>> = {
  long: { era: 'long', year: 'numeric' },
  short: { era: 'short', year: 'numeric' },
  narrow: { era: 'narrow', year: 'numeric' },
}
const WEEKDAY_FORMATS: ReadonlyArray<Intl.DateTimeFormatOptions> = [
  { weekday: 'long' },
  { weekday: 'short' },
  { ...LONG, weekday: 'long' },
  { ...LONG, weekday: 'short' },
]
const MONTH_WIDTHS: ReadonlyArray<Intl.DateTimeFormatOptions> = [
  LONG,
  { year: 'numeric', month: 'short', day: 'numeric' },
  NUMERIC,
  { month: 'long' },
  { month: 'short' },
]
const LETTER = unicodeRegExp('[\\p{L}\\p{M}]')
const ONLY_SEPARATORS = unicodeRegExp('^[\\p{P}\\p{S}]+$')
const NOT_WORDS = unicodeRegExp('[\\d\\p{P}\\p{S}]+', 'gu')

/** 每个纪元里的一个公历日期。名字从 `Intl` 读，代码是 ECMA-402 的纪元标识。 */
const ERA_SAMPLES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  'gregory': { ce: '2000-06-15', bce: '-000100-06-15' },
  'japanese': { meiji: '1900-06-15', taisho: '1920-06-15', showa: '1950-06-15', heisei: '2000-06-15', reiwa: '2026-06-15' },
  'roc': { roc: '2026-06-15', broc: '1900-06-15' },
  'buddhist': { be: '2026-06-15' },
  'ethiopic': { am: '2026-06-15', aa: '-005600-06-15' },
  'ethioaa': { aa: '2026-06-15' },
  'coptic': { am: '2026-06-15' },
  'persian': { ap: '2026-06-15' },
  'hebrew': { am: '2026-06-15' },
  'indian': { shaka: '2026-06-15' },
  'islamic-umalqura': { ah: '2026-06-15' },
  'islamic-civil': { ah: '2026-06-15' },
  'islamic-tbla': { ah: '2026-06-15' },
}

function isoToPlainDate(iso: string): PlainDate {
  const match = /^(-?\d+)-(\d+)-(\d+)$/.exec(iso)!
  return { year: +match[1]!, month: +match[2]!, day: +match[3]! }
}

/** 农历闰月的键是平月的键加 "bis"。 */
export function isLeapMonthKey(key: string): boolean {
  return key.endsWith('bis')
}

function commonMonthKey(key: string): string {
  return key.replace(/bis$/, '')
}

interface SampledMonth {
  readonly key: string
  readonly ordinal: number
  readonly mid: PlainDate
}

/** 用来学月份名的月：几个历法年的月份，闰月也能碰到。 */
function sampleMonths(calendar: CalendarSystem): SampledMonth[] {
  if (isGregorianAligned(calendar)) {
    return Array.from({ length: 12 }, (_, i) => ({ key: String(i + 1), ordinal: i + 1, mid: { year: YEAR_ONLY_SAMPLE_YEAR, month: i + 1, day: 15 } }))
  }
  const reference = calendarYearOf(calendar, { year: YEAR_ONLY_SAMPLE_YEAR, month: 6, day: 15 })
  const sampled: SampledMonth[] = []
  for (let year = reference - 1; year <= reference + 3; year++) {
    let month = calendarMonthFromYearMonth(calendar, { year, month: 1 })
    const count = calendarMonthsInCalendarYear(calendar, year)
    for (let ordinal = 1; ordinal <= count; ordinal++) {
      sampled.push({ key: calendarMonthKey(calendar, month), ordinal, mid: calendarMonthLabelDay(month) })
      month = calendarAddMonths(calendar, month, 1)
    }
  }
  return sampled
}

const lexicons = new Map<string, CalendarDateLexicon>()

/** 一种语言、一种历法的词表，第一次用到时建好并缓存。建一次要格式化几百个日期，适合在字段获得焦点时调用。 */
export function getCalendarDateLexicon(locale: string, calendar: CalendarSystem): CalendarDateLexicon {
  const resolved = textCalendar(calendar)
  const key = `${locale}|${resolved}`
  let lexicon = lexicons.get(key)
  if (lexicon == null) {
    lexicon = buildLexicon(locale, resolved)
    lexicons.set(key, lexicon)
  }
  return lexicon
}

interface LexiconDraft {
  months: Map<string, Set<string>>
  templates: Map<string, MonthTemplate>
  leapMarkers: Set<string>
  skip: Set<string>
  trailers: Set<string>
  yearMarkers: Set<string>
  separators: Set<string>
  weekdays: Set<string>
}

function learnMonths(draft: LexiconDraft, locales: string[], calendar: CalendarSystem, sampled: SampledMonth[], norm: (text: string) => string): void {
  const addMonth = (text: string, { key, ordinal }: SampledMonth): void => {
    const name = norm(text)
    // 带前后缀的月份数字："11月"、"9:e mån"、"윤6"、"6bis"。月份名里也可能有别的数字，
    // 例如匈牙利语 "Réb. 1" 是第三个月。
    const match = /^(\D*)(\d+)(\D*)$/.exec(name)
    const isOwnNumber = [ordinal, Number.parseInt(key, 10)].includes(Number(match?.[2]))
    if (!name || (/\d/.test(name) && (!LETTER.test(name) || isOwnNumber))) {
      if (match != null && (match[1] || match[3]))
        draft.templates.set(`${match[1]}#${match[3]}`, { pre: match[1]!, post: match[3]!, isLeap: isLeapMonthKey(key) })
      return
    }
    let keys = draft.months.get(name)
    if (keys == null) {
      keys = new Set()
      draft.months.set(name, keys)
    }
    keys.add(key)
  }
  const baseText = new Map<string, string>()
  for (const month of sampled) {
    for (const loc of locales) {
      MONTH_WIDTHS.forEach((options, width) => {
        const text = partsOf(loc, calendar, options, month.mid).find(part => part.type === 'month')?.value
        if (text == null)
          return
        const baseKey = `${loc}|${width}|${commonMonthKey(month.key)}`
        if (isLeapMonthKey(month.key)) {
          // 闰月写成平月加一个记号（"闰六月"）。
          const base = baseText.get(baseKey)
          if (base != null && text.includes(base) && !/\d/.test(base)) {
            const marker = norm(text.replace(base, ''))
            if (marker) {
              draft.leapMarkers.add(marker)
              return
            }
          }
        }
        else {
          baseText.set(baseKey, text)
        }
        addMonth(text, month)
      })
    }
  }
}

function learnLiterals(draft: LexiconDraft, locale: string, locales: string[], calendar: CalendarSystem, sampled: SampledMonth[], norm: (text: string) => string): void {
  const addSkip = (text: string, words = draft.skip): void => {
    for (const word of norm(text).replace(NOT_WORDS, ' ').split(/\s+/)) {
      if (word)
        words.add(word)
    }
  }
  const literalFormats: Intl.DateTimeFormatOptions[] = []
  for (const options of [NUMERIC, LONG, SHARED_DATE_FORMAT_OPTIONS.date, SHARED_DATE_FORMAT_OPTIONS.date_weekday, LONG_WITH_WEEKDAY])
    literalFormats.push(options, displayOptions(locale, calendar, options))
  const literalDates = sampled.slice(0, 14).map(month => month.mid)
  for (const loc of locales) {
    for (const options of literalFormats) {
      for (const pd of literalDates) {
        const parts = partsOf(loc, calendar, options, pd)
        for (const [k, part] of parts.entries()) {
          if (part.type === 'literal' || partType(part) === 'yearName')
            addSkip(part.value)
          if (part.type === 'literal' && parts[k - 1]?.type === 'year')
            addSkip(part.value, draft.yearMarkers)
        }
        const tail = parts.at(-1)
        if (loc === locale && tail?.type === 'literal') {
          const trailer = norm(tail.value).replace(/\s+/g, '')
          if (ONLY_SEPARATORS.test(trailer))
            draft.trailers.add(trailer)
        }
      }
    }
    for (let day = 0; day < 7; day++) {
      const pd = { year: YEAR_ONLY_SAMPLE_YEAR, month: 11, day: 1 + day }
      for (const options of WEEKDAY_FORMATS) {
        const text = partsOf(loc, calendar, options, pd).find(part => part.type === 'weekday')?.value
        if (text != null) {
          addSkip(text)
          addSkip(text, draft.weekdays)
          // 越南语的星期几写成一个词加一个数字："Thứ 2"。
          if (/\d/.test(norm(text)))
            draft.skip.add(norm(text))
        }
      }
    }
  }
  const hint = displayOptions(locale, calendar, NUMERIC)
  for (const part of partsOf(locale, calendar, hint, literalDates[0]!)) {
    const separator = norm(part.value).replace(/\s+/g, '')
    if (part.type === 'literal' && separator)
      draft.separators.add(separator)
  }
  if (LUNISOLAR.has(calendar)) {
    // 年份名六十年一轮。
    for (let year = 1996; year < 2057; year++) {
      for (const loc of locales) {
        for (const part of partsOf(loc, calendar, LONG, { year, month: 6, day: 15 })) {
          if (partType(part) === 'yearName')
            addSkip(part.value)
        }
      }
    }
  }
}

function learnEras(locale: string, locales: string[], calendar: CalendarSystem, norm: (text: string) => string): Pick<CalendarDateLexicon, 'eras' | 'yearAliases' | 'eraArithmetic'> {
  const eras = new Map<string, string>()
  const yearAliases = new Map<string, string>()
  const eraArithmetic = new Map<string, EraArithmetic>()
  const literalFormats = [NUMERIC, LONG, SHARED_DATE_FORMAT_OPTIONS.date, SHARED_DATE_FORMAT_OPTIONS.date_weekday, LONG_WITH_WEEKDAY]
    .flatMap(options => [options, displayOptions(locale, calendar, options)])
  const eraWidths = calendar === 'japanese' ? ['long', 'short', 'narrow'] : ['long', 'short']
  for (const [code, iso] of Object.entries(ERA_SAMPLES[calendar] ?? {})) {
    const sample = isoToPlainDate(iso)
    for (const loc of locales) {
      // 完整日期里的纪元写法可能不一样，例如法语的 "EB"。
      for (const options of [...eraWidths.map(width => ERA_WIDTHS[width]!), ...literalFormats]) {
        const text = partsOf(loc, calendar, options, sample).find(part => part.type === 'era')?.value
        if (text != null && norm(text))
          eras.set(norm(text), code)
      }
    }
    const eraYear = (pd: PlainDate): number => calendarEraYear('en', calendar, pd).year
    const year = eraYear(sample)
    const isForward = eraYear({ ...sample, year: sample.year + 1 }) > year
    const base = isForward ? sample.year - year : sample.year + year
    eraArithmetic.set(code, { base, isForward })
    const firstYear = { year: isForward ? base + 1 : base - 1, month: 12, day: 31 }
    // 有的语言把纪元元年写成字，例如日语的「元」。
    if (isGregorianAligned(calendar) && firstYear.year > 0) {
      const text = partsOf(locale, calendar, LONG_WITH_ERA, firstYear).find(part => part.type === 'year')?.value
      if (text != null && !/\d/.test(norm(text)))
        yearAliases.set(norm(text), '1')
    }
  }
  if (calendar === 'japanese')
    eraArithmetic.set('ce', { base: 0, isForward: true })
  return { eras, yearAliases, eraArithmetic }
}

/** 月份数字是序号（希伯来历）还是月份键的数字（农历）。用一个写数字的语言探一下。 */
function readsMonthOrdinal(calendar: CalendarSystem, sampled: SampledMonth[]): boolean {
  const shifted = sampled.find(month => month.ordinal !== Number.parseInt(month.key, 10))
  if (shifted == null)
    return false
  const text = partsOf('sv', calendar, NUMERIC, shifted.mid).find(part => part.type === 'month')?.value
  return Number(normalizeDateText(text ?? '', 'sv').replace(/\D+/g, '')) === shifted.ordinal
}

function buildLexicon(locale: string, calendar: CalendarSystem): CalendarDateLexicon {
  const locales = locale === 'en' ? ['en'] : [locale, 'en']
  const norm = (text: string): string => normalizeDateText(text, locale).trim()
  const draft: LexiconDraft = {
    months: new Map(),
    templates: new Map(),
    leapMarkers: new Set(),
    skip: new Set(),
    trailers: new Set(),
    yearMarkers: new Set(),
    separators: new Set(),
    weekdays: new Set(),
  }
  const sampled = sampleMonths(calendar)
  learnMonths(draft, locales, calendar, sampled, norm)
  learnLiterals(draft, locale, locales, calendar, sampled, norm)
  const { eras, yearAliases, eraArithmetic } = learnEras(locale, locales, calendar, norm)
  for (const marker of draft.leapMarkers)
    draft.skip.delete(marker)
  for (const word of [...draft.months.keys(), ...eras.keys(), ...yearAliases.keys()])
    draft.skip.delete(word)
  const vocabularySet = new Set([...draft.months.keys(), ...eras.keys(), ...draft.skip, ...draft.leapMarkers, ...yearAliases.keys()])
  const sample = { year: YEAR_ONLY_SAMPLE_YEAR, month: 11, day: 2 }
  return {
    locale,
    calendar,
    order: fieldOrder(partsOf(locale, calendar, NUMERIC, sample)),
    nameOrder: fieldOrder(partsOf(locale, calendar, LONG, sample)),
    months: draft.months,
    monthTemplates: [...draft.templates.values()].sort((a, b) => b.pre.length + b.post.length - (a.pre.length + a.post.length)),
    leapMarkers: draft.leapMarkers,
    eras,
    yearAliases,
    trailers: draft.trailers,
    yearMarkers: draft.yearMarkers,
    separators: draft.separators,
    weekdays: draft.weekdays,
    vocabulary: [...vocabularySet].sort((a, b) => b.length - a.length),
    vocabularySet,
    isNumericMonthOrdinal: readsMonthOrdinal(calendar, sampled),
    eraArithmetic,
  }
}
