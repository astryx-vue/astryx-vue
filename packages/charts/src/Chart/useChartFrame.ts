import type { ComputedRef, Ref } from 'vue'
import type {
  ChartContext,
  ChartMargin,
  ChartPointerEvent,
  ChartScale,
  ResolvedPoint,
  SeriesContext,
  SeriesDef,
} from '../types.js'
import type { ChartProps } from './types.js'
import { computed, onMounted, onScopeDispose, ref, useId, watch } from 'vue'
import { computeLayout } from '../layout.js'
import { isUtilityMarkType } from '../types.js'
import { useChartColors } from '../useChartColors.js'
import { DEFAULT_MARGIN } from './types.js'

/** 图表根算出来的一切：尺寸、比例尺、点位、配色和指针事件。 */
export interface ChartFrame {
  containerRef: Ref<HTMLElement | null>
  svgRef: Ref<SVGSVGElement | null>
  /** 容器量到的宽度还没出来（服务端渲染，或者还没挂载）时是 0。 */
  containerWidth: ComputedRef<number>
  safeHeight: ComputedRef<number>
  margin: ComputedRef<ChartMargin>
  innerWidth: ComputedRef<number>
  innerHeight: ComputedRef<number>
  xScale: ComputedRef<ChartScale>
  yScale: ComputedRef<SeriesContext['yScale']>
  yBandScale: ComputedRef<SeriesContext['yBandScale']>
  resolved: ComputedRef<Map<string, ResolvedPoint[]>>
  /** 交给各系列 `render()` 的上下文。 */
  seriesCtx: ComputedRef<SeriesContext>
  /** 提供给子组件的上下文，身份不变、字段是活的。 */
  chart: ChartContext
  handlePointerMove: (event: PointerEvent) => void
  handlePointerLeave: () => void
}

/** 把 `[0, ∞)` 之外的值（NaN、负数）压成 0，比例尺的取值域不能是负数。 */
function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

/**
 * 图表根的全部计算：量宽度、定尺寸、分配调色板、跑布局、分发指针事件。
 *
 * 宽度有两个来源：浏览器里量容器（`ResizeObserver`，量到之后一直用），
 * 量不到时用 `width` prop。服务端没有 DOM，只有 `width` 这一条路。
 */
