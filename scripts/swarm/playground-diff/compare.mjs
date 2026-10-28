/**
 * 把原版和我们的元素列表配对、逐项判偏差。纯函数，没有浏览器依赖。
 *
 * 元素形状（收集脚本给出的）：
 *   {
 *     kind: 'text' | 'icon',
 *     text: '提交订单',              // 原始文字；图标是它配对用的文字或 aria-label
 *     order: 12,                     // 文档顺序，配对时同文字按它排队
 *     box: { x, y, w, h },           // 相对预览 iframe 内容的绝对坐标（所有祖先滚动都还原到 0）
 *     style: { fontSize, fontWeight, color, backgroundColor },
 *   }
 */
import { isDynamicText, normalizeText, parseColor, parseFontWeight, parsePx } from './normalize.mjs'

/** 判定阈值：位置和尺寸差超过这个像素数算偏差。 */
export const POSITION_TOLERANCE = 1
export const SIZE_TOLERANCE = 1
/** 字号差超过 0.5px 算不同（浏览器会给小数）。 */
export const FONT_SIZE_TOLERANCE = 0.5
/** 颜色某个通道差超过 4 算不同。 */
export const COLOR_TOLERANCE = 4
/** 透明度差超过 0.05 算不同。 */
export const ALPHA_TOLERANCE = 0.05

/** 一个元素只报一处偏差，按这个顺序挑第一处。 */
export const ATTRIBUTE_ORDER = ['position', 'size', 'font-size', 'font-weight', 'color', 'background-color']

const ATTRIBUTE_LABEL = {
  'position': '位置',
  'size': '尺寸',
  'font-size': '字号',
  'font-weight': '字重',
  'color': '文字颜色',
  'background-color': '背景色',
  'missing': '缺失',
  'extra': '多余',
}

export function attributeLabel(attribute) {
  return ATTRIBUTE_LABEL[attribute] ?? attribute
}

/** 配对用的键：文字 + 图标分开编号，避免同一个词的文字和图标互相抢位置。 */
export function pairKey(item) {
  return `${item.kind === 'icon' ? 'icon' : 'text'}:${normalizeText(item.text)}`
}

/**
 * 按（归一化文字，同文字内文档顺序第 N 个）一一配对。
 * 返回 { pairs, missing, extra }，missing 是只有原版有，extra 是只有我们有。
 */
export function pairItems(upstreamItems, ourItems) {
  const upstreamGroups = groupByKey(upstreamItems)
  const ourGroups = groupByKey(ourItems)
  const keys = new Set([...upstreamGroups.keys(), ...ourGroups.keys()])
  const pairs = []
  const missing = []
  const extra = []
  for (const key of keys) {
    const left = upstreamGroups.get(key) ?? []
    const right = ourGroups.get(key) ?? []
    const shared = Math.min(left.length, right.length)
    for (let index = 0; index < shared; index++)
      pairs.push({ key, index, upstream: left[index], ours: right[index] })
    missing.push(...left.slice(shared))
    extra.push(...right.slice(shared))
  }
  return { pairs, missing, extra }
}

function groupByKey(items) {
  const groups = new Map()
  for (const item of items) {
    const key = pairKey(item)
    const bucket = groups.get(key)
    if (bucket)
      bucket.push(item)
    else
      groups.set(key, [item])
  }
  for (const bucket of groups.values())
    bucket.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return groups
}

/** 数值差，任一为空时返回 null。 */
function delta(a, b) {
  const left = parsePx(a)
  const right = parsePx(b)
  if (left == null || right == null)
    return null
  return right - left
}

function colorDelta(a, b) {
  const left = parseColor(a)
  const right = parseColor(b)
  if (!left || !right)
    return null
  // 两边都完全透明就等于一样，不用再比 rgb。
  if (left.a === 0 && right.a === 0)
    return 0
  return Math.max(Math.abs(left.r - right.r), Math.abs(left.g - right.g), Math.abs(left.b - right.b))
}

