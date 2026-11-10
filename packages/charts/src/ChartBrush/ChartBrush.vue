<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { BrushRange, ChartBrushEmits, ChartBrushProps } from './types.js'
import { computed, ref } from 'vue'
import { useChart } from '../context.js'
import { localChartPoint } from '../interactions/pointer.js'
import { isBandScale } from '../utils.js'

defineOptions({ name: 'AstryxChartBrush' })
const props = withDefaults(defineProps<ChartBrushProps>(), {
  mode: 'x',
  color: 'var(--astryx-color-accent)',
  opacity: 0.15,
})
const emit = defineEmits<ChartBrushEmits>()
const chart = useChart()
const brush = ref<{ x0: number, y0: number, x1: number, y1: number } | null>(null)
const dragging = ref(false)
const start = ref({ x: 0, y: 0 })

function onPointerDown(event: PointerEvent): void {
  const point = localChartPoint(event)
  if (!point)
    return
  const target = event.currentTarget as SVGRectElement
  target.setPointerCapture?.(event.pointerId)
  dragging.value = true
  start.value = point
  brush.value = { x0: point.x, y0: point.y, x1: point.x, y1: point.y }
}

function onPointerMove(event: PointerEvent): void {
  if (!dragging.value)
    return
  const point = localChartPoint(event)
  if (!point)
    return
  const origin = start.value
  brush.value = props.mode === 'x'
    ? {
        x0: Math.min(origin.x, point.x),
        y0: 0,
        x1: Math.max(origin.x, point.x),
        y1: chart.height,
      }
    : {
        x0: Math.min(origin.x, point.x),
        y0: Math.min(origin.y, point.y),
        x1: Math.max(origin.x, point.x),
        y1: Math.max(origin.y, point.y),
      }
}

function onPointerCancel(): void {
  dragging.value = false
  brush.value = null
}

function onPointerUp(): void {
  dragging.value = false
  const selected = brush.value
  if (!selected)
    return
  const dx = Math.abs(selected.x1 - selected.x0)
  const dy = Math.abs(selected.y1 - selected.y0)
  if (dx < 3 && (props.mode === 'x' || dy < 3)) {
    brush.value = null
    emit('clear')
    return
  }
  if (isBandScale(chart.xScale)) {
    brush.value = null
    return
  }

  const xMin = chart.xScale.invert(selected.x0)
  const xMax = chart.xScale.invert(selected.x1)
  const range: BrushRange = { x: [xMin, xMax] }
  let data: Record<string, unknown>[]
  if (props.mode === 'xy') {
    const yMin = chart.yScale.invert(selected.y1)
    const yMax = chart.yScale.invert(selected.y0)
    range.y = [yMin, yMax]
    data = chart.data.filter((row) => {
      const x = row[chart.xKey]
      if (typeof x !== 'number' || x < xMin || x > xMax)
        return false
      return Object.entries(row).some(([key, value]) => key !== chart.xKey && typeof value === 'number' && value >= yMin && value <= yMax)
    })
  }
  else {
    data = chart.data.filter((row) => {
      const value = row[chart.xKey]
      return typeof value === 'number' && value >= xMin && value <= xMax
    })
  }
  emit('brush', range, data)
}

const captureStyle: CSSProperties = { cursor: 'crosshair', touchAction: 'none', userSelect: 'none' }
const selectionStyle = computed(() => ({ fill: props.color, fillOpacity: props.opacity, stroke: props.color, strokeOpacity: 0.4 }))
</script>

<template>
  <g class="astryx-chart-brush">
    <rect
      x="0"
      y="0"
      :width="chart.width"
      :height="chart.height"
      fill="transparent"
      :style="captureStyle"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
    />
    <rect
      v-if="brush && (Math.abs(brush.x1 - brush.x0) > 1 || Math.abs(brush.y1 - brush.y0) > 1)"
      :x="brush.x0"
      :y="brush.y0"
      :width="Math.abs(brush.x1 - brush.x0)"
      :height="Math.abs(brush.y1 - brush.y0)"
      :style="selectionStyle"
      stroke-width="1"
      :rx="mode === 'xy' ? 2 : 0"
      pointer-events="none"
    />
  </g>
</template>
