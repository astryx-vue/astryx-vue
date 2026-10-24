import type { CSSProperties, StyleValue } from 'vue'
import type { PixelWidth, ProportionalWidth, TableColumn } from './types.js'
import { firstCharacter } from '../utils/characters.js'

export const DEFAULT_MIN_COLUMN_WIDTH = 120
export const DEFAULT_FLEXIBLE_COLUMN_MIN_WIDTH = 60

export function proportional(value = 1, options?: { minWidth?: number }): ProportionalWidth {
  return {
    type: 'proportional',
    value,
    minWidth: options?.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH,
  }
}

export function pixel(value: number): PixelWidth {
  return { type: 'pixel', value }
}

function flexibleMin(width: ProportionalWidth | undefined): number {
  return width?.minWidth ?? (width == null ? DEFAULT_FLEXIBLE_COLUMN_MIN_WIDTH : DEFAULT_MIN_COLUMN_WIDTH)
}

interface ColumnSpacePlan {
  totalProportion: number
  pixelTotal: number
  maxProportionalSpace: number
}

function planColumnSpace<T extends Record<string, unknown>>(columns: readonly TableColumn<T>[]): ColumnSpacePlan {
  let totalProportion = 0
  let pixelTotal = 0
  const flexible: { proportion: number, minWidth: number }[] = []
  for (const column of columns) {
    const width = column.width
    if (width?.type === 'pixel') {
      pixelTotal += width.value
    }
    else {
      const proportion = width?.value ?? 1
      totalProportion += proportion
      flexible.push({ proportion, minWidth: flexibleMin(width) })
    }
  }
  let maxProportionalSpace = 0
  if (totalProportion > 0) {
    for (const column of flexible) {
      const required = (column.minWidth * totalProportion) / column.proportion
      if (required > maxProportionalSpace)
        maxProportionalSpace = required
    }
  }
  return { totalProportion, pixelTotal, maxProportionalSpace }
}

export interface ResolvedColumnWidth {
  style: CSSProperties
}

export interface ResolvedColumnWidths {
  columns: Map<string, ResolvedColumnWidth>
  tableMinWidth: number
}

/**
 * 表格被挤到最小宽度时每一列的像素。固定列的偏移按这个宽度累加。
 */
export function resolveColumnFloorWidths<T extends Record<string, unknown>>(columns: readonly TableColumn<T>[]): Map<string, number> {
  const { totalProportion, maxProportionalSpace } = planColumnSpace(columns)
  const widths = new Map<string, number>()
  for (const column of columns) {
    const width = column.width
    if (width?.type === 'pixel') {
      widths.set(column.key, width.value)
    }
    else {
      const proportion = width?.value ?? 1
      widths.set(column.key, totalProportion > 0 ? (maxProportionalSpace * proportion) / totalProportion : 0)
    }
  }
  return widths
}

const MAX_COMPATIBLE_FUNCTION = /^(?:calc|min|max|clamp|var)\(/i
const PX_LENGTH = /^(\d+(?:\.\d+)?)px$/i
const LENGTH_UNITS = new Set([
  'px',
  'em',
  'rem',
  'lh',
  'rlh',
  'ex',
  'rex',
  'ch',
  'rch',
  'cap',
  'rcap',
  'ic',
  'ric',
  'vw',
  'vh',
  'vi',
  'vb',
  'vmin',
  'vmax',
  'svw',
  'svh',
  'svi',
  'svb',
  'svmin',
  'svmax',
  'lvw',
  'lvh',
  'lvi',
  'lvb',
  'lvmin',
  'lvmax',
  'dvw',
  'dvh',
  'dvi',
  'dvb',
  'dvmin',
  'dvmax',
  'cqw',
  'cqh',
  'cqi',
  'cqb',
  'cqmin',
  'cqmax',
  'cm',
  'mm',
  'q',
  'in',
  'pt',
  'pc',
  '%',
])

function isZeroLength(value: string): boolean {
  const magnitude = value.trim().replace(/[a-z%]+$/i, '')
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(magnitude))
    return false
  return Number(magnitude) === 0
}

function isCssMaxLength(value: string): boolean {
  if (value.endsWith('%'))
    return /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value.slice(0, -1))
  const unit = value.match(/[a-z]+$/i)?.[0]?.toLowerCase()
  if (unit == null || !LENGTH_UNITS.has(unit))
    return false
  return /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value.slice(0, -unit.length))
}

/**
 * 数据表的内联最小宽度：列宽下限和调用方写的 `minWidth` 里较大的那个。
 *
 * 数字、0 和 px 直接比较。其它长度、百分比、`calc()` / `var()` 交给 CSS `max()`。
 * `auto`、`max-content` 这类关键字不能放进 `max()`，这时列宽下限胜出。
 */
export function resolveTableMinWidth(consumer: CSSProperties['minWidth'], floorPx: number): string {
  const floor = `${floorPx}px`
  if (consumer == null)
    return floor
  if (typeof consumer === 'number')
    return `${Math.max(consumer, floorPx)}px`
  const value = consumer.trim()
  if (value === '' || isZeroLength(value))
    return floor
  const px = PX_LENGTH.exec(value)
  if (px)
    return `${Math.max(Number(px[1]), floorPx)}px`
  if (isCssMaxLength(value) || MAX_COMPATIBLE_FUNCTION.test(value))
    return `max(${value}, ${floor})`
  return floor
}

