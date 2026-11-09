<script setup lang="ts">
import type { RadialAreaProps } from './types.js'
import { computed } from 'vue'
import { useRadial } from './context.js'

defineOptions({ name: 'AstryxRadialArea' })
const props = withDefaults(defineProps<RadialAreaProps>(), {
  opacity: 0.2,
  strokeWidth: 2,
  dots: false,
  dotRadius: 4,
})
const radial = useRadial()

const points = computed(() => {
  const { axes, angleByAxis, radiusScale, axisDomains, data, cx, cy } = radial
  if (!axes || !angleByAxis || !radiusScale || !axisDomains)
    return []
  const datum = data.find(row => Object.values(row).some(value => value === props.dataKey)) ?? data[0]
  if (!datum)
    return []

  return axes.map((key) => {
    const angle = angleByAxis.get(key)
    const domain = axisDomains.get(key)
    if (angle == null || !domain)
      return { x: cx, y: cy, key }
    const raw = typeof datum[key] === 'number' && Number.isFinite(datum[key]) ? datum[key] as number : 0
    const [min, max] = domain
    const ratio = max > min ? (raw - min) / (max - min) : 0
    const radius = radiusScale(Math.max(0, Math.min(1, ratio)))
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      key,
    }
  })
})

const pathPoints = computed(() => points.value.map(point => `${point.x},${point.y}`).join(' '))
</script>

<template>
  <g v-if="points.length > 0" class="astryx-radial-area">
    <polygon
      :points="pathPoints"
      :fill="color"
      :fill-opacity="opacity"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linejoin="round"
    />
    <template v-if="dots">
      <circle
        v-for="point in points"
        :key="point.key"
        :cx="point.x"
        :cy="point.y"
        :r="dotRadius"
        :fill="color"
      />
    </template>
  </g>
</template>
