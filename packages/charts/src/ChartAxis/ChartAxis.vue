<script setup lang="ts">
import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale'
import type { ChartAxisProps } from './types.js'
import { characterCount, truncateCharacters } from '@astryx-vue/core'
import { computed } from 'vue'
import { useChart } from '../context.js'
import { isBandScale } from '../utils.js'

import '../../styles/chart-axis.css'

defineOptions({ name: 'AstryxChartAxis' })

const props = withDefaults(defineProps<ChartAxisProps>(), {
  tickCount: 5,
  maxTicks: undefined,
  tickFormat: undefined,
  truncate: undefined,
  animated: true,
  showAxisLine: undefined,
  showTicks: false,
})

/** 刻度线伸出轴线的长度。文字再往外让 4px，两者不重叠。 */
const TICK_SIZE = 6

const chart = useChart()

// 上下文对象的字段是活的 getter，包成 computed 才能让模板和计算属性跟着更新。
const width = computed(() => chart.width)
const height = computed(() => chart.height)

const isHorizontal = computed(() => props.position === 'top' || props.position === 'bottom')

/**
 * 分类 y 轴（比如热力图的每一行）走 `yBandScale`，要优先于线性 `yScale`：
 * 否则左轴会画一堆没有意义的数值刻度，而不是对齐到每一行的分类。
 */
const scale = computed(() => (isHorizontal.value
  ? chart.xScale
  : (chart.yBandScale ?? chart.yScale)))

/** 开了 `showTicks` 就必须有轴线，不然短刻度线悬在空中。 */
const renderAxisLine = computed(() => (props.showAxisLine
  ?? props.position === 'bottom')
|| props.showTicks)

/**
 * 交给 d3 之前先收拾刻度数量：`.ticks(n)` 会按 n 分配数组，
 * 特别大的 n 直接抛 `RangeError`，非有限值或负数则画不出刻度。
 * 所以夹到合理的整数（0 仍然表示不要刻度），非法输入退回默认值。
 */
const safeTickCount = computed(() => (Number.isFinite(props.tickCount) && props.tickCount >= 0
  ? Math.min(Math.floor(props.tickCount), 1000)
  : 5))

/**
 * 连续比例尺（数值、时间）默认用 d3 自己的刻度格式化：数值不会出现
 * `0.30000000000000004` 这类浮点尘埃，时间也按日历写法输出。
 * 分类比例尺保留类名本身。
 */
const autoFormat = computed<((value: unknown) => string) | null>(() => {
  const current = scale.value
  if (props.tickFormat || isBandScale(current))
    return null
  const tickFormat = (current as ScaleLinear<number, number> | ScaleTime<number, number>)
    .tickFormat(safeTickCount.value)
  return (value: unknown) => tickFormat(value as number & Date)
})

function format(value: unknown): string {
  const str = (props.tickFormat ?? autoFormat.value ?? String)(value)
  if (!props.truncate)
    return str
  const shortened = truncateCharacters(str, props.truncate, '')
  return shortened === str ? str : `${shortened}\u2026`
}

interface Tick {
  value: unknown
  offset: number
  label: string
}

/**
 * 生成刻度：分类轴一个类一个刻度、对齐到带中心，连续轴用 d3 的 `ticks()`。
 *
 * 标签会按可用空间自动抽稀：横向按「宽度 ÷ 最宽标签」、纵向按「高度 ÷ 行高」估计上限，
 * 再按等间隔跳过。`maxTicks` 由调用方指定时优先用它。
 */