/** 把样式里的 `minWidth` 拆出来，剩下的继续留给滚动容器。字符串样式拆不开，原样返回。 */
export function splitStyleMinWidth(style: StyleValue | undefined): {
  minWidth: CSSProperties['minWidth']
  style: StyleValue | undefined
} {
  if (style == null || typeof style === 'string')
    return { minWidth: undefined, style }
  if (Array.isArray(style)) {
    let minWidth: CSSProperties['minWidth']
    const next = style.map((item) => {
      const split = splitStyleMinWidth(item as StyleValue)
      if (split.minWidth != null)
        minWidth = split.minWidth
      return split.style
    })
    return { minWidth, style: next as StyleValue }
  }
  if (typeof style === 'object') {
    const { minWidth, ...rest } = style as CSSProperties
    return { minWidth, style: rest }
  }
  return { minWidth: undefined, style }
}

export function resolveColumnWidths<T extends Record<string, unknown>>(columns: readonly TableColumn<T>[]): ResolvedColumnWidths {
  const { totalProportion, pixelTotal, maxProportionalSpace } = planColumnSpace(columns)
  const result = new Map<string, ResolvedColumnWidth>()
  for (const column of columns) {
    const width = column.width
    const style: CSSProperties = {}
    if (width?.type === 'pixel') {
      style.width = `${width.value}px`
      style.minWidth = `${width.value}px`
    }
    else {
      const proportion = width?.value ?? 1
      if (totalProportion > 0)
        style.width = `${(proportion / totalProportion) * 100}%`
      style.minWidth = `${flexibleMin(width)}px`
    }
    result.set(column.key, { style })
  }
  return { columns: result, tableMinWidth: pixelTotal + maxProportionalSpace }
}

export function capitalize(value: string): string {
  if (value.length === 0)
    return value
  const first = firstCharacter(value)
  return first.toUpperCase() + value.slice(first.length)
}

export function cellText(value: unknown): string {
  if (value == null)
    return ''
  if (value instanceof Date)
    return value.toISOString()
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint')
    return String(value)
  return ''
}

export function paginateData<T>(data: readonly T[], page: number, pageSize: number): T[] {
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10
  const current = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1
  const start = (current - 1) * size
  return data.slice(start, start + size)
}

function contentLength(value: unknown): number {
  if (typeof value === 'string')
    return value.length
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value).length
  return 0
}

function longestWord(value: unknown): number {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean')
    return 0
  return String(value).split(/\s+/).reduce((max, word) => Math.max(max, word.length), 0)
}

export function generateColumns<T extends Record<string, unknown>>(data: readonly T[]): TableColumn<T>[] {
  const first = data[0]
  if (first == null)
    return []
  const keys = Object.keys(first)
  const sample = data.slice(0, Math.min(5, data.length))
  return keys.map((key) => {
    const header = capitalize(key)
    let maxContent = header.length
    let maxWord = header.length
    for (const row of sample) {
      maxContent = Math.max(maxContent, contentLength(row[key]))
      maxWord = Math.max(maxWord, longestWord(row[key]))
    }
    const proportion = maxContent <= 6 ? 1 : maxContent <= 15 ? 2 : 3
    const minWidth = Math.max(Math.max(header.length, maxWord) * 8, DEFAULT_FLEXIBLE_COLUMN_MIN_WIDTH)
    return { key, header, width: proportional(proportion, { minWidth }) }
  })
}

export function sortRows<T extends Record<string, unknown>>(
  rows: readonly T[],
  sort: readonly { sortKey: string, direction: 'ascending' | 'descending' }[],
  columns: readonly TableColumn<T>[] = [],
  collator?: Pick<Intl.Collator, 'compare'>,
): T[] {
  if (sort.length === 0)
    return [...rows]
  const comparators = new Map<string, (a: T, b: T) => number>()
  for (const column of columns) {
    const sortable = column.sortable
    const key = sortable == null || sortable === false || sortable === true
      ? column.key
      : sortable.sortKey ?? column.key
    if (typeof sortable === 'object' && sortable.compare)
      comparators.set(key, sortable.compare)
  }
  const copy = [...rows]
  copy.sort((a, b) => {
    for (const entry of sort) {
      const custom = comparators.get(entry.sortKey)
      const result = custom ? custom(a, b) : compareValues(a[entry.sortKey], b[entry.sortKey], collator)
      if (result !== 0)
        return entry.direction === 'ascending' ? result : -result
    }
    return 0
  })
  return copy
}

function compareValues(a: unknown, b: unknown, collator?: Pick<Intl.Collator, 'compare'>): number {
  if (a == null && b == null)
    return 0
  if (a == null)
    return 1
  if (b == null)
    return -1
  if (typeof a === 'number' && typeof b === 'number')
    return a - b
  const left = String(a)
  const right = String(b)
  return collator ? collator.compare(left, right) : left.localeCompare(right)
}
