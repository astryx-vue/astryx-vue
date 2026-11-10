<script setup lang="ts">
import type { ThreeDScatterProps } from './types.js'
import { computed } from 'vue'
import { use3D } from './context.js'
import { projectDatum3D } from './projection.js'

defineOptions({ name: 'AstryxThreeDScatter' })
const props = withDefaults(defineProps<ThreeDScatterProps>(), { radius: 4, opacity: 0.85 })
const chart = use3D()

const points = computed(() => chart.data.flatMap((row, index) => {
  const point = projectDatum3D(chart, row)
  return point ? [{ ...point, index }] : []
}).sort((a, b) => a.depth - b.depth))

function depthFactor(depth: number): number {
  return 0.75 + (depth + 0.5) * 0.25
}

function radius(depth: number): number {
  return Math.max(0, Number.isFinite(props.radius) ? props.radius : 4) * depthFactor(depth)
}

function opacity(depth: number): number {
  const base = Number.isFinite(props.opacity) ? props.opacity : 0.85
  return Math.max(0, Math.min(1, base * depthFactor(depth)))
}
</script>

<template>
  <g class="astryx-three-d-scatter">
    <circle
      v-for="point in points"
      :key="point.index"
      :cx="point.px"
      :cy="point.py"
      :r="radius(point.depth)"
      :fill="props.color"
      :fill-opacity="opacity(point.depth)"
    />
  </g>
</template>
