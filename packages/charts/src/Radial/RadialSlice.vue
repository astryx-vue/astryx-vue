<script setup lang="ts">
import type { RadialSliceProps } from './types.js'
import { computed } from 'vue'
import { radialArcPath } from './arc.js'
import { useRadial } from './context.js'

defineOptions({ name: 'AstryxRadialSlice' })
const props = withDefaults(defineProps<RadialSliceProps>(), {
  cornerRadius: 0,
  labels: true,
  labelThreshold: 5,
})
const radial = useRadial()

const sliceViews = computed(() => {
  const { slices, cx, cy, radius, innerRadius } = radial
  if (!slices)
    return []
  return slices.flatMap((slice, index) => {
    if (slice.value <= 0 || slice.endAngle <= slice.startAngle)
      return []
    const color = props.colors.length > 0
      ? props.colors[index % props.colors.length]
      : 'var(--astryx-color-accent)'
    const middle = (slice.startAngle + slice.endAngle) / 2
    const labelRadius = innerRadius + (radius - innerRadius) * 0.6
    return [{
      key: `${slice.key}-${index}`,
      path: radialArcPath(innerRadius, radius, slice.startAngle, slice.endAngle, props.cornerRadius),
      transform: `translate(${cx} ${cy})`,
      color,
      percentage: `${Math.round(slice.percentage * 100)}%`,
      showLabel: props.labels && slice.percentage * 100 >= props.labelThreshold,
      labelX: cx + Math.cos(middle) * labelRadius,
      labelY: cy + Math.sin(middle) * labelRadius,
    }]
  })
})
</script>

<template>
  <g class="astryx-radial-slices">
    <g v-for="slice in sliceViews" :key="slice.key">
      <path
        :d="slice.path"
        :transform="slice.transform"
        :fill="slice.color"
        :stroke-width="cornerRadius > 0 ? 0 : 1"
        class="astryx-radial-slice"
      />
      <text
        v-if="slice.showLabel"
        :x="slice.labelX"
        :y="slice.labelY"
        text-anchor="middle"
        dominant-baseline="central"
        class="astryx-radial-slice__label"
      >
        {{ slice.percentage }}
      </text>
    </g>
  </g>
</template>
