<script setup lang="ts">
import type { RadialGridProps } from './types.js'
import { computed } from 'vue'
import { polarPoint } from './arc.js'
import { useRadial } from './context.js'

defineOptions({ name: 'AstryxRadialGrid' })
const props = withDefaults(defineProps<RadialGridProps>(), { rings: 5 })
const radial = useRadial()

const ringPoints = computed(() => {
  const { axes, angleByAxis, radiusScale, cx, cy } = radial
  if (!axes || !angleByAxis || !radiusScale)
    return []
  const count = Number.isFinite(props.rings) ? Math.max(0, Math.floor(props.rings)) : 0
  return Array.from({ length: count }, (_, index) => {
    const radius = radiusScale((index + 1) / count)
    return axes.map((key) => {
      const angle = angleByAxis.get(key)
      if (angle == null)
        return ''
      const point = polarPoint(cx, cy, angle, radius)
      return `${point.x},${point.y}`
    }).filter(Boolean).join(' ')
  })
})

const axisLines = computed(() => {
  const { axes, angleByAxis, cx, cy, innerRadius, radius } = radial
  if (!axes || !angleByAxis)
    return []
  return axes.flatMap((key) => {
    const angle = angleByAxis.get(key)
    if (angle == null)
      return []
    const start = polarPoint(cx, cy, angle, innerRadius)
    const end = polarPoint(cx, cy, angle, radius)
    return [{ key, x1: start.x, y1: start.y, x2: end.x, y2: end.y }]
  })
})
</script>

<template>
  <g v-if="ringPoints.length > 0" class="astryx-radial-grid">
    <polygon
      v-for="(points, index) in ringPoints"
      :key="index"
      :points="points"
      fill="none"
    />
    <line
      v-for="line in axisLines"
      :key="line.key"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
    />
  </g>
</template>
