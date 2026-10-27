import type { VNode } from 'vue'
import type { ResolvedPoint, SeriesDef } from '../types.js'
import { h } from 'vue'
import { isBandScale } from '../utils.js'

export interface ReferenceLineOptions {
  /** 在这个 y 值处画一条横线 */
  y?: number
  /** 第二个 y 值——在 y 和 y2 之间涂一条带 */
  y2?: number
  /** 在这个 x 值处画一条竖线 */
  x?: number
  /** 线或带的颜色 */
  color?: string
  /** 描边宽度（画线时用） */
  strokeWidth?: number
  /** 虚线样式 */
  strokeDasharray?: string
  /** 文字标签 */
  label?: string
  /** 标签位置 */
  labelPosition?: 'start' | 'end'
  /** 涂带的透明度（设了 y2 时用） */
  bandOpacity?: number
}

// 标签牌尺寸，和十字线的标签样式一致。
const BADGE_H = 14
const BADGE_RX = 3
const LABEL_FONT_SIZE = 10
// 每个字形的大致宽度加两侧留白，用来估标签牌的宽度。
const LABEL_CHAR_W = 6.5
const LABEL_PAD = 12

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(v, hi))
}

/** 标签牌的估算宽度；没有标签就是 0。 */
function labelWidth(label: string | undefined): number {
  return label ? label.length * LABEL_CHAR_W + LABEL_PAD : 0
}

/**
 * 标签牌，按左上角定位。调用方先把左上角夹进绘图区，所以横线、竖线两个方向
 * 都能用同一套代码摆正。
 */
function referenceLabel(x: number, topY: number, width: number, color: string, text: string): VNode {
  return h('g', { 'transform': `translate(${x},${topY})`, 'pointer-events': 'none' }, [
    h('rect', {
      'x': 0,
      'y': 0,
      width,
      'height': BADGE_H,
      'rx': BADGE_RX,
      'fill': 'var(--astryx-color-background-popover)',
      'fill-opacity': 0.85,
      'stroke': color,
      'stroke-width': 0.5,
    }),
    h('text', {
      'x': width / 2,
      'y': BADGE_H / 2,
      'dy': '0.35em',
      'text-anchor': 'middle',
      'font-size': LABEL_FONT_SIZE,
      'font-weight': 500,
      'fill': color,
    }, text),
  ])
}

/**
 * 横向或纵向的参考线、参考带。它不是数据系列，画在固定的数值上。
 *
 * 画的位置要现算（取决于比例尺、绘图区大小和标签宽度），所以这个工厂没有点位可算，
 * `resolve()` 永远返回空数组——所有几何都在 `render()` 里。
 * 标签牌会被夹在绘图区内（绘图区本身是裁切的），横竖两个方向都一样。
 */
export function referenceLine(options: ReferenceLineOptions): SeriesDef {
  const color = options.color ?? 'var(--astryx-color-border-emphasized)'
  const strokeWidth = options.strokeWidth ?? 1
  const strokeDasharray = options.strokeDasharray ?? '6 3'
  const label = options.label
  const labelPosition = options.labelPosition ?? 'end'
  const bandOpacity = options.bandOpacity ?? 0.1

  const textW = labelWidth(label)

  return {
    type: 'referenceLine',
    key: `ref-${options.y ?? options.x ?? 'none'}`,
    dataKeys: [],
    layout: {},

    resolve(): ResolvedPoint[] {
      return []
    },

    render(_resolved, ctx) {
      const { width, height, xScale, yScale } = ctx
      // 标签牌不许跑出（被裁切的）绘图区。
      const bxMax = width - textW - 2

      if (options.y != null) {
        if (!Number.isFinite(options.y))
          return null
        const py = yScale(options.y)
        if (!Number.isFinite(py))
          return null
        const desiredBx = labelPosition === 'end' ? bxMax : 2
        const bx = clamp(desiredBx, 2, bxMax)
        const labelTopY = clamp(py - BADGE_H / 2, 0, height - BADGE_H)

        // 带模式：y 和 y2 之间涂一条
        if (options.y2 != null && Number.isFinite(options.y2)) {
          const py2 = yScale(options.y2)
          const top = Math.min(py, py2)
          const bandHeight = Math.abs(py2 - py)
          return h('g', [
            h('rect', { x: 0, y: top, width, height: bandHeight, fill: color, opacity: bandOpacity }),
            h('line', { 'x1': 0, 'x2': width, 'y1': py, 'y2': py, 'stroke': color, 'stroke-width': strokeWidth, 'stroke-dasharray': strokeDasharray }),
            h('line', { 'x1': 0, 'x2': width, 'y1': py2, 'y2': py2, 'stroke': color, 'stroke-width': strokeWidth, 'stroke-dasharray': strokeDasharray }),
            label ? referenceLabel(bx, labelTopY, textW, color, label) : null,
          ])
        }

        return h('g', [
          h('line', { 'x1': 0, 'x2': width, 'y1': py, 'y2': py, 'stroke': color, 'stroke-width': strokeWidth, 'stroke-dasharray': strokeDasharray }),
          label ? referenceLabel(bx, labelTopY, textW, color, label) : null,
        ])
      }

      // 竖线只支持线性 x 轴：band 轴上任意数值没有对应的像素位置。
      if (options.x != null && !isBandScale(xScale)) {
        if (!Number.isFinite(options.x))
          return null
        const px = xScale(options.x)
        if (!Number.isFinite(px))
          return null
        const desiredTopY = labelPosition === 'end' ? 4 : height - BADGE_H - 4
        const labelTopY = clamp(desiredTopY, 0, height - BADGE_H)
        const bx = clamp(px - textW / 2, 2, bxMax)
        return h('g', [
          h('line', { 'x1': px, 'x2': px, 'y1': 0, 'y2': height, 'stroke': color, 'stroke-width': strokeWidth, 'stroke-dasharray': strokeDasharray }),
          label ? referenceLabel(bx, labelTopY, textW, color, label) : null,
        ])
      }

      return null
    },
  }
}
