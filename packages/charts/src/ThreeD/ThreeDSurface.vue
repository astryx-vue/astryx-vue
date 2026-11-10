<script setup lang="ts">
import type { ThreeDSurfaceProps } from './types.js'
import { computed } from 'vue'
import { use3D } from './context.js'
import { projectDatum3D } from './projection.js'

defineOptions({ name: 'AstryxThreeDSurface' })
const props = withDefaults(defineProps<ThreeDSurfaceProps>(), { opacity: 0.8, wireframe: false })
const chart = use3D()

function nearestColor(value: number): string {
  if (props.colorRange.length === 0)
    return 'currentColor'
  const scaled = Math.max(0, Math.min(1, value)) * (props.colorRange.length - 1)
  const low = Math.floor(scaled)
  const high = Math.min(low + 1, props.colorRange.length - 1)
  return scaled - low < 0.5 ? props.colorRange[low] : props.colorRange[high]
}

const faces = computed(() => {
  const xValues = [...new Set(chart.data.map(row => row[chart.xKey]).filter((value): value is number => typeof value === 'number' && Number.isFinite(value)))].sort((a, b) => a - b)
  const zValues = [...new Set(chart.data.map(row => row[chart.zKey]).filter((value): value is number => typeof value === 'number' && Number.isFinite(value)))].sort((a, b) => a - b)
  if (xValues.length < 2 || zValues.length < 2)
    return []

  const grid = new Map<string, Record<string, unknown>>()
  for (const row of chart.data)
    grid.set(`${row[chart.xKey]},${row[chart.zKey]}`, row)

  const result: { points: string, color: string, depth: number }[] = []
  for (let row = 0; row < zValues.length - 1; row++) {
    for (let column = 0; column < xValues.length - 1; column++) {
      const corners = [
        grid.get(`${xValues[column]},${zValues[row]}`),
        grid.get(`${xValues[column + 1]},${zValues[row]}`),
        grid.get(`${xValues[column + 1]},${zValues[row + 1]}`),
        grid.get(`${xValues[column]},${zValues[row + 1]}`),
      ].filter((corner): corner is Record<string, unknown> => corner != null)
      if (corners.length !== 4)
        continue
      const projected = corners.flatMap((corner) => {
        const point = projectDatum3D(chart, corner)
        return point ? [point] : []
      })
      if (projected.length !== 4)
        continue
      result.push({
        points: projected.map(point => `${point.px},${point.py}`).join(' '),
        color: nearestColor(projected.reduce((sum, point) => sum + point.ny, 0) / 4),
        depth: projected.reduce((sum, point) => sum + point.depth, 0) / 4,
      })
    }
  }
  return result.sort((a, b) => a.depth - b.depth)
})

const opacity = computed(() => Number.isFinite(props.opacity) ? Math.max(0, Math.min(1, props.opacity)) : 0.8)
</script>

<template>
  <g class="astryx-three-d-surface" :class="{ 'astryx-three-d-surface--wireframe': props.wireframe }">
    <polygon
      v-for="(face, index) in faces"
      :key="index"
      :points="face.points"
      :fill="props.wireframe ? 'none' : face.color"
      :fill-opacity="opacity"
      :stroke="face.color"
      :stroke-width="props.wireframe ? 1 : 0.5"
      :stroke-opacity="props.wireframe ? 0.8 : 0.3"
    />
  </g>
</template>