/**
 * 比较一对元素，返回 null（一致）或一处偏差。
 * 偏差里有 attribute、原版值、我们的值，以及用于排序的 severity。
 */
export function diffPair(pair) {
  const { upstream, ours } = pair
  const label = displayText(upstream, ours)
  const boxDelta = Math.max(
    Math.abs((ours.box?.x ?? 0) - (upstream.box?.x ?? 0)),
    Math.abs((ours.box?.y ?? 0) - (upstream.box?.y ?? 0)),
  )
  const severityOf = extra => Math.max(boxDelta, extra)

  if (boxDelta > POSITION_TOLERANCE) {
    const axis = Math.abs((ours.box?.x ?? 0) - (upstream.box?.x ?? 0))
      >= Math.abs((ours.box?.y ?? 0) - (upstream.box?.y ?? 0))
      ? 'x'
      : 'y'
    return {
      attribute: 'position',
      label,
      text: label,
      detail: axis,
      upstream: coordinateText(upstream.box?.[axis]),
      ours: coordinateText(ours.box?.[axis]),
      difference: boxDelta,
      severity: severityOf(200 + boxDelta),
    }
  }

  const sizeDelta = Math.max(
    Math.abs((ours.box?.w ?? 0) - (upstream.box?.w ?? 0)),
    Math.abs((ours.box?.h ?? 0) - (upstream.box?.h ?? 0)),
  )
  if (sizeDelta > SIZE_TOLERANCE) {
    const axis = Math.abs((ours.box?.w ?? 0) - (upstream.box?.w ?? 0))
      >= Math.abs((ours.box?.h ?? 0) - (upstream.box?.h ?? 0))
      ? 'w'
      : 'h'
    return {
      attribute: 'size',
      label,
      text: label,
      detail: axis,
      upstream: coordinateText(upstream.box?.[axis]),
      ours: coordinateText(ours.box?.[axis]),
      difference: sizeDelta,
      severity: severityOf(150 + sizeDelta),
    }
  }

  if (upstream.kind === 'icon' || ours.kind === 'icon')
    return null

  const fontDelta = delta(upstream.style?.fontSize, ours.style?.fontSize)
  if (fontDelta != null && Math.abs(fontDelta) > FONT_SIZE_TOLERANCE) {
    return {
      attribute: 'font-size',
      label,
      text: label,
      upstream: upstream.style.fontSize,
      ours: ours.style.fontSize,
      difference: Math.abs(fontDelta),
      severity: severityOf(60 + Math.abs(fontDelta) * 10),
    }
  }

  const weightDelta = delta(parseFontWeight(upstream.style?.fontWeight), parseFontWeight(ours.style?.fontWeight))
  if (weightDelta != null && weightDelta !== 0) {
    return {
      attribute: 'font-weight',
      label,
      text: label,
      upstream: String(upstream.style.fontWeight),
      ours: String(ours.style.fontWeight),
      difference: Math.abs(weightDelta),
      severity: severityOf(80),
    }
  }

  const textColor = colorDelta(upstream.style?.color, ours.style?.color)
  if (textColor != null && textColor > COLOR_TOLERANCE) {
    return {
      attribute: 'color',
      label,
      text: label,
      upstream: String(upstream.style.color),
      ours: String(ours.style.color),
      difference: textColor,
      severity: severityOf(70 + textColor / 4),
    }
  }

  const background = colorDelta(upstream.style?.backgroundColor, ours.style?.backgroundColor)
  if (background != null && background > COLOR_TOLERANCE) {
    return {
      attribute: 'background-color',
      label,
      text: label,
      upstream: String(upstream.style.backgroundColor),
      ours: String(ours.style.backgroundColor),
      difference: background,
      severity: severityOf(50 + background / 4),
    }
  }

  return null
}

