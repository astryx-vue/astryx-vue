<script setup lang="ts">
import type { ChartGridProps } from './types.js'
import type { ScaleLinear, ScaleTime } from 'd3-scale'
import { computed } from 'vue'
import { useChart } from '../context.js'
import { isBandScale } from '../utils.js'

import '../../styles/chart-grid.css'

defineOptions({ name: 'AstryxChartGrid' })

const props = withDefaults(defineProps<ChartGridProps>(), {
  horizontal: true,
  vertical: false,
  tickCount: 5,
})

const chart = useChart()

const width = computed(() => chart.width)
const height = computed(() => chart.height)

/**
 * 交给 d3 之前先收拾刻度数量：`.ticks(n)` 会按 n 分配数组，特别大的 n 直接抛
 * `RangeError`，非有限值或负数则画不出线。夹到合理整数（0 表示不要线），非法输入退回默认值。
 */
const safeTickCount = computed(() => (Number.isFinite(props.tickCount) && props.tickCount >= 0
  ? Math.min(Math.floor(props.tickCount), 1000)
  : 5))

interface GridLine {
  value: string
  pos: number
}

/**
 * 横向网格线。跳过 y=0 那一条：零线由坐标轴自己强调，画两遍会叠出一条更深的线。
 * 键用刻度的值而不是像素位置——退化比例尺（零宽、还没量到宽度）会算出重复或 NaN 的位置。
 */
const horizontalLines = computed<GridLine[]>(() => {
  if (!props.horizontal)
    return []
  return chart.yScale
    .ticks(safeTickCount.value)
    .filter(tick => tick !== 0)
    .map(tick => ({ value: String(tick), pos: chart.yScale(tick) }))
})

/** 纵向网格线。分类轴对齐到每条带的中心，连续轴用 d3 的刻度。 */
const verticalLines = computed<GridLine[]>(() => {
  if (!props.vertical)
    return []
  const scale = chart.xScale
  if (isBandScale(scale)) {
    return scale.domain().map(d => ({
      value: String(d),
      pos: (scale(d) ?? 0) + scale.bandwidth() / 2,
    }))
  }
  const linear = scale as ScaleLinear<number, number> | ScaleTime<number, number>
  return linear.ticks(safeTickCount.value).map(d => ({
    value: String(d),
    pos: linear(d as number & Date),
  }))
})
</script>

<template>
  <g>
    <line
      v-for="line in horizontalLines"
      :key="`h-${line.value}`"
      :x1="0"
      :x2="width"
      :y1="line.pos"
      :y2="line.pos"
      class="astryx-chart-grid__line"
    />
    <line
      v-for="line in verticalLines"
      :key="`v-${line.value}`"
      :x1="line.pos"
      :x2="line.pos"
      :y1="0"
      :y2="height"
      class="astryx-chart-grid__line"
    />
  </g>
</template>
