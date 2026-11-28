/**
 * 浮层排版时占的盒子（上游 Layer/settledBox.ts）。
 *
 * 呈现动效进行到一半时，浮层画在屏幕上的盒子带着它自己的缩放和位移；退场副本
 * 要落在排版的盒子上，再自己带上那份变换。这里把元素自己的 `translate`、
 * `scale` 和轴对齐的 `transform` 按 `transform-origin` 反算回去，小数保留。
 * 算不了（旋转、斜切、百分比位移）时退回排版尺寸，以画出的盒子中心为准。
 */
import type { EntranceBox } from './layerEntranceSide.js'

type Matrix = readonly [number, number, number, number, number, number]

const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0]

const isSet = (value: string): boolean => value !== '' && value !== 'none'

function multiply(m: Matrix, n: Matrix): Matrix {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ]
}

/** 元素自己的变换，按 translate、scale、transform 的顺序合成；算不了时为 null。 */
function ownTransform(style: CSSStyleDeclaration): Matrix | null {
  let matrix = IDENTITY
  const translate = style.getPropertyValue('translate')
  if (isSet(translate)) {
    const parts = translate.trim().split(/\s+/)
    if (parts.length > 2 || !parts.every(part => part.endsWith('px')))
      return null
    matrix = multiply(matrix, [1, 0, 0, 1, Number.parseFloat(parts[0]), Number.parseFloat(parts[1] ?? '0')])
  }
  if (isSet(style.getPropertyValue('rotate')))
    return null
  const scale = style.getPropertyValue('scale')
  if (isSet(scale)) {
    const parts = scale.trim().split(/\s+/)
    if (parts.length > 2)
      return null
    const x = Number.parseFloat(parts[0])
    const y = Number.parseFloat(parts[1] ?? parts[0])
    matrix = multiply(matrix, [x, 0, 0, y, 0, 0])
  }
  const transform = style.getPropertyValue('transform')
  if (isSet(transform)) {
    const values = /^matrix\(([^)]*)\)$/.exec(transform)?.[1].split(',').map(Number.parseFloat)
    if (values?.length !== 6 || values.some(Number.isNaN))
      return null
    matrix = multiply(matrix, values as unknown as Matrix)
  }
  const [a, b, c, d] = matrix
  return b === 0 && c === 0 && a !== 0 && d !== 0 ? matrix : null
}

function originOf(style: CSSStyleDeclaration): [number, number] | null {
  const parts = style.getPropertyValue('transform-origin').trim().split(/\s+/)
  if (parts.length < 2 || !parts.slice(0, 2).every(part => part.endsWith('px')))
    return null
  return [Number.parseFloat(parts[0]), Number.parseFloat(parts[1])]
}

/** `element` 排版时的边框盒，视口 px，不含它自己正在画的变换。 */
export function settledBox(element: HTMLElement): EntranceBox {
  const rect = element.getBoundingClientRect()
  const view = element.ownerDocument.defaultView
  const style = view?.getComputedStyle(element)
  const matrix = style == null ? IDENTITY : ownTransform(style)
  if (matrix === IDENTITY)
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
  const origin = style == null ? null : originOf(style)
  if (matrix != null && origin != null) {
    const [sx, , , sy, tx, ty] = matrix
    const [ox, oy] = origin
    // 画出的左上角 = 排版左上角 + 原点 + 位移 − 原点 × 缩放。
    return {
      left: rect.left - ox - tx + ox * sx,
      top: rect.top - oy - ty + oy * sy,
      width: rect.width / sx,
      height: rect.height / sy,
    }
  }
  const width = element.offsetWidth
  const height = element.offsetHeight
  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
  }
}
