import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

export const GRID_STROKE = 'var(--astryx-color-border, rgba(5, 54, 89, 0.1))'
export const AXIS_TICK = 'var(--astryx-color-text-secondary, #4E606F)'

/** 图表没量到宽度之前用的宽度，服务端渲染也用它。 */
const FALLBACK_WIDTH = 800

/**
 * 量图表 svg 的实际宽度。viewBox 用这个宽度，坐标和像素一比一：
 * 图表撑满容器，线和文字也不会被横向拉伸。
 */
export function useChartWidth(): { el: Ref<SVGSVGElement | null>, width: Ref<number> } {
  const el = ref<SVGSVGElement | null>(null)
  const width = ref(FALLBACK_WIDTH)
  let observer: ResizeObserver | null = null
  onMounted(() => {
    if (!el.value || typeof ResizeObserver === 'undefined')
      return
    observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0)
        width.value = entry.contentRect.width
    })
    observer.observe(el.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
  return { el, width }
}

/**
 * 和 recharts 默认的 YAxis 一样取 5 个均匀刻度：从 0（或更小的最小值）起，
 * 步长按位数取整（个位数取 0.1 的倍数，更大的取 0.05 × 10^位数 的倍数），最高一档刚好盖住最大值。
 */
export function niceTicks(min: number, max: number, count = 5): number[] {
  const lo = Math.min(0, min)
  const raw = (max - lo) / (count - 1)
  if (!(raw > 0))
    return [lo, max]
  const digits = Math.floor(Math.log10(raw)) + 1
  const unit = 10 ** digits * (digits === 1 ? 0.1 : 0.05)
  const step = Math.ceil(raw / unit) * unit
  return Array.from({ length: count }, (_, i) => Math.round((lo + i * step) * 1e6) / 1e6)
}

/** 单调三次样条，和 recharts 的 monotone 曲线一样，返回 SVG 路径。 */
export function monotonePath(pts: Array<{ x: number, y: number }>): string {
  const n = pts.length
  if (n < 3)
    return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join('')
  const dx: number[] = []
  const slope: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x)
    slope.push((pts[i + 1].y - pts[i].y) / dx[i])
  }
  const m: number[] = [slope[0]]
  for (let i = 1; i < n - 1; i++)
    m.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2)
  m.push(slope[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / slope[i]
    const b = m[i + 1] / slope[i]
    const len = Math.hypot(a, b)
    if (len > 3) {
      m[i] = (3 * a / len) * slope[i]
      m[i + 1] = (3 * b / len) * slope[i]
    }
  }
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 0; i < n - 1; i++) {
    const w = dx[i] / 3
    d += `C${pts[i].x + w},${pts[i].y + m[i] * w},${pts[i + 1].x - w},${pts[i + 1].y - m[i + 1] * w},${pts[i + 1].x},${pts[i + 1].y}`
  }
  return d
}

export function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0
}

let measureContext: CanvasRenderingContext2D | null | undefined

/**
 * recharts 的 Text 用一个脱离文档的 span 量词宽，样式里写的是未定义的
 * `var(--font-size-sm)`，字号失效后落回 span 继承的 16px。折行位置由这个 16px 的
 * 宽度决定（画出来的字仍是 12px），所以这里同样按 16px 量。
 */
const WRAP_MEASURE_FONT_SIZE = '16px'

/** 量一段文字的宽度；没有 canvas（服务端渲染）时按平均字宽估。 */
function measureText(text: string): number {
  if (measureContext === undefined) {
    measureContext = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d')
  }
  if (!measureContext)
    return text.length * 8.3
  measureContext.font = `${WRAP_MEASURE_FONT_SIZE} ${getComputedStyle(document.body).fontFamily}`
  return measureContext.measureText(text).width
}

/**
 * 照搬 recharts `Text` 的折行：按空格切词，当前行宽 + 下一个词宽 + 一个空格宽
 * 不小于 maxWidth 就另起一行（宽度是量出来的，不是字符数）。
 */
export function wrapToWidth(text: string, maxWidth: number): string[] {
  const spaceWidth = measureText('\u00A0')
  const lines: Array<{ words: string[], width: number }> = []
  for (const word of text.split(/[ \f\n\r\t\v\u2028\u2029]+/)) {
    const width = measureText(word)
    const current = lines[lines.length - 1]
    if (current && current.width + width + spaceWidth < maxWidth) {
      current.words.push(word)
      current.width += width + spaceWidth
    }
    else {
      lines.push({ words: [word], width })
    }
  }
  return lines.map(line => line.words.join(' '))
}
