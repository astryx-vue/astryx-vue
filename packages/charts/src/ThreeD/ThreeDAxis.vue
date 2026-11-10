<script setup lang="ts">
import type { ThreeDAxisProps } from './types.js'
import { useLocale } from '@astryx-vue/core'
import { computed, ref, watchPostEffect } from 'vue'
import { compactNumber } from '../formatters.js'
import { use3D } from './context.js'

defineOptions({ name: 'AstryxThreeDAxis' })
const props = withDefaults(defineProps<ThreeDAxisProps>(), { labels: true })
const chart = use3D()
const { locale } = useLocale()

const origin = computed(() => chart.project(0, 0, 0))
const axes = computed(() => [
  { key: chart.xKey, domain: chart.xDomain, end: chart.project(1, 0, 0) },
  { key: chart.yKey, domain: chart.yDomain, end: chart.project(0, 1, 0) },
  { key: chart.zKey, domain: chart.zDomain, end: chart.project(0, 0, 1) },
].map(axis => ({
  ...axis,
  label: `${axis.key} [${compactNumber(axis.domain[0], locale.value)}–${compactNumber(axis.domain[1], locale.value)}]`,
})))

const labelWidths = ref<Record<string, number>>({})
const textElements = new Map<string, SVGTextElement>()

function setTextRef(key: string, element: unknown): void {
  if (element)
    textElements.set(key, element as SVGTextElement)
  else
    textElements.delete(key)
}

watchPostEffect(() => {
  const next: Record<string, number> = {}
  for (const axis of axes.value) {
    const width = textElements.get(axis.key)?.getComputedTextLength?.() ?? 0
    if (width > 0)
      next[axis.key] = width
  }
  const same = Object.keys(next).length === Object.keys(labelWidths.value).length
    && Object.entries(next).every(([key, width]) => labelWidths.value[key] === width)
  if (!same)
    labelWidths.value = next
})

/** 优先放在轴端右侧；越界时改到左侧，再用实际文字宽度收进画布。 */
const placedAxes = computed(() => axes.value.map((axis) => {
  const labelWidth = labelWidths.value[axis.key] ?? 0
  let x = axis.end.px + 8
  let anchor: 'start' | 'end' = 'start'
  if (labelWidth > 0 && x + labelWidth > chart.width - 4) {
    x = axis.end.px - 8
    anchor = 'end'
  }
  if (labelWidth > 0) {
    const min = anchor === 'start' ? 4 : labelWidth + 4
    const max = anchor === 'start' ? chart.width - labelWidth - 4 : chart.width - 4
    x = Math.max(min, Math.min(x, max))
  }
  return {
    ...axis,
    x,
    y: Math.max(12, Math.min(chart.height - 4, axis.end.py)),
    anchor,
  }
}))
</script>

<template>
  <g class="astryx-three-d-axis">
    <line
      v-for="axis in axes"
      :key="axis.key"
      :x1="origin.px"
      :y1="origin.py"
      :x2="axis.end.px"
      :y2="axis.end.py"
    />
    <text
      v-for="axis in props.labels ? placedAxes : []"
      :key="`${axis.key}-label`"
      :ref="(element) => setTextRef(axis.key, element)"
      :x="axis.x"
      :y="axis.y"
      :text-anchor="axis.anchor"
      dominant-baseline="central"
    >
      {{ axis.label }}
    </text>
  </g>
</template>
