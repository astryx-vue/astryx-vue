<script setup lang="ts">
import type { ThreeDBarProps } from './types.js'
import { computed } from 'vue'
import { use3D } from './context.js'
import { projectDatum3D } from './projection.js'

defineOptions({ name: 'AstryxThreeDBar' })
const props = withDefaults(defineProps<ThreeDBarProps>(), { barWidth: 0.06, barDepth: 0.06 })
const chart = use3D()

function size(value: number, fallback: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : fallback
}

function pointsCoordinates(points: { px: number, py: number }[]): string {
  return points.map(point => `${point.px},${point.py}`).join(' ')
}

const bars = computed(() => chart.data.flatMap((row, index) => {
  const point = projectDatum3D(chart, row)
  if (!point)
    return []
  const halfWidth = size(props.barWidth, 0.06) / 2
  const halfDepth = size(props.barDepth, 0.06) / 2
  const { nx, ny, nz } = point
  const topFL = chart.project(nx - halfWidth, ny, nz - halfDepth)
  const topFR = chart.project(nx + halfWidth, ny, nz - halfDepth)
  const topBL = chart.project(nx - halfWidth, ny, nz + halfDepth)
  const topBR = chart.project(nx + halfWidth, ny, nz + halfDepth)
  const botFL = chart.project(nx - halfWidth, 0, nz - halfDepth)
  const botFR = chart.project(nx + halfWidth, 0, nz - halfDepth)
  const botBR = chart.project(nx + halfWidth, 0, nz + halfDepth)
  const avgDepth = (topFL.depth + topBR.depth + botFL.depth + botBR.depth) / 4
  return [{
    index,
    avgDepth,
    faces: [
      { points: pointsCoordinates([botFL, botFR, topFR, topFL]), opacity: 0.9 },
      { points: pointsCoordinates([botFR, botBR, topBR, topFR]), opacity: 0.7 },
      { points: pointsCoordinates([topFL, topFR, topBR, topBL]), opacity: 1 },
    ],
  }]
}).sort((a, b) => a.avgDepth - b.avgDepth))
</script>

<template>
  <g class="astryx-three-d-bars">
    <g v-for="bar in bars" :key="bar.index" class="astryx-three-d-bar">
      <polygon
        v-for="(face, faceIndex) in bar.faces"
        :key="faceIndex"
        :points="face.points"
        :fill="props.color"
        :fill-opacity="face.opacity"
        :stroke="props.color"
        stroke-width="0.5"
      />
    </g>
  </g>
</template>
