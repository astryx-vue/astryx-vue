import type { ChartScale, ResolvedPoint, SeriesContext, SeriesDef, YBaseline } from './types.js'
import { scaleBand, scaleLinear } from 'd3-scale'
import { stack as d3Stack, stackOffsetNone, stackOrderNone } from 'd3-shape'

/**
 * 一次布局算出所有系列共用的东西：x/y 比例尺、堆叠、分组，然后挨个调用系列的
 * `resolve()`。布局本身不认识任何具体标记类型。
 */

/**
 * 只有连续点的图表（没有柱和面积那种零基线）上下各留数据范围的这个比例当余量，
 * 免得端点和曲线过冲贴到绘图区边缘。
 */
const CONTINUOUS_HEADROOM = 0.08

export interface LayoutInput {
  data: Record<string, unknown>[]
  xKey: string
  series: SeriesDef[]
  width: number
  height: number
  /** 没给 `yDomain` 时 y 轴范围怎么定，默认 `'auto'`。 */
  yBaseline?: YBaseline
  /** 显式 y 轴范围 `[min, max]`。它说了算——不加基线、不留余量、不 `nice()`。 */
  yDomain?: [number, number]
  /**
   * 数值/线性 x 轴的显式范围 `[min, max]`。它说了算，`data` 为空时也照用
   * （流式窗口要稳定）。band 比例尺时忽略。
   */
  xDomain?: [number, number]
}

export interface LayoutResult {
  xScale: ChartScale
  yScale: ReturnType<typeof scaleLinear<number, number>>
  /**
   * 分类 y 比例尺。有系列声明了 `layout.yBandKey`（比如热力图的每一行）时才有，
   * 这时 y 轴是分类轴，线性 `yScale` 用不上。
   */
  yBandScale?: ReturnType<typeof scaleBand<string>>
  resolved: Map<string, ResolvedPoint[]>
}

/** 只有显式范围的两头都是可用的有限数时才算数。 */
function isFiniteDomain(domain: [number, number]): boolean {
  return Number.isFinite(domain[0]) && Number.isFinite(domain[1])
}

/**
 * 一列数字的 `[min, max]`，避开 `Math.min(...arr)` / `Math.max(...arr)` 的两个坑：
 * 一个 NaN/Infinity 把结果污染掉，以及数组太大时展开参数把调用栈撑爆
 * （GL 标记一次几十万个点）。空的范围或全都相等时会把范围撑开，
 * 免得比例尺塌到一个像素上。
 */
function finiteExtent(nums: number[]): [number, number] {
  let lo = Number.POSITIVE_INFINITY
  let hi = Number.NEGATIVE_INFINITY
  for (const v of nums) {
    if (Number.isFinite(v)) {
      if (v < lo)
        lo = v
      if (v > hi)
        hi = v
    }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi))
    return [0, 1]

  if (lo === hi) {
    const pad = Math.abs(lo) * 0.5 || 1
    return [lo - pad, hi + pad]
  }
  return [lo, hi]
}