export function useChartFrame(props: ChartProps): ChartFrame {
  const containerRef = ref<HTMLElement | null>(null)
  const svgRef = ref<SVGSVGElement | null>(null)
  // 还没量到就是 null，这样 `width` prop 才能当兜底。
  const measuredWidth = ref<number | null>(null)

  onMounted(() => {
    const element = containerRef.value
    ;(globalThis as any).__f2b = { element: !!element, hasRO: typeof ResizeObserver !== 'undefined' }
    if (!element || typeof ResizeObserver === 'undefined')
      return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      ;((globalThis as any).__f2bLog ??= []).push({ content: entry?.contentRect.width, rect: (entries[0]?.target as HTMLElement)?.getBoundingClientRect().width, display: getComputedStyle(entries[0]?.target as HTMLElement).width, parent: (entries[0]?.target as HTMLElement)?.parentElement?.clientWidth })
      if (entry)
        measuredWidth.value = entry.contentRect.width
    })
    observer.observe(element)
    onScopeDispose(() => observer.disconnect())
  })

  const margin = computed<ChartMargin>(() => ({ ...DEFAULT_MARGIN, ...props.margin }))
  const safeHeight = computed(() => nonNegative(props.height as number))
  const containerWidth = computed(() => measuredWidth.value ?? props.width ?? 0)

  const innerWidth = computed(() => nonNegative(containerWidth.value - margin.value.left - margin.value.right))
  const innerHeight = computed(() => nonNegative(safeHeight.value - margin.value.top - margin.value.bottom))

  // 没写死颜色的主系列（自动配色或按点取色）各分一个调色板颜色。
  // 标注类标记不占调色板槽位。赋值时机和上游一样，在第一次画之前，
  // 但放在 watch 而不是渲染里，免得渲染带上副作用。
  const chartColors = useChartColors()
  watch(() => props.series, (series) => {
    const needsColor = series.filter(s => !isUtilityMarkType(s.type) && s.color == null)
    const palette = chartColors.categorical(Math.max(needsColor.length, 1))
    for (let i = 0; i < needsColor.length; i++)
      needsColor[i]._resolvedColor = palette[i % palette.length]
  }, { immediate: true })

  const layout = computed(() => computeLayout({
    data: props.data,
    xKey: props.xKey,
    series: props.series,
    width: innerWidth.value,
    height: innerHeight.value,
    yBaseline: props.yBaseline,
    yDomain: props.yDomain,
    xDomain: props.xDomain,
  }))

  const xScale = computed(() => layout.value.xScale)
  const yScale = computed(() => layout.value.yScale)
  const yBandScale = computed(() => layout.value.yBandScale)
  const resolved = computed(() => layout.value.resolved)

  const seriesCtx = computed<SeriesContext>(() => ({
    data: props.data,
    xKey: props.xKey,
    xScale: layout.value.xScale,
    yScale: layout.value.yScale,
    yBandScale: layout.value.yBandScale,
    width: innerWidth.value,
    height: innerHeight.value,
  }))

  // ── 指针事件 ──────────────────────────────────────────────────────────
  // 图表根只有一层指针捕获，交互子组件订阅这一条流。
  const pointerHandlers = new Set<(event: ChartPointerEvent) => void>()

  function onPointer(handler: (event: ChartPointerEvent) => void): () => void {
    pointerHandlers.add(handler)
    return () => {
      pointerHandlers.delete(handler)
    }
  }

  function dispatch(event: ChartPointerEvent): void {
    for (const handler of pointerHandlers)
      handler(event)
  }

  function handlePointerMove(event: PointerEvent): void {
    const svg = svgRef.value
    const target = event.currentTarget as SVGRectElement | null
    if (!svg || !target)
      return
    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const matrix = target.getScreenCTM()?.inverse()
    if (!matrix)
      return
    const cursor = point.matrixTransform(matrix)

    // 找最近的点只看横向距离：整根竖列都是悬停区。
    let nearest: ChartPointerEvent['nearest'] = null
    let bestXDistance = Number.POSITIVE_INFINITY
    for (const [seriesKey, points] of layout.value.resolved) {
      for (const p of points) {
        const distance = Math.abs(p.px - cursor.x)
        if (distance < bestXDistance) {
          bestXDistance = distance
          nearest = { ...p, seriesKey }
        }
      }
    }
    dispatch({ x: cursor.x, y: cursor.y, nearest, active: event.buttons > 0 })
  }

  function handlePointerLeave(): void {
    dispatch({ x: -1, y: -1, nearest: null, active: false })
  }

  const chart: ChartContext = {
    get width() {
      return innerWidth.value
    },
    get height() {
      return innerHeight.value
    },
    get margin() {
      return margin.value
    },
    get data() {
      return props.data
    },
    get xKey() {
      return props.xKey
    },
    get xScale() {
      return layout.value.xScale
    },
    get yScale() {
      return layout.value.yScale
    },
    get yBandScale() {
      return layout.value.yBandScale
    },
    get resolved() {
      return layout.value.resolved
    },
    onPointer,
    svgRef,
  }

  return {
    containerRef,
    svgRef,
    containerWidth,
    safeHeight,
    margin,
    innerWidth,
    innerHeight,
    xScale,
    yScale,
    yBandScale,
    resolved,
    seriesCtx,
    chart,
    handlePointerMove,
    handlePointerLeave,
  }
}

/** 一次渲染里唯一的 id，给 clipPath 和无障碍描述引用。 */
export function useChartIds(): { clipId: string, descId: string } {
  const chartId = useId()
  // SVG 的 `url(#id)` 里不能出现 `:`。
  return {
    clipId: `plot-${chartId.replace(/:/g, '')}`,
    descId: `${chartId}-desc`,
  }
}

/** 图表根已经把系列按 `_uid` 算好了点位，这里按同一个身份取回来。 */
export function seriesPoints(
  series: SeriesDef,
  resolved: Map<string, ResolvedPoint[]>,
): ResolvedPoint[] | undefined {
  return series._uid ? resolved.get(series._uid) : undefined
}
