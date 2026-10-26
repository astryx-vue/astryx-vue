<script setup lang="ts">
import type { ChartTooltipProps, ChartTooltipSlots } from './types.js'
import { computed, ref, useSlots } from 'vue'
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

const chart = useChart()

const { cardRef, cardStyle, isVisible, portalTarget, hoveredIndex, xValue, seriesValues }
  = useTooltipCard({
    series: () => props.series,
    placement: () => props.placement,
    hasCustomContent: () => slots.content != null,
  })

/** 卡片元素交给我们自己的 ref，位置和尺寸都从它身上量。 */
const cardElement = ref<HTMLElement | null>(null)
function setCardRef(element: unknown): void {
  cardElement.value = (element as HTMLElement | null) ?? null
  cardRef.value = cardElement.value
}

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
  <!-- 服务端没有 HTML 容器可挂，只有 SVG 里的高亮和圆点。 -->
  <Teleport
    v-if="portalTarget"
    :to="portalTarget"
  >
    <div
      v-show="isVisible"
      :ref="setCardRef"
      class="astryx-chart-tooltip"
      :style="cardStyle"
      role="tooltip"
    >
      <slot
        name="content"
        :x-value="xValue"
        :rows="seriesValues"
      >
        <ChartTooltipContent
          :x-value="xValue"
          :rows="seriesValues"
        />
      </slot>
    </div>
  </Teleport>
</template>
