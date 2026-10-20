/**
 * 拼图和差异分数。只处理 PNG 缓冲区，不碰浏览器。
 *
 * 尺寸对齐规则：不缩放（缩放会把细节糊掉），两张图都补白到「宽取两者最大、高取两者最大」。
 * 原图水平居中、贴顶摆放；补出来的区域填 PAD_COLOR。
 * 补白区域和对面的真实内容几乎一定算作不同，所以尺寸差越大分数越高，这是有意的。
 */
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { drawText, GLYPH_HEIGHT, textWidth } from './font.mjs'

export const PAD_COLOR = [255, 0, 255]
export const SEPARATOR_WIDTH = 16
export const SEPARATOR_COLOR = [160, 160, 160]
export const LABEL_BAR_COLOR = [235, 235, 235]
export const LABEL_TEXT_COLOR = [30, 30, 30]
/** pixelmatch 单像素颜色容差（0~1），0.1 是它的默认值。 */
export const PIXEL_THRESHOLD = 0.1
/** 差异百分比低于它算「基本一致」。 */
export const SCORE_SAME = 2
/** 差异百分比高于它算「明显不同」。 */
export const SCORE_DIFFERENT = 10

export function readPng(buffer) {
  return PNG.sync.read(buffer)
}

export function writePng(png) {
  return PNG.sync.write(png)
}

function createPng(width, height, [r, g, b]) {
  const png = new PNG({ width, height })
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = r
    png.data[i + 1] = g
    png.data[i + 2] = b
    png.data[i + 3] = 255
  }
  return png
}

/** 把 src 原样拷到 dest 的 (x, y) 处，半透明像素先和白底混合。 */
function blit(src, dest, x, y) {
  for (let row = 0; row < src.height; row++) {
    const dy = y + row
    if (dy < 0 || dy >= dest.height)
      continue
    for (let col = 0; col < src.width; col++) {
      const dx = x + col
      if (dx < 0 || dx >= dest.width)
        continue
      const s = (row * src.width + col) * 4
      const d = (dy * dest.width + dx) * 4
      const alpha = src.data[s + 3] / 255
      for (let c = 0; c < 3; c++)
        dest.data[d + c] = Math.round(src.data[s + c] * alpha + 255 * (1 - alpha))
      dest.data[d + 3] = 255
    }
  }
}

/** 按文件头部规则把图补到 width × height：水平居中、贴顶。 */
export function padTo(png, width, height, color = PAD_COLOR) {
  if (png.width === width && png.height === height)
    return png
  const out = createPng(width, height, color)
  blit(png, out, Math.floor((width - png.width) / 2), 0)
  return out
}

/** 根据差异百分比给出粗略结论。 */
export function verdictFor(percent) {
  if (percent < SCORE_SAME)
    return 'same'
  if (percent > SCORE_DIFFERENT)
    return 'different'
  return 'review'
}

export const VERDICT_TEXT = Object.freeze({
  same: '基本一致',
  review: '有差异，需要看图',
  different: '明显不同',
})

/** 每个通道差值都不超过它，才算和背景同色。 */
const BACKGROUND_TOLERANCE = 8
/** 背景取色那一圈向内缩的距离，躲开描边。 */
const EDGE_INSET = 4
/**
 * 内容框忽略的边缘宽度：预览区圆角最大 16 CSS 像素，2 倍图上是 32 像素，这里按 2 倍图取。
 * 组件内容都在预览区中部，丢掉这一圈不影响内容框。
 */
const CORNER_INSET = 32

function clampInset(png, inset) {
  return Math.max(0, Math.min(inset, Math.floor((Math.min(png.width, png.height) - 1) / 2)))
}

/** 向内缩 EDGE_INSET 的一圈像素里出现最多的颜色，当作背景色。圆角外的像素占比很小，不影响取众数。 */
export function backgroundColor(png) {
  const { data, width, height } = png
  const inset = clampInset(png, EDGE_INSET)
  const counts = new Map()
  const add = (x, y) => {
    const o = (y * width + x) * 4
    const key = (data[o] << 16) | (data[o + 1] << 8) | data[o + 2]
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  for (let x = inset; x < width - inset; x++) {
    add(x, inset)
    add(x, height - 1 - inset)
  }
  for (let y = inset; y < height - inset; y++) {
    add(inset, y)
    add(width - 1 - inset, y)
  }
  let best = 0
  let bestCount = -1
  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key
      bestCount = count
    }
  }
  return [(best >> 16) & 255, (best >> 8) & 255, best & 255]
}

/**
 * 内容框：和背景色不同的像素的外接矩形，坐标相对图片本身。
 * 离边缘 CORNER_INSET 以内的像素不看，圆角和描边不算内容。整张图都是背景时返回 null。
 */