function displayText(a, b) {
  const raw = String(a?.text ?? b?.text ?? '').replace(/\s+/g, ' ').trim()
  return raw || '（无文字）'
}

function coordinateText(value) {
  return `${Math.round((Number(value) || 0) * 100) / 100}px`
}

/** 100px 一格的纵向分段，键是这一段的起点。 */
export function bandStart(y) {
  return Math.floor((Number(y) || 0) / 100) * 100
}

export function bandLabel(start) {
  return `y ${start}–${start + 99}px`
}

/**
 * 比较两边收集到的元素，返回完整结果。
 *
 * - 列表里每条只写出最要紧的一处偏差（一个元素最多算 1 次）。
 * - 文字配不上又像时间戳/相对时间的，标成「疑似动态文本」，不计入 deviationCount。
 * - 缺失数只算正文缺失，动态文本不算。
 */
export function compareSides(upstreamItems, ourItems) {
  const { pairs, missing, extra } = pairItems(upstreamItems, ourItems)
  const deviations = []
  for (const pair of pairs) {
    const found = diffPair(pair)
    if (found)
      deviations.push({ ...found, kind: 'deviation', node: pair.upstream?.node ?? pair.ours?.node, y: pairY(pair) })
  }
  for (const item of missing) {
    const dynamic = item.kind === 'text' && isDynamicText(item.text)
    deviations.push({
      kind: dynamic ? 'dynamic-missing' : 'missing',
      attribute: 'missing',
      node: item.node,
      label: displayText(item),
      text: displayText(item),
      upstream: displayText(item),
      ours: '（没有）',
      difference: 0,
      dynamic,
      y: item.box?.y ?? 0,
      severity: dynamic ? 5 : 1000,
    })
  }
  for (const item of extra) {
    const dynamic = item.kind === 'text' && isDynamicText(item.text)
    deviations.push({
      kind: dynamic ? 'dynamic-extra' : 'extra',
      attribute: 'extra',
      node: item.node,
      label: displayText(item),
      text: displayText(item),
      upstream: '（没有）',
      ours: displayText(item),
      difference: 0,
      dynamic,
      y: item.box?.y ?? 0,
      severity: dynamic ? 5 : 900,
    })
  }
  deviations.sort((a, b) => b.severity - a.severity || a.y - b.y)

  const counted = deviations.filter(item => item.kind === 'deviation' || item.kind === 'missing' || item.kind === 'extra')
  const missingReport = deviations.filter(item => item.kind === 'missing' || item.kind === 'dynamic-missing')
  const extraReport = deviations.filter(item => item.kind === 'extra' || item.kind === 'dynamic-extra')

  const bands = new Map()
  for (const item of counted) {
    const start = bandStart(item.y)
    const bucket = bands.get(start)
    if (bucket)
      bucket.count += 1
    else
      bands.set(start, { start, count: 1 })
  }

  return {
    pairCount: pairs.length,
    deviationCount: counted.length,
    missingCount: missingReport.length,
    extraCount: extraReport.length,
    staticMissingCount: missingReport.filter(item => item.kind === 'missing').length,
    dynamicMissingCount: missingReport.filter(item => item.kind === 'dynamic-missing').length,
    dynamicExtraCount: extraReport.filter(item => item.kind === 'dynamic-extra').length,
    deviations,
    bands: [...bands.values()].sort((a, b) => a.start - b.start),
  }
}

function pairY(pair) {
  const upstreamY = pair.upstream?.box?.y
  const ourY = pair.ours?.box?.y
  if (typeof upstreamY === 'number')
    return upstreamY
  return typeof ourY === 'number' ? ourY : 0
}

/** 判定是否通过：偏差不超过 3 个，并且没有正文缺失。 */
export function verdict(result, { maxDeviations = 3 } = {}) {
  const passed = result.deviationCount <= maxDeviations && result.staticMissingCount === 0
  return { passed, maxDeviations }
}
