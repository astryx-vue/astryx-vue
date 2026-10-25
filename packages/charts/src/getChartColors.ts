import type { RGBA } from './color.js'
import { formatColor, formatHex, parseColor, parseHex } from './color.js'

/**
 * 从一个「取变量值」的函数算出整套图表配色，不需要 DOM、不需要主题对象。
 *
 * 三套配色都能适应任意数量：类别色在固定的槽位里循环；顺序色和发散色在色阶停靠点
 * 够用时直接取设计好的那几档，要得更多就在色阶上插值，而不是默默截断。
 */

/** 顺序色阶可用的色相名 */
export type SequentialHue
  = | 'blue'
    | 'shamrock'
    | 'orange'
    | 'pink'
    | 'purple'
    | 'red'
    | 'teal'
    | 'yellow'
    | 'gray'

/** 配色 API */
export interface ChartColorsAPI {
  categorical: (n: number) => string[]
  sequential: Record<SequentialHue, (n: number) => string[]>
  diverging: {
    positiveNegative: (n: number) => string[]
    coldHot: (n: number) => string[]
    custom: (
      neg: SequentialHue,
      pos: SequentialHue,
      n: number,
      midpoint?: string,
    ) => string[]
  }
  semantic: {
    positive: string
    negative: string
    warning: string
    neutral: string
  }
  /** 图表骨架（坐标轴、网格、刻度、标签）的结构色 */
  structural: {
    axis: string
    grid: string
    tick: string
    label: string
  }
  alpha: (hex: string, opacity: number) => string
}

/** 把一个变量名取成当前值 */
export type TokenResolver = (name: string) => string

const CATEGORICAL_TOKENS = [
  '--color-data-categorical-blue',
  '--color-data-categorical-orange',
  '--color-data-categorical-purple',
  '--color-data-categorical-green',
  '--color-data-categorical-pink',
  '--color-data-categorical-cyan',
  '--color-data-categorical-red',
  '--color-data-categorical-teal',
  '--color-data-categorical-brown',
  '--color-data-categorical-indigo',
] as const

const SEQUENTIAL_HUES: SequentialHue[] = [
  'blue',
  'shamrock',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
  'gray',
]

/** 在 sRGB 空间里对两个 hex 颜色插值。读不出 hex 时退到更近的那个端点。 */
function lerpHex(a: string, b: string, t: number): string {
  const ca = parseHex(a)
  const cb = parseHex(b)
  if (ca === null || cb === null)
    return t < 0.5 ? a : b

  function mix(x: number, y: number): number {
    return x + (y - x) * t
  }
  return formatHex(mix(ca.r, cb.r), mix(ca.g, cb.g), mix(ca.b, cb.b))
}

/**
 * 从一串有序的停靠点里取 `n` 个颜色。
 * - `n` 不超过停靠点个数：挑最接近的那几个，保留设计好的色值。
 * - `n` 更多：在色阶上插值，要多少个都有，而不是悄悄卡在停靠点个数上。
 * - `n === 1`：取中间那档，当作这一阶的代表色。
 */
function sampleRamp(stops: string[], n: number): string[] {
  const len = stops.length
  // 非有限的数量（比如 Infinity）会让下面的 Array.from 试图分配 2**53 个元素并卡死，
  // 所以按空结果处理。
  if (!Number.isFinite(n) || n <= 0 || len === 0)
    return []
  if (n === 1)
    return [stops[Math.floor((len - 1) / 2)]]
  if (len === 1)
    return Array.from<string>({ length: n }).fill(stops[0])

  if (n <= len) {
    return Array.from(
      { length: n },
      (_, i) => stops[Math.round((i * (len - 1)) / (n - 1))],
    )
  }
  return Array.from({ length: n }, (_, i) => {
    const t = (i * (len - 1)) / (n - 1)
    const lo = Math.floor(t)
    const frac = t - lo
    return frac === 0 ? stops[lo] : lerpHex(stops[lo], stops[lo + 1], frac)
  })
}

/**
 * 给一个具体颜色加上透明度。hex（带不带 `#`）、`rgb()` / `rgba()`、颜色名都行。
 * 传进来的 `opacity` 总是覆盖颜色里原有的透明度。读不出来（比如 `var()`）就原样返回。
 */
function hexAlpha(hex: string, opacity: number): string {
  // parseColor 要求 hex 带 `#`；再补一个 parseHex，这样不带 `#` 的 hex 也能用。
  const rgba: RGBA | null = parseColor(hex) ?? parseHex(hex)
  if (rgba === null)
    return hex
  const a = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 1
  return formatColor({ ...rgba, a })
}

/** 从一个取变量值的函数算出整套配色。这是最底层的入口。 */
export function getChartColorsFromResolver(resolve: TokenResolver): ChartColorsAPI {
  const categorical = CATEGORICAL_TOKENS.map(t => resolve(t))

  function ramp(hue: SequentialHue): string[] {
    return [5, 4, 3, 2, 1].map(step => resolve(`--color-data-${hue}-${step}`))
  }

  const gray1 = resolve('--color-data-gray-1')

  function buildDiverging(
    negHue: SequentialHue,
    posHue: SequentialHue,
    n: number,
    midpoint: string = gray1,
  ): string[] {
    if (n <= 0)
      return []
    if (n === 1)
      return [midpoint]

    const half = Math.floor(n / 2)
    const hasCenter = n % 2 === 1
    const negSide = sampleRamp(ramp(negHue), half)
    const posSide = sampleRamp(ramp(posHue), half).reverse()
    if (hasCenter)
      return [...negSide, midpoint, ...posSide]
    return [...negSide, ...posSide]
  }

  return {
    categorical(n: number): string[] {
      // 同上：非有限的数量会让回绕分配卡死，按空结果处理。
      if (!Number.isFinite(n) || n <= 0 || categorical.length === 0)
        return []
      // 在调色板里循环，任意系列数量都能拿到确定的颜色。
      return Array.from({ length: n }, (_, i) => categorical[i % categorical.length])
    },

    sequential: Object.fromEntries(
      SEQUENTIAL_HUES.map(hue => [hue, (n: number): string[] => sampleRamp(ramp(hue), n)]),
    ) as Record<SequentialHue, (n: number) => string[]>,

    diverging: {
      positiveNegative: (n: number) => buildDiverging('shamrock', 'red', n),
      coldHot: (n: number) => buildDiverging('blue', 'red', n),
      custom: (neg: SequentialHue, pos: SequentialHue, n: number, mid?: string) =>
        buildDiverging(neg, pos, n, mid),
    },

    semantic: {
      positive: resolve('--color-data-categorical-green'),
      negative: resolve('--color-data-categorical-red'),
      warning: resolve('--color-data-categorical-orange'),
      neutral: resolve('--color-data-neutral'),
    },

    structural: {
      axis: resolve('--color-border-emphasized'),
      grid: resolve('--color-border'),
      tick: resolve('--color-border-emphasized'),
      label: resolve('--color-text-secondary'),
    },

    alpha: hexAlpha,
  }
}