export function contentBox(png) {
  const { data, width, height } = png
  const bg = backgroundColor(png)
  const inset = clampInset(png, CORNER_INSET)
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = inset; y < height - inset; y++) {
    for (let x = inset; x < width - inset; x++) {
      const o = (y * width + x) * 4
      if (Math.abs(data[o] - bg[0]) <= BACKGROUND_TOLERANCE
        && Math.abs(data[o + 1] - bg[1]) <= BACKGROUND_TOLERANCE
        && Math.abs(data[o + 2] - bg[2]) <= BACKGROUND_TOLERANCE) {
        continue
      }
      if (x < minX)
        minX = x
      if (x > maxX)
        maxX = x
      if (y < minY)
        minY = y
      if (y > maxY)
        maxY = y
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

/** 把图片自身坐标的框换算到补白后的画布坐标（水平居中、贴顶）。 */
function shiftBox(box, png, canvasWidth) {
  return box && { ...box, x: box.x + Math.floor((canvasWidth - png.width) / 2) }
}

function unionBox(a, b) {
  if (!a || !b)
    return a ?? b
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return { x, y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: Math.max(a.y + a.height, b.y + b.height) - y }
}

function percent(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 10_000) / 100
}

/**
 * 计算两张图的差异。
 *
 * diffPercent：不同像素占整张比较画布的比例。大片相同背景会把它冲淡。
 * contentDiffPercent：不同像素占「两边内容框并集」的比例，不受空白背景影响，结论按它给。
 * 两张图尺寸不同时，补白区域在比较画布里，但不在内容框里，所以尺寸差主要推高 diffPercent。
 *
 * @returns {{ width: number, height: number, diffPixels: number, diffPercent: number,
 *   contentBox: object | null, contentBoxes: { a: object | null, b: object | null },
 *   contentDiffPercent: number, verdict: string, diff: PNG }} 分数和差异图；contentBoxes 是两张图各自的内容框
 */
export function compareImages(a, b, { threshold = PIXEL_THRESHOLD } = {}) {
  const width = Math.max(a.width, b.width)
  const height = Math.max(a.height, b.height)
  const left = padTo(a, width, height)
  const right = padTo(b, width, height)
  const diff = new PNG({ width, height })
  const diffPixels = pixelmatch(left.data, right.data, diff.data, width, height, { threshold })
  const contentA = contentBox(a)
  const contentB = contentBox(b)
  const box = unionBox(shiftBox(contentA, a, width), shiftBox(contentB, b, width))
  let contentDiffPixels = 0
  if (box) {
    // pixelmatch 把不同像素画成红色（255,0,0），相同像素是淡化后的灰度。
    for (let y = box.y; y < box.y + box.height; y++) {
      for (let x = box.x; x < box.x + box.width; x++) {
        const o = (y * width + x) * 4
        if (diff.data[o] === 255 && diff.data[o + 1] === 0 && diff.data[o + 2] === 0)
          contentDiffPixels++
      }
    }
  }
  const diffPercent = percent(diffPixels, width * height)
  const contentDiffPercent = box ? percent(contentDiffPixels, box.width * box.height) : diffPercent
  return {
    width,
    height,
    diffPixels,
    diffPercent,
    contentBox: box,
    contentBoxes: { a: contentA, b: contentB },
    contentDiffPercent,
    verdict: verdictFor(contentDiffPercent),
    diff,
  }
}

/**
 * 左右拼接：左上游、右我们，中间一条灰色分隔，顶部各写一行标签。
 * 标签字号随图片缩放倍数（scale）放大，窄屏 2 倍图上也看得清。
 */
export function sideBySide(left, right, { leftLabel, rightLabel, scale = 1 }) {
  const textScale = 2 * scale
  const pad = 6 * scale
  const barHeight = GLYPH_HEIGHT * textScale + pad * 2
  const separator = SEPARATOR_WIDTH * scale
  const width = left.width + separator + right.width
  const height = barHeight + Math.max(left.height, right.height)
  const out = createPng(width, height, [255, 255, 255])
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isSeparator = x >= left.width && x < left.width + separator
      const color = isSeparator ? SEPARATOR_COLOR : y < barHeight ? LABEL_BAR_COLOR : null
      if (!color)
        continue
      const o = (y * width + x) * 4
      out.data[o] = color[0]
      out.data[o + 1] = color[1]
      out.data[o + 2] = color[2]
    }
  }
  blit(left, out, 0, barHeight)
  blit(right, out, left.width + separator, barHeight)
  const fit = (text, room) => {
    let value = text
    while (value.length > 1 && textWidth(value, textScale) > room - pad * 2)
      value = value.slice(0, -1)
    return value
  }
  drawText(out, fit(leftLabel, left.width), pad, pad, textScale, LABEL_TEXT_COLOR)
  drawText(out, fit(rightLabel, right.width), left.width + separator + pad, pad, textScale, LABEL_TEXT_COLOR)
  return out
}
