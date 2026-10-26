<script setup lang="ts">
import type { VNodeChild } from 'vue'
import type { ChartTooltipProps, ChartTooltipSlots } from './types.js'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  onScopeDispose,
  ref,
  render,
  useSlots,
  watch,
  watchPostEffect,
} from 'vue'
import { useChart } from '../context.js'
import { shouldRenderHoverDot } from '../tooltip.js'
import { isBandScale, xPixel } from '../utils.js'
import ChartTooltipContent from './ChartTooltipContent.vue'
import { useTooltipCard } from './useTooltipCard.js'

import '../../styles/chart-tooltip.css'

defineOptions({ name: 'AstryxChartTooltip' })

const props = withDefaults(defineProps<ChartTooltipProps>(), {
  series: () => [],
  hoverIndicator: true,
  showHoverDots: true,
  placement: 'auto',
})

const slots = useSlots() as ChartTooltipSlots & Record<string, unknown>

/** 调用方给了自定义内容插槽，就不再用内置样式。 */
const hasCustomContent = computed(() => slots.content != null)

const chart = useChart()

const { cardRef, cardStyle, isVisible, portalTarget, hoveredIndex, xValue, hasDatum, seriesValues }
  = useTooltipCard({
    series: () => props.series,
    placement: () => props.placement,
    hasCustomContent: () => hasCustomContent.value,
  })

/**
 * 卡片是 HTML，不能跟着 `<svg>` 里的元素一起创建——那样元素会落到 SVG 命名空间里，
 * 浏览器不认。所以卡片容器用 `document.createElement` 造出来，再挂到图表所在的 HTML 容器里，
 * 内容用 `render()` 单独渲染一遍。
 */
const cardHost = ref<HTMLElement | null>(null)
const currentInstance = getCurrentInstance()

/**
 * 内容的渲染外壳。它是一次独立渲染的根组件，负责把当前组件的 provide
 * （语言、主题……）转给卡片内容，用户自己写的插槽内容也就能读同一套上下文。
 */
const CardBody = defineComponent({
  name: 'AstryxChartTooltipBody',
  setup(_, { slots: cardSlots }) {
    return () => cardSlots.default?.() ?? null
  },
})

function cardBody(): VNodeChild {
  if (!hasDatum.value)
    return null
  if (hasCustomContent.value) {
    return slots.content?.({
      xValue: xValue.value,
      rows: seriesValues.value,
    }) as VNodeChild
  }
  return h(ChartTooltipContent, {
    xValue: xValue.value,
    rows: seriesValues.value,
  })
}

function renderCard(): void {
  const host = cardHost.value
  if (!host)
    return
  const vnode = h(CardBody, null, { default: cardBody })
  // 独立渲染没有组件父级，注入要从这里接上当前组件的 provide 链。
  const provides = (currentInstance as unknown as { provides?: Record<string | symbol, unknown> } | null)?.provides
  if (currentInstance) {
    vnode.appContext = {
      ...currentInstance.appContext,
      provides: provides ?? currentInstance.appContext.provides,
    }
  }
  render(vnode, host)
}

function removeCard(): void {
  const host = cardHost.value
  if (!host)
    return
  render(null, host)
  host.remove()
  cardHost.value = null
  cardRef.value = null
}

watch(portalTarget, (target) => {
  removeCard()
  if (!target || typeof document === 'undefined')
    return
  const host = document.createElement('div')
  host.className = 'astryx-chart-tooltip'
  host.setAttribute('role', 'tooltip')
  host.style.display = 'none'
  target.appendChild(host)
  cardHost.value = host
  cardRef.value = host
  renderCard()
}, { immediate: true })

onScopeDispose(removeCard)

/** 位置和显隐直接写在卡片元素上，不再经过模板。 */
watchPostEffect(() => {
  const host = cardHost.value
  if (!host)
    return
  for (const [name, value] of Object.entries(cardStyle.value))
    host.style.setProperty(name, value)
  host.style.display = isVisible.value ? '' : 'none'
})

/**
 * 悬停指示：图里有柱状系列时在分类轴上高亮整列，其余情况画一条竖线。
 * 两种画法共用同一个「悬停在哪一行」的状态，只是视觉惯例不同。
 */
const bandHighlight = computed(() => {
  if (!props.hoverIndicator || hoveredIndex.value == null)
    return null
  const hoveredDatum = chart.data[hoveredIndex.value]
  const xv = hoveredDatum?.[chart.xKey]
  if (hoveredDatum == null || xv == null)
    return null
  const hasBars = props.series.some(s => s.type === 'bar')
  if (!hasBars || !isBandScale(chart.xScale))
    return null

  const x = chart.xScale(String(xv)) ?? 0
  const bandwidth = chart.xScale.bandwidth()
  const pad = 8
  const rectX = Math.max(0, x - pad)
  const rectRight = Math.min(chart.width, x + bandwidth + pad)
  const topPad = Math.min(pad, chart.margin.top)
  return {
    x: rectX,
    y: -topPad,
    width: rectRight - rectX,
    height: chart.height + topPad,
  }
})

/** 折线、面积、散点的悬停位置画竖线；x 读不成有限值时跳过，免得画出 NaN 坐标。 */
const crosshairX = computed<number | null>(() => {
  if (!props.hoverIndicator || hoveredIndex.value == null || bandHighlight.value)
    return null
  const hoveredDatum = chart.data[hoveredIndex.value]
  if (!hoveredDatum)
    return null
  const px = xPixel(hoveredDatum, chart.xKey, chart.xScale)
  return Number.isFinite(px) ? px : null
})

/**
 * 每个系列的悬停圆点。这一点在这里没值（坐标是 NaN）时跳过——
 * 标记自己也会跳过这种点，圆点跟着一致。
 */
const hoverDots = computed(() => {
  if (!props.showHoverDots || hoveredIndex.value == null)
    return []
  const dots: { key: string, px: number, py: number, color: string }[] = []
  for (const series of props.series) {
    if (!shouldRenderHoverDot(series.type))
      continue
    const points = series._uid ? chart.resolved.get(series._uid) : undefined
    const point = points?.find(p => p.dataIndex === hoveredIndex.value)
    if (!point || !Number.isFinite(point.px) || !Number.isFinite(point.py))
      continue
    dots.push({
      key: series._uid ?? `${series.key}-${dots.length}`,
      px: point.px,
      py: point.py,
      color: series.color ?? series._resolvedColor ?? 'var(--astryx-color-border-emphasized)',
    })
  }
  return dots
})
</script>

<template>
  <rect
    v-if="bandHighlight"
    :x="bandHighlight.x"
    :y="bandHighlight.y"
    :width="bandHighlight.width"
    :height="bandHighlight.height"
    fill="currentColor"
    :opacity="0.06"
    :rx="4"
    pointer-events="none"
  />
  <line
    v-else-if="crosshairX !== null"
    :x1="crosshairX"
    :x2="crosshairX"
    y1="0"
    :y2="chart.height"
    class="astryx-chart-tooltip__crosshair"
    pointer-events="none"
  />
  <circle
    v-for="dot in hoverDots"
    :key="dot.key"
    :cx="dot.px"
    :cy="dot.py"
    :r="4"
    fill="var(--astryx-color-background-surface)"
    :stroke="dot.color"
    :stroke-width="2"
    pointer-events="none"
  />
</template>