const ticks = computed<Tick[]>(() => {
  const current = scale.value
  let allTicks: Tick[]
  if (isBandScale(current)) {
    const band = current as ScaleBand<string>
    allTicks = band.domain().map(d => ({
      value: d,
      offset: (band(d) ?? 0) + band.bandwidth() / 2,
      label: format(d),
    }))
  }
  else {
    const linear = current as ScaleLinear<number, number> | ScaleTime<number, number>
    allTicks = linear.ticks(safeTickCount.value).map(d => ({
      value: d,
      offset: linear(d as number & Date),
      label: format(d),
    }))
  }

  let cap = props.maxTicks
  if (cap == null && allTicks.length > 1) {
    if (isHorizontal.value && chart.width > 0) {
      const widestChars = allTicks.reduce((max, tick) => Math.max(max, characterCount(tick.label)), 1)
      const approxLabelPx = widestChars * 7 + 16
      cap = Math.max(1, Math.floor(chart.width / approxLabelPx))
    }
    else if (!isHorizontal.value && chart.height > 0) {
      // 约 12px 的字加一点余量，纵向堆叠的标签才不会互相贴住。
      cap = Math.max(1, Math.floor(chart.height / 18))
    }
  }
  if (cap && allTicks.length > cap) {
    const step = Math.ceil(allTicks.length / cap)
    allTicks = allTicks.filter((_, index) => index % step === 0)
  }
  return allTicks
})

const transform = computed(() => {
  if (props.position === 'bottom')
    return `translate(0,${chart.height})`
  if (props.position === 'right')
    return `translate(${chart.width},0)`
  return undefined
})

/**
 * 底轴的轴线默认压在绘图区底边；但 y 轴范围跨过 0 时，轴线要落在 0 的位置，
 * 才能代表「零」而不是图表边缘。分类 y 轴没有零可言，仍贴底边。
 */
const axisLineY = computed(() => {
  if (props.position !== 'bottom' || chart.yBandScale)
    return 0
  const domain = chart.yScale.domain()
  if (domain[0] < 0 && domain[1] > 0)
    return chart.yScale(0) - chart.height
  return 0
})

const tickTransition = computed(() => (props.animated
  ? 'transform 150ms linear, opacity 150ms ease'
  : undefined))

/** 刻度在绘图区坐标里的位置。超出绘图区一截的刻度淡出，滑动过程中不会突然跳出来。 */
function tickStyle(tick: Tick): Record<string, string | number> {
  const axisLength = isHorizontal.value ? chart.width : chart.height
  const isVisible = tick.offset >= -10 && tick.offset <= axisLength + 10
  return {
    transform: isHorizontal.value
      ? `translateX(${tick.offset}px)`
      : `translateY(${tick.offset}px)`,
    ...(tickTransition.value ? { transition: tickTransition.value } : {}),
    opacity: isVisible ? 1 : 0,
  }
}

const tickLineOffset = computed(() => (props.position === 'bottom' || props.position === 'right'
  ? TICK_SIZE
  : -TICK_SIZE))

const labelY = computed(() => (props.position === 'bottom' ? TICK_SIZE + 12 : -(TICK_SIZE + 4)))
const labelX = computed(() => (props.position === 'left' ? -(TICK_SIZE + 4) : TICK_SIZE + 4))
</script>

<template>
  <g
    :transform="transform"
    role="group"
    :aria-label="`${position} axis`"
  >
    <line
      v-if="renderAxisLine"
      :x1="0"
      :x2="isHorizontal ? width : 0"
      :y1="isHorizontal ? axisLineY : 0"
      :y2="isHorizontal ? axisLineY : height"
      class="astryx-chart-axis__line"
    />
    <g
      v-for="tick in ticks"
      :key="String(tick.value)"
      :style="tickStyle(tick)"
    >
      <template v-if="isHorizontal">
        <line
          v-if="showTicks"
          :y2="tickLineOffset"
          class="astryx-chart-axis__mark"
        />
        <text
          :y="labelY"
          text-anchor="middle"
          class="astryx-chart-axis__label"
        >
          {{ tick.label }}
        </text>
      </template>
      <template v-else>
        <line
          v-if="showTicks"
          :x2="tickLineOffset"
          class="astryx-chart-axis__mark"
        />
        <text
          :x="labelX"
          dy="0.32em"
          :text-anchor="position === 'left' ? 'end' : 'start'"
          class="astryx-chart-axis__label"
        >
          {{ tick.label }}
        </text>
      </template>
    </g>
  </g>
</template>
