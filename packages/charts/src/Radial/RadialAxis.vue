<script setup lang="ts">
import type { RadialAxisProps } from './types.js'
import { computed, ref, watchPostEffect } from 'vue'
import { useRadial } from './context.js'

defineOptions({ name: 'AstryxRadialAxis' })
const props = withDefaults(defineProps<RadialAxisProps>(), { labelOffset: 16 })
const radial = useRadial()

const labelWidths = ref<Record<string, number>>({})
const textElements = new Map<string, SVGTextElement>()

const labels = computed(() => {
  const { axes, angleByAxis, cx, cy, radius } = radial
  if (!axes || !angleByAxis)
    return []
  return axes.flatMap((key) => {
    const angle = angleByAxis.get(key)
    if (angle == null)
      return []
    const cosine = Math.cos(angle)
    return [{
      key,
      x: cx + cosine * (radius + props.labelOffset),
      y: cy + Math.sin(angle) * (radius + props.labelOffset),
      anchor: cosine > 0.1 ? 'start' : cosine < -0.1 ? 'end' : 'middle',
    }]
  })
})

/** 窄容器里只移动会越界的标签，其他标签仍贴着原来的顶点。 */
const placedLabels = computed(() => labels.value.map((label) => {
  const width = labelWidths.value[label.key] ?? 0
  const chartWidth = radial.cx * 2
  if (width <= 0)
    return label
  let x = label.x
  if (label.anchor === 'start')
    x = Math.min(x, chartWidth - width - 4)
  else if (label.anchor === 'end')
    x = Math.max(x, width + 4)
  else
    x = Math.max(width / 2 + 4, Math.min(x, chartWidth - width / 2 - 4))
  return { ...label, x }
}))

function setTextRef(key: string, element: unknown): void {
  if (element)
    textElements.set(key, element as SVGTextElement)
  else
    textElements.delete(key)
}

watchPostEffect(() => {
  const next: Record<string, number> = {}
  for (const label of labels.value) {
    const element = textElements.get(label.key)
    const width = element?.getComputedTextLength?.() ?? 0
    if (width > 0)
      next[label.key] = width
  }
  const same = Object.keys(next).length === Object.keys(labelWidths.value).length
    && Object.entries(next).every(([key, width]) => labelWidths.value[key] === width)
  if (!same)
    labelWidths.value = next
})
</script>

<template>
  <g class="astryx-radial-axis">
    <text
      v-for="label in placedLabels"
      :key="label.key"
      :ref="(element) => setTextRef(label.key, element)"
      :x="label.x"
      :y="label.y"
      :text-anchor="label.anchor"
      dominant-baseline="central"
    >
      {{ label.key }}
    </text>
  </g>
</template>