export function computeLayout({
  data,
  xKey,
  series,
  width,
  height,
  yBaseline,
  yDomain,
  xDomain,
}: LayoutInput): LayoutResult {
  // y 轴是分类轴（热力图）时，x 轴也必然分类：列和行一样铺满绘图区。这时去掉
  // 柱状图那种外侧留白，网格才能四边都贴住坐标轴，不留不对称的缝。
  const yBandKey = series.find(s => s.layout.yBandKey != null)?.layout.yBandKey
  const isCategoricalGrid = yBandKey != null

  // 1. x 比例尺
  const xValues = data.map(d => d[xKey])
  const isNumericX = xValues.length > 0 && xValues.every(v => typeof v === 'number')

  let xScale: ChartScale
  if (xDomain && isFiniteDomain(xDomain)) {
    // 显式范围说了算（不 `nice()`）：流式窗口能稳定，`data` 为空时比例尺也有效。
    // 只在两头都有限时才信它，NaN/Infinity 会把比例尺弄塌。
    xScale = scaleLinear().domain(xDomain).range([0, width])
  }
  else if (isNumericX) {
    // NaN 也满足 `typeof === 'number'`，所以范围要防御性地算。
    const [lo, hi] = finiteExtent(xValues as number[])
    xScale = scaleLinear().domain([lo, hi]).range([0, width]).nice()
  }
  else {
    xScale = scaleBand<string>()
      .domain(xValues.map(String))
      .range([0, width])
      .padding(isCategoricalGrid ? 0 : 0.2)
  }

  // 2. 从所有系列的数据列算 y 轴范围
  // 一遍扫完：收集数据列并集、有没有标记要求含零基线、以及堆叠分组。
  // `stackGroups` 下面第 3 步的堆叠要原样复用。
  const allKeys = new Set<string>()
  let includeZero = false
  const stackGroups = new Map<string, string[]>()
  for (const s of series) {
    for (const k of s.dataKeys)
      allKeys.add(k)

    if (s.layout.includeZero)
      includeZero = true

    const primaryKey = s.dataKeys[0]
    if (s.layout.stack && primaryKey != null) {
      const group = stackGroups.get(s.layout.stack) ?? []
      group.push(primaryKey)
      stackGroups.set(s.layout.stack, group)
    }
  }

  let yMin = Number.POSITIVE_INFINITY
  let yMax = Number.NEGATIVE_INFINITY

  // 堆叠系列贡献的是累计值经过的每一个边界，不只是最终总量——和第 3 步真正画出来
  // 的 `stackOffsetNone` 逐层一致。0 基线也要算，因为堆叠从 0 开始画。只看总量会让
  // 画出来的柱/面积跑到比例尺之外：正负混合、内部峰值超过总量净值的堆叠，或者
  // `'data'` 基线但从 0 开始画的堆叠，都会被裁掉。用 `Number.isFinite`
  // （而不是 `typeof === 'number'`）挡住 NaN/Infinity，非有限的一层就像
  // `stackOffsetNone` 那样把累计值原样带下去，不贡献新值。
  const stackedKeys = new Set<string>()
  for (const [, keys] of stackGroups) {
    for (const k of keys)
      stackedKeys.add(k)

    for (const d of data) {
      let acc = 0
      if (acc < yMin)
        yMin = acc
      if (acc > yMax)
        yMax = acc

      for (const k of keys) {
        const v = d[k]
        if (Number.isFinite(v)) {
          acc += v as number
          if (acc < yMin)
            yMin = acc
          if (acc > yMax)
            yMax = acc
        }
      }
    }
  }

  // 非堆叠系列贡献各自的有限值。
  for (const d of data) {
    for (const k of allKeys) {
      // 上面已经处理过
      if (stackedKeys.has(k))
        continue
      const v = d[k]
      if (Number.isFinite(v)) {
        const n = v as number
        if (n < yMin)
          yMin = n
        if (n > yMax)
          yMax = n
      }
    }
  }

  // 定下最终的 y 轴范围
  let yDomainFinal: [number, number]
  let applyNice = true

  if (yDomain && isFiniteDomain(yDomain)) {
    // 调用方要的就是这个范围（缩放、流式）。不加基线、不留余量、不 `nice()`——
    // 这里取整会让画面一跳一跳。只在两头有限时才信它，否则退回自动算法。
    yDomainFinal = yDomain
    applyNice = false
  }
  else {
    // 一个有限值都没有（空数据、或全不是数字）。
    if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
      yMin = 0
      yMax = 1
    }
    // 范围为零（只有一个点、或全相等）——撑开，让标记看得见、刻度也合理。
    if (yMin === yMax) {
      const pad = Math.abs(yMin) * 0.5 || 1
      yMin -= pad
      yMax += pad
    }

    const mode: YBaseline = yBaseline ?? 'auto'
    if (mode === 'zero') {
      const abs = Math.max(Math.abs(yMin), Math.abs(yMax))
      yMin = -abs
      yMax = abs
    }
    else if (mode === 'data') {
      // 紧贴数据范围——不强制含零，也不留余量。
    }
    else {
      // `'auto'`：柱和面积用真实的零基线；只有连续点的图表留余量。
      if (includeZero) {
        if (yMin > 0)
          yMin = 0
        if (yMax < 0)
          yMax = 0
      }
      else {
        const pad = (yMax - yMin || 1) * CONTINUOUS_HEADROOM
        yMin -= pad
        yMax += pad
      }
    }
    yDomainFinal = [yMin, yMax]
  }

  const yScaleBase = scaleLinear().domain(yDomainFinal).range([height, 0])
  const yScale = applyNice ? yScaleBase.nice() : yScaleBase

  // 2b. 分类 y 比例尺
  // 有系列声明了 `yBandKey`（比如热力图的每一行）时，y 轴就是分类的：按这一列的
  // 不同取值建 band 比例尺，标记和左侧坐标轴才能共用同一套行布局。上面那个线性
  // yScale 留着但用不上。
  // 不给 band 留 padding：热力图的行要铺满整个高度，格子之间的细线由标记自己的
  // `cellGap` 画。留了 padding 网格会内缩，上下各露一条缝。
  let yBandScale: ReturnType<typeof scaleBand<string>> | undefined
  if (yBandKey != null) {
    const cats = [...new Set(data.map(d => String(d[yBandKey])))]
    yBandScale = scaleBand<string>().domain(cats).range([0, height]).padding(0)
  }

  // 3. 堆叠
  const stackedData = new Map<string, { y0: number, y1: number }[]>()
  for (const [, keys] of stackGroups) {
    const stackGen = d3Stack<Record<string, unknown>>()
      .keys(keys)
      .order(stackOrderNone)
      .offset(stackOffsetNone)
    const stacked = stackGen(data)
    for (const layer of stacked)
      stackedData.set(layer.key, layer.map(d => ({ y0: d[0], y1: d[1] })))
  }

  // 4. 柱状分组
  // 柱状既可以堆叠也可以并排。堆叠起来再分组的，同一个堆叠组在同一个柱状分组里
  // 只占一条子带；没堆叠的分组柱，每个系列各占一条子带。
  const barGroups = new Map<string, string[]>()
  for (const s of series) {
    if (s.type === 'bar' && s.layout.group) {
      const group = barGroups.get(s.layout.group) ?? []
      // 同一个堆叠组共用一个槽位，所以槽位标识用堆叠名（没堆叠就用系列键）。
      const slotKey = s.layout.stack ?? s.key
      if (!group.includes(slotKey))
        group.push(slotKey)
      barGroups.set(s.layout.group, group)
    }
  }

  // 5. 逐个系列算点位
  const ctx: SeriesContext = {
    data,
    xKey,
    xScale,
    yScale,
    yBandScale,
    width,
    height,
  }
  const resolved = new Map<string, ResolvedPoint[]>()

  // 每个堆叠组里哪一层在最上面
  const stackTopKeys = new Set<string>()
  for (const [, keys] of stackGroups) {
    // 组里最后一个键画在最上层
    if (keys.length > 0)
      stackTopKeys.add(keys[keys.length - 1])
  }

  for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
    const s = series[seriesIndex]
    // 按数组位置分配唯一身份。两个系列共用同一个 dataKey（因此 `key` 相同）也各有
    // 各的 uid，点位映射和列表渲染都不会悄悄丢掉其中一个。
    s._uid = `${seriesIndex}:${s.key}`
    const stackOffsets = stackedData.get(s.dataKeys[0])

    // 标记这个系列是不是堆叠组的最上层
    if (s.layout.stack)
      s._isTopOfStack = stackTopKeys.has(s.dataKeys[0])
    else
      s._isTopOfStack = true

    let groupInfo: { index: number, count: number } | undefined
    if (s.layout.group) {
      const groupKeys = barGroups.get(s.layout.group)
      if (groupKeys) {
        // 堆叠起来再分组时，槽位标识是堆叠名
        const slotKey = s.layout.stack ?? s.key
        groupInfo = {
          index: groupKeys.indexOf(slotKey),
          count: groupKeys.length,
        }
      }
    }

    const points = s.resolve(ctx, stackOffsets, groupInfo)
    resolved.set(s._uid, points)
  }

  return { xScale, yScale, yBandScale, resolved }
}
