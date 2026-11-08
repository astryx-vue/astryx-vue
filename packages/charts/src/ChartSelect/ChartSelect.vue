<script setup lang="ts">
import type { ChartSelectEmits, ChartSelectProps } from './types.js'
import { computed } from 'vue'
import { useChart } from '../context.js'
import { localChartPoint } from '../interactions/pointer.js'

defineOptions({ name: 'AstryxChartSelect' })
const props = withDefaults(defineProps<ChartSelectProps>(), {
  selected: () => [],
  color: 'var(--astryx-color-accent)',
  radius: 6,
})
const emit = defineEmits<ChartSelectEmits>()
const chart = useChart()

/** 上游也按第一条数值系列定位；这里直接复用图表根已算好的点位。 */
const points = computed(() => chart.resolved.values().next().value ?? [])
const rings = computed(() => {
  const selected = new Set(props.selected)
  return points.value.filter(point => selected.has(point.dataIndex))
})

function onPointerUp(event: PointerEvent): void {
  const local = localChartPoint(event)
  if (!local)
    return

  let nearestIndex = -1
  let nearestDistance = Number.POSITIVE_INFINITY
  for (const point of points.value) {
    const distance = Math.hypot(point.px - local.x, point.py - local.y)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = point.dataIndex
    }
  }
  const datum = chart.data[nearestIndex]
  if (nearestDistance > 30 || nearestIndex < 0 || !datum)
    return

  emit('select', datum, nearestIndex)
  if (event.shiftKey || event.metaKey) {
    emit('selectionChange', props.selected.includes(nearestIndex)
      ? props.selected.filter(index => index !== nearestIndex)
      : [...props.selected, nearestIndex])
  }
  else {
    emit('selectionChange', [nearestIndex])
  }
}
</script>

<template>
  <g class="astryx-chart-select">
    <rect
      x="0"
      y="0"
      :width="chart.width"
      :height="chart.height"
      fill="transparent"
      style="cursor: pointer"
      @pointerup="onPointerUp"
    />
    <circle
      v-for="point in rings"
      :key="point.dataIndex"
      :cx="point.px"
      :cy="point.py"
      :r="radius"
      fill="none"
      :stroke="color"
      stroke-width="2"
      pointer-events="none"
    />
  </g>
</template>
